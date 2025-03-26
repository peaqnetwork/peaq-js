import { ApiPromise } from '@polkadot/api';

import { Main } from './index';
import { sleep } from '../../utils';
import { Main as Sdk } from '../main';
import { ChainType } from '../../types';

// Import typical base urls a user could use

// agung public urls
const RPC_AGNG_PUBLIC_BASE_URL = process.env['RPC_AGNG_PUBLIC_BASE_URL'] as string;
const WSS_AGNG_PUBLIC_BASE_URL = process.env['WSS_AGNG_PUBLIC_BASE_URL'] as string;

// agung on-finality private urls
const RPC_AGNG_ONFIN_PRIVATE_BASE_URL = process.env['RPC_AGNG_ONFIN_PRIVATE_BASE_URL'] as string;
const WSS_AGNG_ONFIN_PRIVATE_BASE_URL = process.env['WSS_AGNG_ONFIN_PRIVATE_BASE_URL'] as string;

// peaq public urls 
const RPC_PEAQ_PUBLIC_BASE_URL = process.env['RPC_PEAQ_PUBLIC_BASE_URL'] as string;
const WSS_PEAQ_PUBLIC_BASE_URL = process.env['WSS_PEAQ_PUBLIC_BASE_URL'] as string;

// peaq on-finality private urls
const RPC_PEAQ_ONFIN_PRIVATE_BASE_URL = process.env['RPC_PEAQ_ONFIN_PRIVATE_BASE_URL'] as string;
const WSS_PEAQ_ONFIN_PUBLIC_BASE_URL = process.env['WSS_PEAQ_ONFIN_PUBLIC_BASE_URL'] as string;

// peaq quick-node private urls
const RPC_PEAQ_QN_PRIVATE_BASE_URL = process.env['RPC_PEAQ_QN_PRIVATE_BASE_URL'] as string;
const WSS_PEAQ_QN_PRIVATE_BASE_URL = process.env['WSS_PEAQ_QN_PRIVATE_BASE_URL'] as string;

// Assign the urls
const BASE_URL_HTTPS = RPC_AGNG_PUBLIC_BASE_URL;
const BASE_URL_WSS = WSS_AGNG_PUBLIC_BASE_URL;


// Assign wallets used in test
// Substrate
const SUBSTRATE_ADDRESS = process.env['SUBSTRATE_ADDRESS'] as string;
const SUBSTRATE_SEED = process.env['SUBSTRATE_SEED'] as string;
// EVM
const EVM_ADDRESS = process.env['EVM_ADDRESS'] as string;
const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;



/**
 * Tests the functionality of the main function of the sdk. 
 * Creates a substrate and evm instance and checks for proper class initialization.
 * 
 * TODO -> Unit Tests that uses mocked data for all functions.
 */
