import { Base } from '../../base';
import { CustomDocumentFields, Did } from '../../did';
import * as peaqDidProto from 'peaq-did-proto-js';
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
    address: string;
    customDocumentFields?: CustomDocumentFields;
  }

/**
 * DID class to create ethereum transactions.
 */
export class Eth_Did extends Base {
    abiCoder: ethers.AbiCoder = new ethers.AbiCoder();
    value: Did = new Did();

    constructor() {
      super();
    }

// sdk.eth.did.create()
    public async create(options: CreateDidOptions) {
        const { name, address, customDocumentFields } = options;

        if(!ethers.isAddress(address)){
            throw new Error("Not valid address")
        }

        const createDidFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ATTRIBUTE)).substring(0, 10);

        const didAddress = address;
        const didName = ethers.hexlify(ethers.toUtf8Bytes(name));

        const didDocHash = await this.value.generate({address, customDocumentFields});
        const validityFor = 0;

        // // to log document that is being added can uncomment below (useful for development debugging)
        // const document = peaqDidProto.Document.deserializeBinary(hexToU8a(didDocHash.value));
        // console.log(document.toObject());
    
        const params = this.abiCoder.encode(
          ["address", "bytes", "bytes", "uint32"],
          [didAddress, didName, didDocHash.value, validityFor]
        );

        let payload = params.replace("0x", createDidFunctionSelector);
    
        const tx = {
          to: PrecompileAddresses.DID,
          data: payload
        };

        return tx;
    }

// sdk.eth.did.read()
    public async read() {

    }

// sdk.eth.did.update()
    public async update() {
    }

// sdk.eth.did.remove()
    public async remove() {
    }

}

