import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Main as SDK } from '../main';

import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env file
const SEED = process.env['SEED'] as string;
const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;
const BASE_URL = process.env['BASE_URL'] as string;

describe('Unification', () => {

  describe('create binds', () => {
    // works when I create an ETH wallet from sktrach that has no previous transactions

    // first test with with new ss58 (still know seed phrase) and generates a new h160
    it('known ss58 to known h160 bind', async () => {
      const keyring = new Keyring({ type: 'sr25519' });
      await cryptoWaitReady();
      const user = keyring.addFromUri(SEED);
      const sdk = await SDK.createInstance({baseUrl: BASE_URL, seed: SEED});

      await sdk.unification.claimAccount({substrateSeed: SEED, ethPrivate: ETH_PRIVATE});

    }, 50000);

    // TODO 2nd test with with an old ss58 (has transactions) and binds a previously created H160 (has transaction)
  })

})