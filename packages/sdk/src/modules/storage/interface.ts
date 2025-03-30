import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';


// function input parameters
export interface AddItemOptions {
    itemType: string;
    item: Object;
    seed?: string;
}

export interface RemoveItemOptions {
    itemType: string;
    seed?: string;
}

export interface GetItemOptions {
    itemType: string;
    address?: string;
    wssBaseUrl?: string;
}

export interface UpdateItemOptions {
    itemType: string;
    item: string;
    seed?: string;
}


// return parameters for substrate txs
export interface AddItemResult {
    message: string;
    block_hash: CodecHash;
    unsubscribe: () => void;
}

export interface RemoveItemResult {
    message: string;
    block_hash: CodecHash;
    unsubscribe: () => void;
}

export interface GetItemResult {
    [key: string]: string;
}

export interface UpdateItemResult {
    message: string;
    block_hash: CodecHash;
    unsubscribe: () => void;
}

// return parameters for evm txs
export interface EvmTransaction {
    to: string;
    data: string;
}