describe.skip('Integration Tests Main', () => {
  describe('Substrate Initialization', () => {
    it('Create SDK Instance', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS});
      expect(sdk).toBeInstanceOf(Main);
      expect(sdk['_api']).toBeInstanceOf(ApiPromise);
      expect(sdk['_options'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].chainType).toBe(undefined);
      expect(sdk.did).toBeDefined();
      expect(sdk.rbac).toBeDefined();
      expect(sdk.storage).toBeDefined();
      // expect(sdk.ptp).toBeDefined(); // comment out when live
      await sdk.disconnect();
    }, 20000);
    it('Create SDK Instance & set chainType manually', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, chainType: ChainType.SUBSTRATE});
      expect(sdk).toBeInstanceOf(Main);
      expect(sdk['_api']).toBeInstanceOf(ApiPromise);
      expect(sdk['_options'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].chainType).toBe(ChainType.SUBSTRATE);
      expect(sdk.did).toBeDefined();
      expect(sdk.rbac).toBeDefined();
      expect(sdk.storage).toBeDefined();
      // expect(sdk.ptp).toBeDefined(); // comment out when live
      await sdk.disconnect();
    }, 20000)
    it('Create SDK Instance with a seed', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, seed: SUBSTRATE_SEED});
      expect(sdk).toBeInstanceOf(Main);
      expect(sdk['_api']).toBeInstanceOf(ApiPromise);
      expect(sdk['_options'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].chainType).toBe(undefined);
      expect(sdk.did).toBeDefined();
      expect(sdk.rbac).toBeDefined();
      expect(sdk.storage).toBeDefined();
      // expect(sdk.ptp).toBeDefined(); // comment out when live
      await sdk.disconnect();
    }, 20000);
    it('Create SDK Instance with a seed & manually set chainType', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, chainType: ChainType.SUBSTRATE, seed: SUBSTRATE_SEED});
      expect(sdk).toBeInstanceOf(Main);
      expect(sdk['_api']).toBeInstanceOf(ApiPromise);
      expect(sdk['_options'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].baseUrl).toBe(BASE_URL_WSS);
      expect(sdk['_metadata'].chainType).toBe(ChainType.SUBSTRATE);
      expect(sdk.did).toBeDefined();
      expect(sdk.rbac).toBeDefined();
      expect(sdk.storage).toBeDefined();
      // expect(sdk.ptp).toBeDefined(); // comment out when live
      await sdk.disconnect();
    }, 20000);
    it('Test SDK Connection', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, seed: SUBSTRATE_SEED});
      await sdk.connect();
      expect(sdk['_api']?.isConnected).toBe(true);
      await sdk.disconnect();
    }, 20000);
    it('Test SDK Connection with set chainType', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, chainType: ChainType.SUBSTRATE, seed: SUBSTRATE_SEED});
      await sdk.connect();
      expect(sdk['_api']?.isConnected).toBe(true);
      await sdk.disconnect();
    }, 20000);
    it('Test SDK Disconnection', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, seed: SUBSTRATE_SEED});
      await sdk.connect();
      await sdk.disconnect();
      await sleep(1000);
      expect(sdk['_api']?.isConnected).toBe(false);
    }, 20000);
    it('Test SDK Disconnection with set chainType', async () => {
      const sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, chainType: ChainType.SUBSTRATE, seed: SUBSTRATE_SEED});
      await sdk.connect();
      await sdk.disconnect();
      await sleep(1000);
      expect(sdk['_api']?.isConnected).toBe(false);
    }, 20000);
    // expected failure test cases
    it('Create SDK Instance with incorrect url', async () => {
      await expect(Sdk.createInstance({baseUrl: BASE_URL_HTTPS}))
        .rejects.toThrow(`Invalid base URL for Substrate interactions: ${BASE_URL_HTTPS}. It must start with 'wss://' to establish WSS connection.`);
    }, 20000);
    it('Create SDK Instance with incorrect url - chainType set manually', async () => {
      await expect(Sdk.createInstance({baseUrl: BASE_URL_HTTPS, chainType: ChainType.SUBSTRATE}))
        .rejects.toThrow(`Invalid base URL for Substrate interactions: ${BASE_URL_HTTPS}. It must start with 'wss://' to establish WSS connection.`);
    }, 20000);
    it('Invalid seed', async () => {
      const invalidSeed = 'my incorrect seed phrase';
      await expect(Sdk.createInstance({baseUrl: BASE_URL_WSS, seed: invalidSeed}))
        .rejects.toThrow(`Connection error: Error: Invalid seed`);
    }, 20000);
    it('Invalid seed with chainType set', async () => {
      const invalidSeed = 'my incorrect seed phrase';
      await expect(Sdk.createInstance({baseUrl: BASE_URL_WSS, chainType: ChainType.SUBSTRATE, seed: invalidSeed}))
        .rejects.toThrow(`Connection error: Error: Invalid seed`);
    }, 20000);
  });

    describe('EVM Initialization', () => {
      it('Create SDK Instance', async () => {
        const sdk = await Sdk.createInstance({baseUrl: BASE_URL_HTTPS, chainType: ChainType.EVM});
        expect(sdk).toBeInstanceOf(Main);
        expect(sdk['_api']).toBe(undefined);
        expect(sdk['_options'].baseUrl).toBe(BASE_URL_HTTPS);
        expect(sdk['_metadata'].baseUrl).toBe(BASE_URL_HTTPS);
        expect(sdk['_metadata'].chainType).toBe(ChainType.EVM);
  
        expect(sdk.did).toBeDefined();
        expect(sdk.rbac).toBeDefined();
        expect(sdk.storage).toBeDefined();
        // expect(sdk.ptp).toBeDefined(); // comment out when live
      }, 20000);
      // expected failure test cases
      it('Create SDK Instance with incorrect url', async () => {
        await expect(Sdk.createInstance({baseUrl: BASE_URL_WSS, chainType: ChainType.EVM}))
          .rejects.toThrow(`Invalid base URL for EVM interactions: ${BASE_URL_WSS}. It must start with 'https://' to establish RPC connection.`);
      }, 20000);
      it('Invalid seed', async () => {
        const invalidSeed = 'evm does not use seed';
        await expect(Sdk.createInstance({baseUrl: BASE_URL_HTTPS, chainType: ChainType.EVM, seed: invalidSeed}))
          .rejects.toThrow("Construction of EVM txs does not require seed/private key. Use the sendEvmTx() to send a transaction on chain with a private key or send manually.");
      }, 20000);

      // TODO: sendEvmTx tests!

  });
});

  // TODO write Unit Tests with Mocks to tests the internal functions