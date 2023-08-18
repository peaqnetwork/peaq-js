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

/** @name Permission2Role */
export interface Permission2Role extends Struct {
  readonly permission: EntityId;
  readonly role: EntityId;
}

/** @name Role2Group */
export interface Role2Group extends Struct {
  readonly role: EntityId;
  readonly group: EntityId;
}

/** @name Role2User */
export interface Role2User extends Struct {
  readonly role: EntityId;
  readonly user: EntityId;
}

/** @name User2Group */
export interface User2Group extends Struct {
  readonly user: EntityId;
  readonly group: EntityId;
}

export type PHANTOM_PEAQRBAC = 'peaqrbac';
