import { ApiPromise } from '@polkadot/api';
import { u8aConcat, u8aToU8a } from '@polkadot/util';
import { blake2AsHex, decodeAddress } from '@polkadot/util-crypto';

import type { CreateStorageKeysArgs } from '../types';
import { CreateStorageKeysEnum } from '../types';

export const createStorageKeys = (args: CreateStorageKeysArgs[]) => {
  const keysByteArray = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].type === CreateStorageKeysEnum.ADDRESS) {
      const decoded_address = decodeAddress(args[i].value, false, 42);
      keysByteArray.push(decoded_address);
    }
    if (args[i].type === CreateStorageKeysEnum.STANDARD) {
      const hash_name = u8aToU8a(args[i].value);
      keysByteArray.push(hash_name);
    }
  }

  const key = u8aConcat(...keysByteArray);
  const hashed_key = blake2AsHex(key, 256);
  return { hashed_key };
};

export const unsubscribeRuntimeVersion = async (api: ApiPromise) => {
  try {
    api &&
      process.env['NX_ENV'] === 'local' &&
      (
        await api.rpc.state.subscribeRuntimeVersion(() => {
          return;
        })
      )();
  } catch (e) {
    console.error('Unsubscribe error: ', e);
  }
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const truncatedString = (str: string) => {
  if (!str) return "";
  return (
    str.substring(0, 7) + "..." + str.substring(str.length - 5, str.length)
  );
};
