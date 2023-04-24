// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Struct } from '@polkadot/types-codec';
import type { BlockNumber, Moment } from '@polkadot/types/interfaces/runtime';

/** @name Attribute */
export interface Attribute extends Struct {
  readonly name: Bytes;
  readonly value: Bytes;
  readonly validity: BlockNumber;
  readonly created: Moment;
}

export type PHANTOM_PEAQDID = 'peaqdid';
