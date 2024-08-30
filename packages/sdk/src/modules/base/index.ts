import { BN, isHex, hexToU8a } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, Keyring } from '@polkadot/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import type {
  Address,
  PeaqEvent,
  PeaqEventData,
  SignTransction,
} from '../../types';
import { GenericExtrinsic } from '@polkadot/types';
import { AnyTuple } from '@polkadot/types-codec/types';
import { truncatedString } from '../../utils';

type TErrorData = {
  dispatchError: {
    Module?: {
      index?: string;
      error?: string;
    };
  }
  dispatchInfo: {
    weight?: {
      refTime?: string,
      proofSize?: string
    },
    class?: string,
    paysFee?: string
  }
};

export class Base {
  private _nonceStore: Map<Address, BN>;

  constructor(protected _api?: ApiPromise) {
    this._nonceStore = new Map();
  }

  protected _getApi(): ApiPromise {
    if (!this._api || !this._api.isConnected)
      throw new Error('API is not connected');
    return this._api;
  }

  protected _getKeyPair = (seed: string): KeyringPair => {
    if (!seed) {
      throw new Error('Seed is required');
    }
    const keyring = new Keyring({ ss58Format: 42, type: 'sr25519' });

    return keyring.addFromUri(seed);
  };

  protected async _getNonce(address: Address): Promise<BN> {
    const api = this._getApi();

    const onChainNonce: BN = (
      await api.rpc.system.accountNextIndex(address)
    ).toBn() as BN;

    const currentNonce = (
      this._nonceStore.has(address) ? this._nonceStore.get(address) : new BN(0)
    ) as BN;

    const nonce = onChainNonce?.gt(currentNonce) ? onChainNonce : currentNonce;

    const newNonce = nonce?.addn(1);

    this._nonceStore.set(address, newNonce);
    return nonce;
  }

  protected _validateInput(input: string){
    const maxLength = 32
    if(!input){
      throw new Error("Input is required");
    }
    if(input.length !== maxLength){
      throw new Error("Input should be 32 length");
    }
    return true
  }

  protected async _serializeTx(
    api: ApiPromise,
    tx: SubmittableExtrinsic<'promise'>
  ) {
    const methodObject = JSON.parse(tx.method.toString());
    const args = JSON.stringify(methodObject.args);
    const callDecoded = api.registry.findMetaCall(tx.method.callIndex);
    if (callDecoded.method == 'sudo' && callDecoded.method == 'sudo') {
      const sudoCallIndex = (tx.method.args[0] as any).callIndex;
      const sudoCallArgs = JSON.stringify(methodObject.args.call.args);
      const sudoCallDecoded = api.registry.findMetaCall(sudoCallIndex);
      return ` (sudo:: ${sudoCallDecoded.section}:: ${sudoCallDecoded.method}(${sudoCallArgs})`;
    } else {
      return ` (${callDecoded.section}:: ${callDecoded.method}(${args}))`;
    }
  }

  protected async _transactionError(
    method: string,
    eventData: PeaqEventData
  ): Promise<{ documentation: string[]; name: string, section: string } | null> {
    const failedEvent = method === 'ExtrinsicFailed';
    const api = this._getApi();
    if (failedEvent) {
      const error = eventData;
      const errorData = error?.data?.toHuman?.() as TErrorData | undefined;
      const errorIdx = errorData?.dispatchError.Module?.error;
      const moduleIdx = errorData?.dispatchError.Module?.index;
      if (errorIdx && moduleIdx) {
        try {
          const decode = api.registry.findMetaError({
            error: isHex(errorIdx) ? hexToU8a(errorIdx) : new BN(errorIdx),
            index: new BN(moduleIdx),
          });
          return {
            documentation: decode.docs,
            name: decode.name,
            section: decode.section
          };
        } catch (error) {
          return {
            documentation: ['Unknown error'],
            name: 'UnknownError',
            section: 'UnknownSection'
          };
        }
      }
    } else {
      return {
        documentation: ['Unknown error'],
        name: 'UnknownError',
        section: 'UnknownSection'
      };
    }
    return null;
  }

