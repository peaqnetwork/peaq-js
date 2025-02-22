import { ethers } from 'ethers';
import { evmToAddress } from '@polkadot/util-crypto';
import { CreateStorageKeysEnum, Address } from '../../types';
import { createStorageKeys } from '../../utils';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { defaultOptions } from '@peaq-network/types';





enum FunctionSignatures {
    ADD_ITEM = "addItem(bytes,bytes)",
    GET_ITEM = "getItem(address,bytes)",
    UPDATE_ITEM = "updateItem(bytes,bytes)",
    REMOVE_ITEM = "removeItem(bytes)" // appears to not exist in the precompiles
}

enum PrecompileAddresses {
    STORAGE = "0x0000000000000000000000000000000000000801"
}

interface AddItemOptions {
    itemType: string;
    item: string;
}

type RemoveItemOptions = {
    itemType: string;
}

type GetItemOptions = {
    itemType: string;
    address: string;
    chain: string;
}
type GetItemResult = {
    data: string;
}

export interface EvmTransaction {
    to: string;
    data: string;
}

/**
 * Class that builds peaq's Storage EVM transactions.
 */
export class DIDInterfaceStorage {
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
        const { itemType, address, chain } = options;
        this._checkEvmAddress(address);
        return await this._storageDecoder(itemType, address, chain);

        

        // const tx: EvmTransaction = {
        //     to: PrecompileAddresses.STORAGE,
        //     data: "payload"
        // };
        // return tx;
    }


    /**
     * Used to validate a proper H160 address is being passed.
     */
    private _checkEvmAddress(address: Address){
        if (!ethers.isAddress(address)) {
            throw new Error(`${address} is not a valid EVM address`);
        }
    }

    // GET feedback since we need to build an WSProvider... but just want to use rpc??
    // 
    // Maybe have var to see what type and manually set? Maybe can do based on baseUrl set in beginning, but that can change.
    private async _storageDecoder(itemType: string, address: Address, chain: string): Promise <GetItemResult> {
        // Convert EVM to Substrate address
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
        let wsp;
        // maybe: say if agung in baseUrl use agung, if not default to peaq??
        // WHAT url should we use??
        if (chain.toLocaleUpperCase() == 'PEAQ') {
            wsp = new WsProvider("wss://peaq.api.onfinality.io/ws?apikey=d93a0743-d97b-4f8d-a502-2ec11fa9b899");
        }
        else if (chain.toLocaleUpperCase() == 'AGUNG'){
            wsp = new WsProvider("wss://peaq-agung.api.onfinality.io/ws?apikey=b62c4890-668a-4f62-9a7f-e76f1469fb4c");
        }
        else {
            throw new Error(`Chain of name ${chain} is not recognized. Please set to either 'peaq' or agung'.`)
        }
        // init the api connection
        var api = await (await ApiPromise.create({ provider: wsp, noInitWarn: true, ...defaultOptions })).isReady;
        const item = (await api.query?.['peaqStorage']?.['itemStore'](
            hashed_key
        ));
        if (item.toHuman() == ''){
            throw new Error(`Data for the itemType ${itemType} for the chain ${chain} at address ${address} was not found.`)
        }
        return {
            data: `${item.toHuman()}`,
        };
    }
}