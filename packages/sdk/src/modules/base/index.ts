import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, Keyring } from '@polkadot/api';

import type { Address } from '../../types';

export class Base {
  private _nonceStore: Map<Address, BN>;

  constructor(protected _api?: ApiPromise) {
    this._nonceStore = new Map();
  }

  protected _getApi(): ApiPromise {
    if (!this._api || !this._api.isConnected) throw new Error('API is not connected');
    return this._api;
  }

  protected _getKeyPair =  (seed: string): KeyringPair => {
    if (!seed) {
      throw new Error('Seed is required');
    }
    const keyring = new Keyring({ type: 'sr25519' });
    return keyring.addFromUri(seed);
  };

  protected async _getNonce(address: Address): Promise<BN> {
    const api = this._getApi();

    const onChainNonce: BN = (
      await api.rpc.system.accountNextIndex(address)
    ).toBn() as BN;

    const currentNonce = (
      this._nonceStore.has(address) ? this._nonceStore.get(address) : new BN(0)
    ) as BN;

    const nonce = onChainNonce?.gt(currentNonce) ? onChainNonce : currentNonce;

    const newNonce = nonce?.addn(1);

    this._nonceStore.set(address, newNonce);
    return nonce;
  }
}