  protected async _newSignTx(option: SignTransction): Promise<PeaqEvent[]> {
    return new Promise<PeaqEvent[]>(async (resolve, reject) => {
      const { extrinsics, nonce, address, statusCallback } = option;
      const api = this._getApi();
      let subscribed = false;

      try { 
        // Sign the transaction
        await extrinsics.signAsync(address, { nonce });
      } catch (error: any) {
        reject(error);
      }

      try {
        // Send the transaction and listen for events
        const unsub = await extrinsics.send(
          async (result: ISubmittableResult) => {
            statusCallback?.(result);

            if (
              (result.status.isInBlock || result.status.isFinalized) &&
              !subscribed
            ) {
              // Handle transaction inclusion
              subscribed = true;

              let inclusionBlockHash;
              if (result.status.isInBlock) {
                inclusionBlockHash = result.status.asInBlock.toString();
              } if (result.status.isFinalized) {
                inclusionBlockHash = result.status.asFinalized.toString();
              }

              // Get inclusion block details
              const inclusionBlockHeader = await api.rpc.chain.getHeader(
                inclusionBlockHash
              );
              const inclusionBlockNr = inclusionBlockHeader.number.toBn();
              const executionBlockStartNr = inclusionBlockNr.addn(0);
              const executionBlockStopNr = inclusionBlockNr.addn(10);
              let executionBlockNr = executionBlockStartNr;

              // save instance of current block hash for peaqEvent
              const _inclusionBlockHash = inclusionBlockHash;

              // Subscribe to new blocks
              const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
                async (lastHeader) => {
                  const lastBlockNumber = lastHeader.number.toBn();

                  if (executionBlockNr.gt(executionBlockStopNr)) {
                    // Transaction not executed within expected blocks
                    unsubscribeNewHeads();
                    reject(
                      `Tx([${extrinsics.hash.toString()}]) was not executed in blocks: ${executionBlockStartNr.toString()}..${executionBlockStopNr.toString()}`
                    );
                    unsub();
                    return;
                  }

                  if (lastBlockNumber.gte(executionBlockNr)) {
                    const blockHash = await api.rpc.chain.getBlockHash(
                      executionBlockNr
                    );
                    const blockHeader = await api.rpc.chain.getHeader(
                      blockHash
                    );
                    const extinsics: GenericExtrinsic<AnyTuple>[] = (
                      await api.rpc.chain.getBlock(blockHeader.hash)
                    ).block.extrinsics;

                    executionBlockNr.iaddn(1);

                    const index = extinsics.findIndex((extrinsic) => {
                      return (
                        extrinsic.hash.toString() === extrinsics.hash.toString()
                      );
                    });

                    if (index < 0) {
                      return;
                    } else {
                      unsubscribeNewHeads();
                    }

                    const events = await result.events;
                    const peaqEvents = events.map(({ event, phase }) => {
                      const { data, method, section } = event;
                      const eventData: PeaqEventData = { lookupName: method, data: data };
                      return {
                        event: event,
                        phase: phase,
                        section: section,
                        method: method,
                        eventData: [eventData],
                        blockHash: _inclusionBlockHash
                      } as PeaqEvent;
                    });
                    // check for any failed extrinsics
                    const extrinsicFailedEvents = peaqEvents.filter(peaqEvent => peaqEvent.method === "ExtrinsicFailed");
                    if (extrinsicFailedEvents.length > 0) {
                      const eventData = extrinsicFailedEvents[0].eventData[0];
                      const errorResp = await this._transactionError(extrinsicFailedEvents[0].method, eventData);
                      reject(
                        new Error(
                          `${errorResp?.name} for ${errorResp?.section}.`
                        )
                      );
                    }
                    resolve(peaqEvents);
                    unsub();
                  }
                }
              );
            }if (result.isError) {
              console.info(
                'Transaction Error Result',
                JSON.stringify(result, null, 2)
              );
              reject(`Tx([${extrinsics.hash.toString()}]) Transaction error`);
            }
          }
        );
      } catch (error: any) {
        reject({
          data:
            error.message ||
            error.description ||
            error.data?.toString() ||
            error.toString(),
        });
      }
    });
  }
}
