import type { Address } from '../../types';
import { DidDocument } from '../../types';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';



// function input parameters
export interface GenerateDidOptions {
    address: Address | undefined;
    chainType?: string; // used to check how the string should be created
    wssBaseUrl?: string;
    customDocumentFields?: CustomDocumentFields;
    update?: UpdateGeneratedDoc;
}

export interface UpdateGeneratedDoc {
    name: string;
    value: boolean;
}

export interface CreateDidOptions {
    name: string;
    address?: Address;
    seed?: string;
    customDocumentFields?: CustomDocumentFields;
}

export interface DidDocumentOptions {
    didAccountAddress: Address;
    didControllerAddress: Address;
    customDocumentFields?: CustomDocumentFields;
}

export interface ReadDidOptions {
    name: string;
    address?: Address;
    wssBaseUrl?: string;
}
export interface UpdateDidOptions {
    name: string;
    address?: Address;
    seed?: string;
    wssBaseUrl?: string;
    customDocumentFields: UpdateDocumentFields;
}

export interface UpdateDidDocumentOptions {
    didAccountAddress: Address;
    didControllerAddress: Address;
    customDocumentFields?: UpdateDocumentFields;
    oldDocument: DidDocument
}
export interface RemoveDidOptions {
    name: string;
    address?: Address;
    seed?: string;
}


// function results
export interface GenerateDidResult {
  value: string;
}

export interface CreateDidResult {
    block_hash: CodecHash;
    unsubscribe: () => void;
}

export interface ReadDidResponse {
    name: string;
    value: string;
    validity: string;
    created: string;
    document: DidDocument;
}


export interface RemoveDidResult {
  log?: string,
  block_hash: CodecHash;
  unsubscribe: () => void;
}

export interface UpdateDidResult {
  log: string,
  block_hash: CodecHash;
  unsubscribe: () => void;
} 


// DID Document fields
export interface CustomDocumentFields {
    prefix?: string,
    controller?: string,
    verifications?: Verification[],
    signature?: Signature,
    services?: Service[];
}
  
export interface UpdateDocumentFields {
    prefix?: string,
    controller?: string,
    verifications?: Verification[],
    signature?: Signature,
    services?: Service[];
}

export type Verification = {
    id?: string;
    type: string;
    controller?: string;
    publicKeyMultibase?: string;
}

export type Signature = {
    type: string;
    issuer: string;
    hash: string;
}

export type Service = {
    id: string;
    type: string;
    serviceEndpoint?: string;
    data?: string;
}

// Evm Transaction object
export interface EvmTransaction {
    to: string;
    data: string;
}