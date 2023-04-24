import { ApiPromise } from '@polkadot/api';

import { Main } from './index';
import { sleep } from '../../utils';

const BASE_URL = process.env["NX_NETWORK_BASE_URL"] as string;

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
      await expect(sdk).rejects.toThrow("Endpoint should start with 'ws://', received 'invalid url'");
    });

  });

  describe('connect', () => {
    it('should connect to the provided URL', async () => {
      const sdk = new Main({ baseUrl: BASE_URL });
      await sdk.connect();
      // const sdk = await Main.createInstance({ baseUrl: BASE_URL });
      await sdk.connect();
      expect(sdk['_api']?.isConnected).toBe(true);
      await sdk.disconnect().catch(() => ({}));
    });
  });

  describe('disconnect', () => {
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

});

