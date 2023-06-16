// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Struct, U8aFixed, bool } from '@polkadot/types-codec';

/** @name Entity */
export interface Entity extends Struct {
  readonly id: EntityId;
  readonly name: Bytes;
  readonly enabled: bool;
}

/** @name EntityId */
export interface EntityId extends U8aFixed {}

/** @name Role2User */
export interface Role2User extends Struct {
  readonly role: EntityId;
  readonly user: EntityId;
}

export type PHANTOM_PEAQRBAC = 'peaqrbac';
