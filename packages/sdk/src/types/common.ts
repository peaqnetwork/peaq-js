import { KeyringPair } from '@polkadot/keyring/types';
import type { AccountId32, BlockNumber, Moment } from '@polkadot/types/interfaces/runtime';
import type { Bytes, Struct } from '@polkadot/types-codec';

export type Address = AccountId32 | string;

export interface SDKMetadata {
  pair?: KeyringPair;
}

export interface Options {
  baseUrl: string;
  seed?: string;
}

export interface CreateStorageKeysArgs {
  value: AccountId32 | string;
  type: CreateStorageKeysEnum;
}

export enum CreateStorageKeysEnum {
  ADDRESS,
  STANDARD,
}

export interface DidDocument {
  id: string;
  controller: string;
  verificationMethod: {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }[];
  signature: {
    type: string;
    issuer: string;
    hash: string;
  };
  service: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
  authentication: string[];
}

export interface ReadDidResponse {
  name: string;
  value: string;
  validity: string;
  created: string;
  document: DidDocument;
}

export interface Attribute extends Struct {
  readonly name: Bytes;
  readonly value: Bytes;
  readonly validity: BlockNumber;
  readonly created: Moment;
}