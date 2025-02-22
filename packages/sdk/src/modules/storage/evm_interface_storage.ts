import { Storage } from './index';
import { SDKMetadata } from '../../types';
import { ethers } from 'ethers';


enum FunctionSignatures {
    ADD_ITEM = "addItem(bytes,bytes)",
    GET_ITEM = "getItem(address,bytes)",
    UPDATE_ITEM = "updateItem(bytes,bytes)",
    // REMOVE_ITEM = "removeItem(address,bytes)" // appears to not exist in the precompiles
}

enum PrecompileAddresses {
    STORAGE = "0x0000000000000000000000000000000000000801"
}

interface AddItemOptions {
    itemType: string;
    item: string;
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
        const createDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ITEM)).substring(0, 10);

        const itemTypeBytes = ethers.hexlify(ethers.toUtf8Bytes(itemType));
        const itemBytes = ethers.hexlify(ethers.toUtf8Bytes(item));


        const params = this.abiCoder.encode(
            ["bytes", "bytes"],
            [itemTypeBytes, itemBytes]
        );

        let payload = params.replace("0x", createDidFunctionSelector);
        const tx: EvmTransaction = {
            to: PrecompileAddresses.STORAGE,
            data: payload
        };
        return tx
    }

}