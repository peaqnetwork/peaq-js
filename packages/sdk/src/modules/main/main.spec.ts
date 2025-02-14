import { ApiPromise } from '@polkadot/api';

import { Main } from './index';
import { sleep } from '../../utils';
import { Main as SDK } from '../main';

const BASE_URL = process.env["BASE_URL"] as string;
const SUBSTRATE_ADDRESS = process.env["SUBSTRATE_ADDRESS"] as string;


describe('Main', () => {
  describe('createInstance', () => {
    it('should create Main instance and connect to the provided URL', async () => {
      const sdk = new Main({ baseUrl: BASE_URL });
      await sdk.connect();
      
      expect(sdk).toBeInstanceOf(Main);
      expect(sdk['_api']).toBeInstanceOf(ApiPromise);
      expect(sdk['_api']?.isConnected).toBe(true);
      expect(sdk['_options'].baseUrl).toBe(BASE_URL);

      await sdk.disconnect().catch(() => ({}));
    });

    it('should throw an error if the provided seed is invalid', async () => {
      const invalidSeed = 'invalid seed';
      const sdk = Main.createInstance({ baseUrl: BASE_URL, seed: invalidSeed });
      await expect(sdk).rejects.toThrow('Invalid seed');
    });

    it('should throw an error if the provided URL is invalid', async () => {
      const invalidUrl = 'invalid url';
      const sdk = Main.createInstance({ baseUrl: invalidUrl });
      expect(sdk).rejects.toThrow("Endpoint should start with 'ws://', received 'invalid url'");
    });

  });

  describe('connect', () => {
    it('should connect to the provided URL', async () => {
      const sdk = new Main({ baseUrl: BASE_URL });
      await sdk.connect();
      // const sdk = await Main.createInstance({ baseUrl: BASE_URL });
      expect(sdk['_api']?.isConnected).toBe(true);
      await sdk.disconnect().catch(() => ({}));
    });
  });

  describe.skip('disconnect', () => {
    it('should disconnect from the provided URL', async () => {
      const sdk = new Main({ baseUrl: BASE_URL });
      await sdk.connect();
      // const sdk = await Main.createInstance({ baseUrl: BASE_URL });
      const mockFn = jest.fn();

      sdk['_api']?.on("disconnected", mockFn);
      
      await sdk.disconnect().catch(() => ({}));
      await sleep(500);
      await new Promise(process.nextTick);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(sdk['_api']?.isConnected).toBe(false);
    });
  });

  /**
   * Tests EVM initialization in Main for create instance.
   */
  describe('EVM Create Instance Tests', () => {
    it('Default to Substrate', async () => {
      // substrate version with no seed set will be able to read a known DID:
      const sdk = await SDK.createInstance({baseUrl: BASE_URL});
      const result = await sdk.did.read({name: "did-test-123", address: SUBSTRATE_ADDRESS});
      expect(result).toBeDefined();
      expect(result?.name).toBe("did-test-123");
      expect(result?.document).toBeDefined();
    });
    it('Explicitly set chain type as substrate and read a well known DID', async () => {
      const sdk = await SDK.createInstance({chainType: 'substrate', baseUrl: BASE_URL});
      const result = await sdk.did.read({name: "did-test-123", address: SUBSTRATE_ADDRESS});
      expect(result).toBeDefined();
      expect(result?.name).toBe("did-test-123");
      expect(result?.document).toBeDefined();
    });
    it('Incorrect Chain Type set', async () => {
      await expect(SDK.createInstance({chainType: "denarius", baseUrl: BASE_URL}))
        .rejects.toThrow(new Error("Chain Type not recognized. Please set to either 'evm' or 'substrate' based on what environment you are trying to connect to. No chainType set defaults to substrate."));
    });
    it('Create instance of a evm sdk', async () => {
      const sdk = await SDK.createInstance({chainType: 'evm', baseUrl: BASE_URL});
      expect(sdk).toBeDefined();
      expect(sdk.did).toBeDefined();
      expect(sdk.rbac).toBeDefined();
      expect(sdk.storage).toBeDefined();
    });
    it('Create instance of a evm sdk with caps/lower case in chain type', async () => {
      const sdk = await SDK.createInstance({chainType: 'EvM', baseUrl: BASE_URL});
      expect(sdk).toBeDefined();
      expect(sdk.did).toBeDefined();
      expect(sdk.rbac).toBeDefined();
      expect(sdk.storage).toBeDefined();
    });
  });
});

