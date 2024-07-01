import { ApiPromise } from '@polkadot/api';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import { CreateStorageKeysEnum } from '../../types';
import { createStorageKeys } from '../../utils';
import { stringToU8a, u8aToHex, hexToString } from '@polkadot/util';

import type { SDKMetadata} from '../../types';

import { Base } from '../base';

// TODO chunk similar looking code into helpers

// Have types be named storage or item: AddItemOptions or AddItemOptions (almost should change to addStorage in pallets rather than updateItem)
// I am build the sdk off the pallet names

// what else can be stored in storage? Right now I created a string identifier to a hex signature
type AddItemOptions = {
    itemType: string;
    item: string; // signature hash
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
    item: string; // signature hash
    seed?: string;
}

type AddItemResult = {
    log: string;
    hash: CodecHash;
    unsubscribe: () => void;
}

type RemoveItemResult = {
    log: string;
    unsubscribe: () => void;
}

type GetItemResult = {
    log: string;
}


type UpdateItemResult = {
    log: string;
    hash: CodecHash;
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
  ): Promise<AddItemResult> {
    try {
        const api = this._getApi();

        const {itemType, item, seed = ''} = options;
        // Need to know what types itemType can to ensure proper storage (for example, only converts string to byte array to check length; conditional for other types)
        // - is there a way to do this no matter the type?

        // check if object is uint8array, if it is not then convert to see how big of storage will be needed

        // checks
        if (!itemType) throw new Error('Item Type is required');
        if (!item) throw new Error('Item is required');
        if (stringToU8a(itemType).length > 64) throw new Error('New Item Type cannot be larger than 64 bytes');
        if (stringToU8a(item).length > 256) throw new Error('New item cannot be larger than 256 bytes');

        const keyPair = this._metadata?.pair || this._getKeyPair(seed);

        // debugging
        // console.log('new item length', stringToU8a(itemType).length);
        // console.log('new item length', stringToU8a(item).length);

        const attributeExtrinsic = api.tx?.['peaqStorage']?.['addItem'](
            itemType,
            item
        );

        const nonce = await this._getNonce(keyPair.address);
        await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
        
        const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
            statusCallback(result as unknown as ISubmittableResult);
        });
        // is it necessary to add more verbose logging in return object?
        return {
            log: `Successfully added the storage item type ${itemType} with item ${item} for the address ${keyPair.address}`,
            hash: attributeExtrinsic.hash as unknown as CodecHash,
            unsubscribe,
        };
        


        // store 'item type' as bytes with no greater than 64
        // - how to limit the amount stored?
        // store 'item' as bytes with not greater than 256 bytes
        // - make sure what is stored is a signature
    } catch (error) {
        throw new Error(`Add to peaq Storage ${error}`);
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

            const keyPair = this._metadata?.pair || this._getKeyPair(seed);

            if (!itemType) throw new Error('Item Type is required');

            const attributeExtrinsic = api.tx?.['peaqStorage']?.['removeItem'](
                itemType
              );
              const nonce = await this._getNonce(keyPair.address);
              await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
              // await attributeExtrinsic.signAsync(keyPair, { nonce });
              const unsubscribe = await attributeExtrinsic.send((result) => {
                statusCallback &&
                  statusCallback(result as unknown as ISubmittableResult);
              });
          
              // successfully removed the did of name __ from address machine address __
              return {
                log: `Successfully removed the storage item type ${itemType} from address ${keyPair.address}`,
                unsubscribe,
              };

        } catch (error) {
            throw new Error(`Error removing Storage Item: ${error}`);
        }
     }

     public async getItem(options: GetItemOptions): Promise<GetItemResult | null> {
       try {
        const api = this._getApi();

        const { itemType, address } = options;
        const accountAddress = address || this._metadata?.pair?.address;
    
        if (!itemType) throw new Error('Name is required');
        if (!accountAddress) throw new Error('Address is required');

            const { hashed_key } = createStorageKeys([
                {
                  value: accountAddress,
                  type: CreateStorageKeysEnum.ADDRESS,
                },
                { value: itemType, type: CreateStorageKeysEnum.STANDARD },
              ]);

              const item = (await api.query?.['peaqStorage']?.['itemStore'](
                hashed_key
              ));

              if (!item || item.isStorageFallback) return null;
        
              // is toHuman acceptable here? What if a simple string is not passed?
              return {
                log: `${item.toHuman()}`,
              };
            }
       catch (error) {
        throw new Error(`Read Storage Item: ${error}`);
       }
    }

    public async updateItem(options: UpdateItemOptions,
        statusCallback?: (result: ISubmittableResult) => void | Promise<void>
      ): Promise<UpdateItemResult> {
        try {
            const api = this._getApi();

            const {itemType, item, seed = ''} = options;
    
            // checks
            if (!itemType) throw new Error('Item Type is required');
            if (!item) throw new Error('Item is required');
            if (stringToU8a(itemType).length > 64) throw new Error('New Item Type cannot be larger than 64 bytes');
            if (stringToU8a(item).length > 256) throw new Error('New item cannot be larger than 256 bytes');
    
            const keyPair = this._metadata?.pair || this._getKeyPair(seed);
    
            // debugging
            // console.log('new item length', stringToU8a(itemType).length);
            // console.log('new item length', stringToU8a(item).length);
    
            const attributeExtrinsic = api.tx?.['peaqStorage']?.['updateItem'](
                itemType,
                item
            );
    
            const nonce = await this._getNonce(keyPair.address);
            await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
            
            const unsubscribe = await attributeExtrinsic.send((result) => {
            statusCallback &&
                statusCallback(result as unknown as ISubmittableResult);
            });
            // is it necessary to add more verbose logging in return object?
            return {
                log: `Successfully updated the storage item type ${itemType} to the new item ${item} for the address ${keyPair.address}`,
                hash: attributeExtrinsic.hash as unknown as CodecHash,
                unsubscribe,
            };
        }

        catch (error){
            throw new Error(`Updatet Storage Item ${error}`);
        }
    }   
}