import { BN, isHex, hexToU8a } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, Keyring } from '@polkadot/api';
import { ISubmittableResult } from '@polkadot/types/types';
import type { Address, PeaqEvent, PeaqEventData, SignTransction } from '../../types';

type TErrorData = {
  Module?: {
    index?: string;
    error?: string;
  };
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
    const keyring = new Keyring({ type: 'sr25519' });
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

  protected async _signTransaction(
    option: SignTransction
  ): Promise<PeaqEvent[]>{
    const { extrinsics, nonce, address, statusCallback } = option;
    const api = this._getApi();
    let subscribed = false;
    try {
      await extrinsics.signAsync(address, { nonce });
    } catch (error: any) {
      throw new Error(error);
    }
    try {
      let eventsTriggeredByTx: PeaqEvent[] = []
      const unsub = extrinsics.send(async (result: ISubmittableResult) => {
        if (
          (result.status.isInBlock || result.status.isFinalized) &&
          !subscribed
        ) {
          subscribed = true;
          let inclusionBlockHash;
          if (result.status.isInBlock) {
            inclusionBlockHash = result.status.asInBlock.toString();
          } else if (result.status.isFinalized) {
            inclusionBlockHash = result.status.asFinalized.toString();
          }
          const inclusionBlockHeader = await api.rpc.chain.getHeader(
            inclusionBlockHash
          );
          const inclusionBlockNr = inclusionBlockHeader.number.toBn();
          const executionBlockStartNr = inclusionBlockNr.addn(0);
          const executionBlockStopNr = inclusionBlockNr.addn(10);
          const executionBlockNr = executionBlockStartNr;
          const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
            async (lastHeader) => {
              const lastBlockNumber = lastHeader.number.toBn();
              if (executionBlockNr.gt(executionBlockStopNr)) {
                unsubscribeNewHeads();
                throw new Error(`Tx([${extrinsics.hash.toString()}])
                was not executed in blocks : ${executionBlockStartNr.toString()}..${executionBlockStopNr.toString()}`);
              }

              if (lastBlockNumber.gte(executionBlockNr)) {
                const blockHash = await api.rpc.chain.getBlockHash(
                  executionBlockNr
                );
                const blockHeader = await api.rpc.chain.getHeader(blockHash);
                const apiAt = await api.at(blockHeader.hash);
                const blockEvents: any = await apiAt.query?.["system"]?.['events'];
                eventsTriggeredByTx = blockEvents
                .map((eventRecord: any) => {
                  const { event, phase } = eventRecord;
                  const types = event.typeDef;
                  const eventData: PeaqEventData[] = event.data.map((d: any, i: any) => {
                    return {
                      lookupName: types[i].lookupName!,
                      data: d
                    };
                  })
                  return {
                    event,
                    phase,
                    section: event?.section,
                    method: event.method,
                    eventData,
                    error: this._transactionError(event?.method, eventData)
                  } as unknown as PeaqEvent
                })
              }
            }
          );
        }
      });
      return eventsTriggeredByTx
    } catch (error: any) {
      throw new Error(
        error.message ||
          error.description ||
          error.data?.toString() ||
          error.toString()
      );
    }
  }

  protected async _transactionError(method: string, eventData: PeaqEventData[]){
    const failedEvent = method === "ExtrinsicFailed";
    const api = this._getApi()
    if (failedEvent){
      const error = eventData.find((item) => item.lookupName.includes("DispatchError"))
      const errorData = error?.data?.toHuman?.() as TErrorData | undefined;
      const errorIdx = errorData?.Module?.error;
      const moduleIdx = errorData?.Module?.index;
      if (errorIdx && moduleIdx){
        try{
          const decode = api.registry.findMetaError({
            error: isHex(errorIdx) ? hexToU8a(errorIdx) : new BN(errorIdx),
            index: new BN(moduleIdx)
          });
          return {
            documentation: decode.docs,
            name: decode.name
          };
        }catch(error){
          return {
            documentation: ["Unknown error"],
            name: "UnknownError"
          };
        }
      }
    }else{
      return {
        documentation: ["Unknown error"],
        name: "UnknownError"
      };
    }
    return null;
  }
}
