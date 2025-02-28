import * as peaqDidProto from 'peaq-did-proto-js';
import { defaultOptions } from '@peaq-network/types';
import { Attribute } from '@peaq-network/types/interfaces';
import { Did } from './index';
import { Address, SDKMetadata, CreateStorageKeysEnum } from '../../types';

import { evmToAddress } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import { createStorageKeys } from '../../utils';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { ethers } from 'ethers';

import {
    CreateDidOptions,
    ReadDidOptions,
    UpdateDidOptions,
    RemoveDidOptions,
    EvmTransaction,
    ReadDidResponse
} from './interface';


enum FunctionSignatures {
    ADD_ATTRIBUTE = "addAttribute(address,bytes,bytes,uint32)",
    READ_ATTRIBUTE = "readAttribute(address,bytes)",
    UPDATE_ATTRIBUTE = "updateAttribute(address,bytes,bytes,uint32)",
    REMOVE_ATTRIBUTE = "removeAttribute(address,bytes)"
}

enum PrecompileAddresses {
    DID = "0x0000000000000000000000000000000000000800"
}

/**
 * Class that builds peaq's DID EVM transactions.
 */
export class DidClassEvm {
    private abiCoder = new ethers.AbiCoder();
    private did: Did;
    private _metadata: SDKMetadata;

    constructor(metadata: SDKMetadata) {
      this.did = new Did(undefined, metadata);
      this._metadata = metadata
    }

    /**
     * Creates a new DID EVM transactions and sends back to the user. 
     *
     * @param CreateDidOptions - The parameters this function is expecting:
     *      @param name - The string name of the DID being created
     *      @param address - Address that is used when constructing the DID Document.
     *      @param customDocumentFields - Fields that will populate the DID Document.
     * @returns tx - The transaction object for create DID that a user can send manually.
     */
    public async create(options: CreateDidOptions): Promise<EvmTransaction> {
        const { name, address, customDocumentFields } = options;

        this._checkEvmAddress(address);

        const createDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ATTRIBUTE)).substring(0, 10);

        const didAddress = address;
        const didName = ethers.hexlify(ethers.toUtf8Bytes(name));

        const didDocHash = await this.did.generate({ address, customDocumentFields });
        const didVal = ethers.hexlify(ethers.toUtf8Bytes(didDocHash.value));
        const validityFor = 0;

        const params = this.abiCoder.encode(
            ["address", "bytes", "bytes", "uint32"],
            [didAddress, didName, didVal, validityFor]
        );

        let payload = params.replace("0x", createDidFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    /**
     * Reads the DID Document at the provided name and address.
     *
     * @param ReadDidOptions - The parameters this function is expecting:
     *      @param name - The name of the DID Document to be read.
     *      @param address - The address where the DID Document is stored.
     * @returns tx - The read DID Document found.
     */
    public async read(options: ReadDidOptions): Promise<ReadDidResponse | null>  {
        const { name, address, wssBaseUrl } = options;
        this._checkEvmAddress(address);
        return this._storageDecoder(name, address, wssBaseUrl);
    }

     /**
     * Updates a previously created DID Document. Uses the update feature of 
     * generate DID Document to ensure proper logic.
     *
     * @param UpdateDidOptions - The parameters this function is expecting:
     *      @param name - Name of the DID to be updated.
     *      @param address - The address where the DID lives.
     *      @param customDocumentFields - New fields that will be updated in the Document. Will overwrite previous data.
     * @returns tx - The transaction object for update DID that a user can send manually.
     */
    public async update(options: UpdateDidOptions): Promise <EvmTransaction> {
        const { name, address, customDocumentFields } = options;
        this._checkEvmAddress(address);

        const updateDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UPDATE_ATTRIBUTE)).substring(0, 10);
        const didAddress = address;
        const didName = ethers.hexlify(ethers.toUtf8Bytes(name));

        // generate an updated DID Document Hash
        const didDocHash = await this.did.generate({ address, customDocumentFields, update: {name: name, value: true}});
        const didVal = ethers.hexlify(ethers.toUtf8Bytes(didDocHash.value));
        const validityFor = 0;

        const params = this.abiCoder.encode(
            ["address", "bytes", "bytes", "uint32"],
            [didAddress, didName, didVal, validityFor]
        );

        let payload = params.replace("0x", updateDidFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    /**
     * Removes a DID Document that was previously created at the name and address.
     *
     * @param RemoveDidOptions - The parameters this function is expecting:
     *      @param name - Name of the DID to be removed.
     *      @param address - The address where the DID lives.
     * @returns tx - The transaction object for remove DID that a user can send manually.
     */
    public async remove(options: RemoveDidOptions): Promise <EvmTransaction> {
        const { name, address } = options;
        this._checkEvmAddress(address);

        const removeDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.REMOVE_ATTRIBUTE)).substring(0, 10);
        
        const didAddress = address;
        const didName = ethers.hexlify(ethers.toUtf8Bytes(name));
        
        const params = this.abiCoder.encode(
            ["address", "bytes"],
            [didAddress, didName]
        );

        let payload = params.replace("0x", removeDidFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
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

    private async _storageDecoder(name: string, address: Address | undefined, wssBaseUrl: string | undefined) {
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
                value: name, type: CreateStorageKeysEnum.STANDARD
            },
        ]);

        const api = await this._getApiProvider(wssBaseUrl);
        
        // read did from store
        const did = (await api.query?.['peaqDid']?.['attributeStore'](
            hashed_key
        )) as unknown as Attribute;

        if (!did || did.isStorageFallback) {
            throw new Error(`Data for the name ${name} at the wss url ${wssBaseUrl} at address ${address} was not found.`);
        }

        const didValue = String(did.toHuman()['value']);
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(didValue));
        return {
            ...did.toHuman(),
            document: document.toObject(),
        } as ReadDidResponse;
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