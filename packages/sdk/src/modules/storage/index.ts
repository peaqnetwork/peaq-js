import { ApiPromise } from '@polkadot/api';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import { CreateStorageKeysEnum, Address } from '../../types';
import { createStorageKeys } from '../../utils';
import { stringToU8a, u8aToHex, hexToString } from '@polkadot/util';
import { StorageError, ItemTypeError, ItemError, StorageAddressError, StorageSeedError} from '../../utils/errors';
import type { SDKMetadata} from '../../types';
import { Base } from '../base';
import { DIDInterfaceStorage, EvmTransaction } from './evm_interface_storage';

type AddItemOptions = {
    itemType: string;
    item: string;
    seed?: string;
} 

type RemoveItemOptions = {
    itemType: string;
    seed?: string;
}

type GetItemOptions = {
    itemType: string;
    address?: string;
}

type UpdateItemOptions = {
    itemType: string;
    item: string;
    seed?: string;
}

export type AddItemResult = {
    message: string;
    block_hash: CodecHash;
    unsubscribe: () => void;
}

type RemoveItemResult = {
    message: string;
    block_hash: CodecHash;
    unsubscribe: () => void;
}

type GetItemResult = {
    data: string;
}


type UpdateItemResult = {
    message: string;
    block_hash: CodecHash;
    unsubscribe: () => void;
}

export class Storage extends Base {
    constructor(
      protected override readonly _api?: ApiPromise,
      protected readonly _metadata?: SDKMetadata
    ) {
      super();
    }
  
    /**
     * Adds item to peaqStorage
     * 
     * TODO Determine what constraints we need to establish before adding to storage
     */

