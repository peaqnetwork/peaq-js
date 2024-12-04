import { Base } from '../../base';

import { ethers, AbiCoder, keccak256, toUtf8Bytes } from 'ethers';


enum FunctionSignatures {
    ADD_ATTRIBUTE = "addAttribute(address,bytes,bytes,uint32)",
    READ_ATTRIBUTE = "readAttribute(address,bytes)",
    UPDATE_ATTRIBUTE = "updateAttribute(address,bytes,bytes,uint32)",
    REMOVE_ATTRIBUTE = "removeAttribute(address,bytes)"
}

/**
 * DID class to create ethereum transactions.
 */
export class Did extends Base {
    abiCoder: ethers.AbiCoder = new ethers.AbiCoder();

    constructor() {
      super();
    }

// how should a tx be created?


// sdk.eth.did.create()
    public async create() {
    }


    public async read() {

    }

    public async update() {
    }

    public async remove() {
    }

}

