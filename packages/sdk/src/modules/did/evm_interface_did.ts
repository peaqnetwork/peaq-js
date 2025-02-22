import * as peaqDidProto from 'peaq-did-proto-js';
import { defaultOptions } from '@peaq-network/types';
import { Attribute } from '@peaq-network/types/interfaces';
import { CustomDocumentFields, Did } from './index';
import { Address, DidDocument, ReadDidResponse, SDKMetadata, CreateStorageKeysEnum } from '../../types';

import { evmToAddress } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import { createStorageKeys } from '../../utils';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { ethers } from 'ethers';


enum FunctionSignatures {
    ADD_ATTRIBUTE = "addAttribute(address,bytes,bytes,uint32)",
    READ_ATTRIBUTE = "readAttribute(address,bytes)",
    UPDATE_ATTRIBUTE = "updateAttribute(address,bytes,bytes,uint32)",
    REMOVE_ATTRIBUTE = "removeAttribute(address,bytes)"
}

enum PrecompileAddresses {
    DID = "0x0000000000000000000000000000000000000800"
}

interface CreateDidOptions {
    name: string;
    address: Address;
    customDocumentFields?: CustomDocumentFields;
}

interface ReadDidOptions {
  name: string;
  address: Address;
  chain: string;
}

interface UpdateDidOptions {
  name: string;
  address: Address;
  customDocumentFields: CustomDocumentFields;
}

interface RemoveDidOptions {
    name: string;
    address: Address;
  }

export interface EvmTransaction {
    to: string;
    data: string;
}

/**
 * Class that builds peaq's DID EVM transactions.
 */
export class DIDInterfaceEVM {
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
        const { name, address, chain } = options;
        this._checkEvmAddress(address);
        return this._storageDecoder(name, address, chain)

        // DEPRECATED CODE BELOW:
        // const readDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.READ_ATTRIBUTE)).substring(0, 10);
        // const didName = ethers.hexlify(ethers.toUtf8Bytes(name));

        // const params = this.abiCoder.encode(
        //     ["address", "bytes"],
        //     [address, didName]
        // );

        // let payload = params.replace("0x", readDidFunctionSelector);
        // const provider = this._createProvider(this._metadata.baseUrl);

        // // TODO use Iredia storage key implementation
        // const result = await provider.call({
        //     to: PrecompileAddresses.DID,
        //     data: payload,
        // });
        // return this._decodeReadAttribute(result);
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
    private _checkEvmAddress(address: Address){
        if (!ethers.isAddress(address)) {
            throw new Error(`${address} is not a valid EVM address`);
        }
    }

    /**
     * TO DEPRECIATE - Used to read DID Document (use storage key)
     */
    private _createProvider(baseUrl: string): ethers.Provider {
          return new ethers.JsonRpcProvider(baseUrl);
      }

private async _storageDecoder(name: string, address: Address, chain: string) {
        // Convert EVM to Substrate address
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
        
        // read did from store
        const did = (await api.query?.['peaqDid']?.['attributeStore'](
            hashed_key
        )) as unknown as Attribute;

        if (!did || did.isStorageFallback) {
            throw new Error(`Data for the name ${name} for the chain ${chain} at address ${address} was not found.`);
        }

        const didValue = String(did.toHuman()['value']);
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(didValue));
        return {
            ...did.toHuman(),
            document: document.toObject(),
        } as ReadDidResponse;
    }

    /**
     * DEPRECIATED - Used to decode a read DID Document (use storage key)
     * 
     * TODO implement Iredia's feedback
     */
    private _decodeReadAttribute(result: string): ReadDidResponse {
        try {
            // Remove '0x' from result if present 
            const resultHex = result.startsWith("0x") ? result.slice(2) : result;

            // bytes 0 - 191 are fixed for the header. That is where we can extract the validity and created values

            // --- Decode the header ---
            // Word 1: bytes 96–127 is validity (uint32)
            const validityHex = resultHex.slice(96 * 2, 128 * 2); // might have to change to 127
            const validity = parseInt(validityHex, 16).toString();
            const validityFormatted = validity.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            // Word 2: bytes 128–159 is the created field (uint256)
            const createdHex = resultHex.slice(128 * 2, 160 * 2);
            const created = Number(BigInt("0x" + createdHex)).toString();
            const createdFormatted = created.replace(/\B(?=(\d{3})+(?!\d))/g, ",");


            // --- Decode the dynamic (tail) part ---
            // The tail starts after the 192-byte header.
            // 1. Name: starts at byte offset 192 and is 64 bytes long. Cut off the rest of extra hex.
            const nameStart = 192;
            const nameEnd = nameStart + 64 - 1;
            const nameDataHex = resultHex.slice(nameStart * 2, nameEnd * 2);
            const originalName = ethers.toUtf8String("0x" + nameDataHex);
            const trimmedName = originalName.split('\x00')[0]; // remove excess

            // 2. Value: starts at byte offset 256 until the end of the result. Cut off the rest of extra hex.
            const valueStart = 256;
            const valueDataHex = resultHex.slice(valueStart * 2); // from byte 256 to end
            const value = "0x" + valueDataHex;
            const decodedResult = ethers.toUtf8String(value);
            const trimmedValue = decodedResult.split('\x00')[0];

            const document = peaqDidProto.Document.deserializeBinary(hexToU8a(trimmedValue)).toObject() as DidDocument;
            
            return {
                name: trimmedName,
                value:  trimmedValue,
                validity: validityFormatted,
                created: createdFormatted,
                document: document
            };
        }
        catch (error) {
            throw new Error(`Failure decoding the returned back DID with response ${error}`);
        }
    }
}