    public async addItem(
     options: AddItemOptions,
     statusCallback?: (result: ISubmittableResult) => void | Promise<void>
  ): Promise<AddItemResult | EvmTransaction> {
    try {
        const {itemType, item, seed = ''} = options;
        if (!itemType) throw new ItemTypeError('Item Type name is required');
        if (!item) throw new ItemError('Item name is required');
        if (seed !== '') this._checkSeed(seed);
        if (stringToU8a(itemType).length > 64) throw new ItemTypeError('New Item Type cannot be larger than 64 bytes');
        if (stringToU8a(item).length > 256) throw new ItemError('New Item cannot be larger than 256 bytes');

        // EVM tx logic if chainType is set to EVM
        if (this._metadata?.chainType?.toUpperCase() == "EVM") {
            const evm = new DIDInterfaceStorage();
            return await evm.addItem({itemType: itemType,  item: item})
        }
        
        const api = this._getApi();
        const keyPair = this._metadata?.pair || this._getKeyPair(seed);
        const attributeExtrinsic = api.tx?.['peaqStorage']?.['addItem'](
            itemType,
            item
        );
        const nonce = await this._getNonce(keyPair.address);
        const eventData = await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
        const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
            statusCallback(result as unknown as ISubmittableResult);
        });
        // is it necessary to add more verbose logging in return object?
        return {
            message: `Successfully added the storage item type ${itemType} with item ${item} for the address ${keyPair.address}`,
            block_hash: eventData[0]?.blockHash as unknown as CodecHash,
            unsubscribe,
        };
        
    } catch (error) {
        throw new StorageError(`${error}`);
        }
    }


    /**
     * Removes the itemType in peaqStorage
     */

    public async removeItem(
        options: RemoveItemOptions,
        statusCallback?: (result: ISubmittableResult) => void | Promise<void>
     ): Promise<RemoveItemResult> {
        try {
            const api = this._getApi();

            const { itemType, seed = ''} = options;
            if (!itemType) throw new ItemTypeError('Item Type name is required');
            if (seed !== '') this._checkSeed(seed);

            const keyPair = this._metadata?.pair || this._getKeyPair(seed);
            const attributeExtrinsic = api.tx?.['peaqStorage']?.['removeItem'](
                itemType
              );
              const nonce = await this._getNonce(keyPair.address);
              const eventData = await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
              // await attributeExtrinsic.signAsync(keyPair, { nonce });
              const unsubscribe = await attributeExtrinsic.send((result) => {
                statusCallback &&
                  statusCallback(result as unknown as ISubmittableResult);
              });
          
              // successfully removed the did of name __ from address machine address __
              return {
                message: `Successfully removed the storage item type ${itemType} from address ${keyPair.address}`,
                block_hash: eventData[0]?.blockHash as unknown as CodecHash,
                unsubscribe,
              };

        } catch (error) {
            throw new StorageError(`${error}`);
        }
     }

     public async getItem(options: GetItemOptions): Promise<GetItemResult | null> {
       try {
        const api = this._getApi();

        const { itemType, address = '' } = options;
        if (!itemType) throw new ItemTypeError('Item Type name is required');
        if (address !== '') this._checkAddress(address);

        const accountAddress = address || this._metadata?.pair?.address;
        if (!accountAddress) throw new StorageAddressError('Address is required');

            const { hashed_key } = createStorageKeys([
                {
                  value: accountAddress,
                  type: CreateStorageKeysEnum.ADDRESS,
                },
                { 
                    value: itemType, type: CreateStorageKeysEnum.STANDARD
                },
            ]);
            const item = (await api.query?.['peaqStorage']?.['itemStore'](
                hashed_key
            ));
            if (!item || item.isStorageFallback) return null;
            // is toHuman acceptable here? What if a simple string is not passed?
            return {
                data: `${item}`,
            };
        }
       catch (error) {
        throw new StorageError(`${error}`);
       }
    }

    public async updateItem(options: UpdateItemOptions,
        statusCallback?: (result: ISubmittableResult) => void | Promise<void>
      ): Promise<UpdateItemResult> {
        try {
            const api = this._getApi();

            const {itemType, item, seed = ''} = options;
    
            // checks
            if (!itemType) throw new ItemTypeError('Item Type name is required');
            if (!item) throw new ItemError('Item name is required');
            if (seed !== '') this._checkSeed(seed);
            
            // convert string to bytes to count before calling extrinsics
            if (stringToU8a(itemType).length > 64) throw new ItemTypeError('New Item Type cannot be larger than 64 bytes');
            if (stringToU8a(item).length > 256) throw new ItemError('New Item cannot be larger than 256 bytes');
    
            const keyPair = this._metadata?.pair || this._getKeyPair(seed);
            const attributeExtrinsic = api.tx?.['peaqStorage']?.['updateItem'](
                itemType,
                item
            );
            const nonce = await this._getNonce(keyPair.address);
            const eventData = await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
            const unsubscribe = await attributeExtrinsic.send((result) => {
            statusCallback &&
                statusCallback(result as unknown as ISubmittableResult);
            });
            // is it necessary to add more verbose logging in return object?
            return {
                message: `Successfully updated the storage item type ${itemType} to the new item ${item} for the address ${keyPair.address}`,
                block_hash: eventData[0]?.blockHash as unknown as CodecHash,
                unsubscribe,
            };
        }

        catch (error){
            throw new StorageError(`${error}`);
        }
    }
    // same code as fund in did/inxdex.ts -> eventually put into a file that uses the same code in different places
    private _checkSeed(seed: string){
        const words = seed.trim().split(/\s+/);
    
        // Check if the length is either 12 or 24
        if (words.length !== 12 && words.length !== 24) {
          throw new StorageSeedError('Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.');
        }
    }
    // same code as fund in did/inxdex.ts -> eventually put into a file that uses the same code in different places
    private _checkAddress(accountAddress: Address) {
        const regexSS58 = /^[1-9A-HJ-NP-Za-km-z]{48}$/; // regex for ss58
        const regexETH = /^0x[a-fA-F0-9]{40}$/;         // regex for Ethereum
        if(!regexSS58.test(accountAddress as string) && !regexETH.test(accountAddress as string)){
          throw new StorageAddressError(`Incorrect Substrate SS58/Ethereum Address format. Given address does not match expected length or contains an invalid char. 
            SS58 address are 58 char in length with 0, O, I & l omitted. Ethereum addresses are 42 characters in length, starting with "0x" followed by 
            40 hexadecimal characters (0-9, a-f, A-F) with no characters omitted.`);
        }
      }
}