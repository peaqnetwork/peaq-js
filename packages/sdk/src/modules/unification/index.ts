import { Base } from '../base';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/keyring';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { SDKMetadata } from '../../types';
import { ethers, Wallet } from "ethers";

interface ClaimAccountOptions {
  substrateSeed: string,
  ethPrivate: string
}

export class Unification extends Base {
    constructor(
      protected override readonly _api?: ApiPromise,
      protected readonly _metadata?: SDKMetadata,
  
    ) {
      super();
    }

  // TODO just return the ethereum address?
  // How does the user know what their mnenonmic phrase and private key are...
  //  - Can we safely return??

  public async claimAccount(options: ClaimAccountOptions, statusCallback?: (result: ISubmittableResult) => void | Promise<void>): Promise<string> {
    try {
        const api = this._getApi();

        const { substrateSeed,  ethPrivate} = options;
        if (!substrateSeed) {
          throw new Error("Error: No substrate private key provided.");
        }
        if (!ethPrivate) {
          throw new Error("Error: No ethereum private key provided.");
        }

        const keyPair = this._metadata?.pair || this._getKeyPair(substrateSeed);
        const ss58Address = keyPair.address;

        // create wallet from ETH private key
        const signer = new ethers.Wallet(ethPrivate);
        const evmAddress = signer.address;

        const ethSignature = await this._createKeyBind(ss58Address, signer);
        // console.log(ethSignature);

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

        console.log(eventData);

        return `Successfully unified the evm address of ${evmAddress} to the substrate address of ${ss58Address}`;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }


  protected async _createKeyBind(ss58Address: string, signer: Wallet): Promise <string>{
    try {
      const api = this._getApi();

      // Case where we connect a previously known ethereum wallet to their current substrate address
      const chainMap = new Map();
      chainMap.set("Agung-parachain", 9990);
      chainMap.set("krest-network", 2241);
      chainMap.set("peaq-network", 3338);

      // derive chain id -> is there a better way to get chainId from api than than creating a mapping?
      const chain = api.runtimeChain.toHuman();
      const chainId = chainMap.get(chain);
      console.log(chainId);

      const signature = await this._generateSignature(
        signer,
        ss58Address,
        chainId
      );
      console.log("Generated signature:", signature);
      return signature;

    } catch (error){
      throw new Error(`${error}`);
    }
  }

  protected async _generateSignature(signer: Wallet, ss58Address: string, chainId: string) {
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
  }

}