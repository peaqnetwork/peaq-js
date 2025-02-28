import { ethers } from 'ethers';
import { evmToAddress } from '@polkadot/util-crypto';
import { CreateStorageKeysEnum, Address } from '../../types';
import { createStorageKeys } from '../../utils';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { defaultOptions } from '@peaq-network/types';

import {
    AddItemOptions,
    RemoveItemOptions,
    GetItemOptions,
    GetItemResult,
    UpdateItemOptions,
    EvmTransaction
} from './interface'

enum FunctionSignatures {
    ADD_ITEM = "addItem(bytes,bytes)",
    GET_ITEM = "getItem(address,bytes)",
    UPDATE_ITEM = "updateItem(bytes,bytes)",
    REMOVE_ITEM = "removeItem(bytes)" // appears to not exist in the precompiles
}

enum PrecompileAddresses {
    STORAGE = "0x0000000000000000000000000000000000000801"
}

// interface AddItemOptions {
//     itemType: string;
//     item: string;
// }

// type RemoveItemOptions = {
//     itemType: string;
// }

// type GetItemOptions = {
//     itemType: string;
//     address: string;
//     wssBaseUrl: string;
// }

// type GetItemResult = {
//     [key: string]: string;
// }

// type UpdateItemOptions = {
//     itemType: string;
//     item: string;
// }

// export interface EvmTransaction {
//     to: string;
//     data: string;
// }

/**
 * Class that builds peaq's Storage EVM transactions.
 */
export class StorageClassEvm {
    private abiCoder = new ethers.AbiCoder();
    
    constructor() {
    }

    /**
     * Adds a new item to peaq storage.
     *
     * @param AddItemOptions - The parameters this function is expecting:
     *      @param itemType - The key at which the value is stored.
     *      @param item - The value which is mapped to the itemType key.
     * @returns tx - The transaction object for add item that a user can send manually.
     */
    public async addItem(options: AddItemOptions): Promise<EvmTransaction> {
        const { itemType, item } = options;
        const createStorageFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ITEM)).substring(0, 10);

        const itemTypeBytes = ethers.hexlify(ethers.toUtf8Bytes(itemType));
        const itemBytes = ethers.hexlify(ethers.toUtf8Bytes(item));


        const params = this.abiCoder.encode(
            ["bytes", "bytes"],
            [itemTypeBytes, itemBytes]
        );

        let payload = params.replace("0x", createStorageFunctionSelector);
        const tx: EvmTransaction = {
            to: PrecompileAddresses.STORAGE,
            data: payload
        };
        return tx;
    }

    /**
     * Removes an item from peaq storage.
     *
     * @param RemoveItemOptions - The parameters this function is expecting:
     *      @param itemType - The key at which the value is stored that will be deleted.
     * @returns tx - The transaction object for add item that a user can send manually.
     */
    public async removeItem(options: RemoveItemOptions): Promise<EvmTransaction> {
        const { itemType } = options;
        const deleteStorageFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.REMOVE_ITEM)).substring(0, 10);
        const itemTypeBytes = ethers.hexlify(ethers.toUtf8Bytes(itemType));

        const params = this.abiCoder.encode(
            ["bytes"],
            [itemTypeBytes]
        );

        let payload = params.replace("0x", deleteStorageFunctionSelector);
        const tx: EvmTransaction = {
            to: PrecompileAddresses.STORAGE,
            data: payload
        };
        return tx;
    }

    /**
     * Reads an item from peaq storage using storage keys.
     *
     * @param GetItemOptions - The parameters this function is expecting:
     *      @param itemType - The key at which the value is stored that will be read.
     *      @param address - The address which holds the storage of itemType.
     * @returns - Read storage item.
     */
    public async getItem(options: GetItemOptions): Promise<GetItemResult> {
        const { itemType, address, wssBaseUrl } = options;
        this._checkEvmAddress(address);
        return await this._storageDecoder(itemType, address, wssBaseUrl);
    }

    /**
     * Adds a new item to peaq storage.
     *
     * @param UpdateItemOptions - The parameters this function is expecting:
     *      @param itemType - The key at which the value is stored.
     *      @param item - The value which is mapped to the itemType key to be updated.
     * @returns tx - The transaction object for update item that a user can send manually.
     */
    public async updateItem(options: UpdateItemOptions): Promise<EvmTransaction> {
        const { itemType, item } = options;
        const createStorageFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UPDATE_ITEM)).substring(0, 10);

        const itemTypeBytes = ethers.hexlify(ethers.toUtf8Bytes(itemType));
        const itemBytes = ethers.hexlify(ethers.toUtf8Bytes(item));

        const params = this.abiCoder.encode(
            ["bytes", "bytes"],
            [itemTypeBytes, itemBytes]
        );

        let payload = params.replace("0x", createStorageFunctionSelector);
        const tx: EvmTransaction = {
            to: PrecompileAddresses.STORAGE,
            data: payload
        };
        return tx;
    }


    /**
     * Used to validate a proper H160 address is being passed.
     */
    private _checkEvmAddress(address: Address | undefined){

        if (!ethers.isAddress(address)) {
            throw new Error(`${address} is not a valid EVM address`);
        }
    }

    private async _storageDecoder(itemType: string, address: Address | undefined, wssBaseUrl: string | undefined): Promise <GetItemResult> {
        // Convert EVM to Substrate address
        if (address == undefined){
            throw new Error("Address cannot be undefined. Please set to a valid address.");
        }
        if (wssBaseUrl == undefined) {
            throw new Error("wssBaseUrl cannot be undefined. Please set a valid WSS url.");
        }

        const substrateAddress = evmToAddress(address);

        const { hashed_key } = createStorageKeys([
            {
                value: substrateAddress,
                type: CreateStorageKeysEnum.ADDRESS,
            },
            { 
                value: itemType, type: CreateStorageKeysEnum.STANDARD
            },
        ]);
        // init the api connection
        const api = await this._getApiProvider(wssBaseUrl);
        
        const item = (await api.query?.['peaqStorage']?.['itemStore'](
            hashed_key
        ));
        if (item.toHuman() == ''){
            throw new Error(`Data for the name ${name} at the wss url ${wssBaseUrl} at address ${address} was not found.`);
        }
        return {
            [itemType]: `${item.toHuman()}`,
        };
    }

    private async _getApiProvider(wssBaseUrl: string): Promise<ApiPromise> {
        try {
            const wsp = new WsProvider(wssBaseUrl);
            var api = await (await ApiPromise.create({ provider: wsp, noInitWarn: true, ...defaultOptions })).isReady;
            return api;
        }
        catch(error) {
            throw new Error(`WSS base url of ${wssBaseUrl}, is not valid with error message: ${error}`)
        }
    }
}