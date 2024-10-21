import { Base } from '../base';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/keyring';
import type { ISubmittableResult } from '@polkadot/types/types';

import { ChainIdError, CreateKeyBindError, ClaimAccountError, GenerateSignatureError } from '../../utils/errors';
import type { SDKMetadata } from '../../types';
import { ethers, Wallet } from "ethers";

interface ClaimAccountOptions {
  network: string;
  substrateSeed: string;
  ethPrivate: string;
}

interface ClaimAccountResult {
  message: string;
  evm: string;
  substrate: string;
}

enum ChainID {
  AGUNG = 9990,
  KREST = 2241,
  PEAQ = 3338,
}


export class Unification extends Base {
    constructor(
      protected override readonly _api?: ApiPromise,
      protected readonly _metadata?: SDKMetadata,
  
    ) {
      super();
    }

  /**
   * Binds a SS58 Substrate wallet to a newly created H160 Ethereum wallet using the address unification pallet peaq provides.
   * Make sure the H160 wallet is new and has no transactions.
   * 
   * @param options ClaimAccountOptions - The options for binding the addresses.
   * @returns CreateDidResult - Contains the block_hash of the executed transaction and unsubscribe() to terminate event listening.
   */
  public async claimAccount(options: ClaimAccountOptions, statusCallback?: (result: ISubmittableResult) => void | Promise<void>): Promise<ClaimAccountResult> {
    try {
        const api = this._getApi();

        const { network, substrateSeed, ethPrivate} = options;
        if (!network) throw new Error("Error: No network provided.");
        if (!substrateSeed) throw new Error("Error: No substrate private key provided.");
        if (!ethPrivate) throw new Error("Error: No ethereum private key provided.");

        const keyPair = this._getKeyPair(substrateSeed);
        const ss58Address = keyPair.address;

        const signer = new ethers.Wallet(ethPrivate);
        const evmAddress = signer.address;

        const ethSignature = await this._createKeyBind(network, ss58Address, signer);

        const attributeExtrinsic = api.tx?.['addressUnification']?.['claimAccount'](
          evmAddress,
          ethSignature
        );

        const nonce = await this._getNonce(keyPair.address);
        const eventData = await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
        const unsubscribe = await attributeExtrinsic.send((result) => {
          statusCallback &&
            statusCallback(result as unknown as ISubmittableResult);
        });

        return {
          message: "Address Unification Successful.",
          evm:  `${evmAddress}`,
          substrate: `${ss58Address}`
      }
    } catch (error) {
      throw new ClaimAccountError(`${error}`);
    }
  }

  protected async _createKeyBind(network: string, ss58Address: string, signer: Wallet): Promise <string>{
    try {
      const api = this._getApi();

      const chainId = await this._getChainId(network);

      const signature = await this._generateSignature(
        signer,
        ss58Address,
        chainId.toString()
      );
      
      return signature;

    } catch (error){
      throw new CreateKeyBindError(`${error}`);
    }
  }

  protected async _generateSignature(signer: Wallet, ss58Address: string, chainId: string) {
    try {
      const api = this._getApi();
      const blockHash = await api.rpc.chain.getBlockHash(0); 
      
      return await signer.signTypedData(
        {
          name: "Peaq EVM claim",
          version: "1",
          chainId: chainId,
          salt: blockHash,
        },
        {
          Transaction: [{ type: "bytes", name: "substrateAddress" }],
        },
        {
          substrateAddress: decodeAddress(ss58Address),
        }
      );
    } catch (error){
        throw new GenerateSignatureError(`${error}`);
    }
  }

  protected async _getChainId(network: string): Promise<number> {
    switch (network.toUpperCase()) {
      case "AGUNG":
        return ChainID.AGUNG;
      case "KREST":
        return ChainID.KREST;
      case "PEAQ":
        return ChainID.PEAQ;
    }
    throw new ChainIdError(`Network not found. Make sure you correctly set your network parameter to either agung, krest, or 
      peaq based on the base url set during SDK initialization.`)
  }
}