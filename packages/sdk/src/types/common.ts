import { KeyringPair } from '@polkadot/keyring/types';
import type { AccountId32, BlockNumber, Moment } from '@polkadot/types/interfaces/runtime';
import type { Bytes, Struct } from '@polkadot/types-codec';
import { BN } from '@polkadot/util';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { SubmittableExtrinsic } from '@polkadot/api-base/types';
import type { Event, Phase } from "@polkadot/types/interfaces";
import { Codec } from '@polkadot/types/types'

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

export interface SignTransction{
  nonce: BN;
  address: Address | KeyringPair;
  extrinsics: SubmittableExtrinsic<"promise", ISubmittableResult>,
  statusCallback?: (result: ISubmittableResult) => void;
}

export interface FetchRoles{
  id: string;
  name: string;
  enabled: boolean;
}

export interface PeaqEventData{
  lookupName: string
  data: Codec
}

export interface PeaqEvent{
  event: Event;
  phase: Phase;
  section: string;
  method: string;
  eventData: PeaqEventData[];
  error: {
    documentation: string[];
    name: string
  } | null
}