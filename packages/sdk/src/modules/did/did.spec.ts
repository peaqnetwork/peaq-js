import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { CustomDocumentFields, Did } from './index';
import { generateRandomString, unsubscribeRuntimeVersion } from '../../utils';

const BASE_URL = process.env['NX_NETWORK_BASE_URL'] as string;

describe('Did', () => {
  let api: ApiPromise;
  let keyring: Keyring;
  let alice: KeyringPair;
  let did: Did;

  beforeAll(async () => {
    const provider = new WsProvider(BASE_URL);
    api = await ApiPromise.create({ provider, noInitWarn: true });
    keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    did = new Did(api, { pair: alice });
  });

  afterAll(async () => {
    await unsubscribeRuntimeVersion(api);
    await api?.disconnect();
  });

  describe('create()', () => {
    it('should create a new Did', async () => {
      const name = `test-did-${generateRandomString()}`;

      const customFields: CustomDocumentFields = {
        services: [
          {
            id: 'svc1',
            type: 'Type1',
            serviceEndpoint: 'https://example.com',
            data: 'data',
          },
          {
            id: 'svc2',
            type: 'Type2',
            serviceEndpoint: 'https://example.com',
            data: 'data',
          },
        ],
      };

      const result = await did.create({
        address: alice.address,
        name,
        customDocumentFields: customFields,
      });

      expect(result.hash).toBeDefined();
      expect(typeof result.unsubscribe).toBe('function');
    });

    it('should throw an error if name is not provided', async () => {
      await expect(
        did.create({ address: alice.address, name: '' })
      ).rejects.toThrow('Name is required');
    });

    it('should throw error if service is missing required fields', async () => {
      const name = `test-did-${generateRandomString()}`;

      const customFields: any = {
        services: [
          {
            // Missing id
            type: 'Type1',
          },
        ],
      };

      await expect(
        did.create({
          address: alice.address,
          name,
          customDocumentFields: customFields,
        })
      ).rejects.toThrow('Service ID is required');
    });
  });

  describe('read()', () => {
    it('should throw an error when name is not provided', async () => {
      await expect(
        did.read({ address: alice.address, name: '' })
      ).rejects.toThrow('Name is required');
    });
    it('should return null when DID is not found', async () => {
      const name = '1';
      await expect(did.read({ address: alice.address, name })).resolves.toBeNull();
    });

    it('should read a DID', async () => {
      const name = 'test-did-19';
      const result = await did.read({ address: alice.address, name });

      expect(result).toBeDefined();
      expect(result?.value).toBeDefined();
      expect(result?.validity).toBeDefined();
      expect(result?.document).toBeDefined();
      expect(result?.document.id).toBeDefined();
      expect(result?.name).toBe(name);
      expect(result?.created).toBeDefined();
    });
  });
});
