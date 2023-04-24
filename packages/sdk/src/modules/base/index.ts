import { BN } from '@polkadot/util';

import type { Address } from '../../types';
import { ApiPromise } from '@polkadot/api';

export class Base {
  private _nonceStore: Map<Address, BN>;

  constructor(protected _api?: ApiPromise) {
    this._nonceStore = new Map();
  }

  protected _getApi(): ApiPromise {
    if (!this._api || !this._api.isConnected) throw new Error('API is not connected');
    return this._api;
  }

  protected async _getNonce(address: Address): Promise<BN> {
    const api = this._getApi();

    const onChainNonce: BN = (
      await api.rpc.system.accountNextIndex(address)
    ).toBn();

    const currentNonce = (
      this._nonceStore.has(address) ? this._nonceStore.get(address) : new BN(0)
    ) as BN;

    const nonce = onChainNonce?.gt(currentNonce) ? onChainNonce : currentNonce;

    const newNonce = nonce?.addn(1);

    this._nonceStore.set(address, newNonce);
    return nonce;
  }
}
