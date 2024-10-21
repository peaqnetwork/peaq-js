import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Main as SDK } from '../main';

import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env file

const SEED = process.env['SEED'] as string;
const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;
const BASE_URL = process.env['BASE_URL'] as string;
const EVM_ADDRESS = process.env['EVM_ADDRESS'] as string;
const SUBSTRATE_ADDRESS = process.env['SUBSTRATE_ADDRESS'] as string;


/**
 * Performs tests when executing unification for SS58 to H160 addresses.
 * 
 * To execute correctly make sure the EVM address on the network has no previous transactions.
 */
describe('Unification', () => {
  let keyring: Keyring;
  let user: KeyringPair;
  let sdk: SDK;

  beforeAll(async () => {
    keyring = new Keyring({ type: 'sr25519' });
    await cryptoWaitReady();
    user = keyring.addFromUri(SEED);
    sdk = await SDK.createInstance({baseUrl: BASE_URL, seed: SEED});
  }, 40000);


/**
 * Test suite for the executing expected operations.
 * 
 * 1. Make sure setting an incorrect network name performs no transactions
 * 2. Create a bind to an SS58 to H160 wallet
 * 3. Error when a keybind has been created previously
 */
  describe('create binds', () => {
    it('incorrect network name', async () => {
      await expect(sdk.unification.claimAccount({network: "random", substrateSeed: SEED, ethPrivate: ETH_PRIVATE}))
      .rejects.toThrow(new Error(`CreateKeyBindError: ChainIdError: Network not found. Make sure you correctly set your network parameter to either agung, krest, or 
      peaq based on the base url set during SDK initialization.`));
    }, 50000);
    // works when I create an ETH wallet from scratch that has no previous transactions on the network
    // and when you first setup an initial keybind... make sure the baseUrl that you initialize to matches the network you are claiming the account with
    it('known ss58 to newly created known h160 bind', async () => {
      const result = await sdk.unification.claimAccount({network: "agung", substrateSeed: SEED, ethPrivate: ETH_PRIVATE});
      expect(result.message).toBe("Address Unification Successful.");
      expect(result.evm).toBe(EVM_ADDRESS);
      expect(result.substrate).toBe(SUBSTRATE_ADDRESS);
    }, 80000);
    it('Expect an error when a previous keybind has already been created', async () => {
      await expect(sdk.unification.claimAccount({network: "agung", substrateSeed: SEED, ethPrivate: ETH_PRIVATE}))
      .rejects.toThrow(new Error(`Error: AccountIdHasMapped for addressUnification.`));
    }, 50000);
  })
})