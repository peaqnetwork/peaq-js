import * as peaqDidProto from 'peaq-did-proto-js';
import { CustomDocumentFields, Did } from './index'

import type { Address, ReadDidResponse, SDKMetadata, SignTransction } from '../../types';

import { hexToU8a } from '@polkadot/util';
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

export class DIDInterfaceEVM {
    private abiCoder = new ethers.AbiCoder();
    private did = new Did();
    private baseUrl: string;

    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }

    public async create(options: CreateDidOptions): Promise<EvmTransaction> {
        
        const { name, address, customDocumentFields } = options;
        this._checkEvmAddress(address);

        if (!ethers.isAddress(address)) {
            throw new Error(`${address} is not a valid EVM address`);
        }

        const createDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ATTRIBUTE)).substring(0, 10);

        const didAddress = address;
        const didName = ethers.hexlify(ethers.toUtf8Bytes(name));

        const didDocHash = await this.did.generate({ address, customDocumentFields });
        const didVal = ethers.hexlify(ethers.toUtf8Bytes(didDocHash.value));
        const validityFor = 0;

        // // to log document that is being added can uncomment below (useful for development debugging)
        // const document = peaqDidProto.Document.deserializeBinary(hexToU8a(didDocHash.value));
        // console.log(document.toObject());

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
    public async read(options: ReadDidOptions)  {
    }
    public async update(options: UpdateDidOptions) {
    }
    public async remove(options: RemoveDidOptions) {
    }

    private _checkEvmAddress(address: Address){
        if (!ethers.isAddress(address)) {
            throw new Error(`${address} is not a valid EVM address`);
        }
    }

    private createProvider(baseUrl: string): ethers.Provider {
        if (baseUrl.startsWith('wss://')) {
          return new ethers.WebSocketProvider(baseUrl);
        } else {
          return new ethers.JsonRpcProvider(baseUrl);
        }
      }
}