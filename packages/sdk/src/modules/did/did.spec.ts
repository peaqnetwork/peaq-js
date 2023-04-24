import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Did } from './index';
import { unsubscribeRuntimeVersion } from '../../utils';

const BASE_URL = process.env["NX_NETWORK_BASE_URL"] as string;

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
      const name = 'test-did-15';
      const result = await did.create({ address: alice.address, name });
      expect(result.hash).toBeDefined();
      expect(typeof result.unsubscribe).toBe('function');
    });

    it('should throw an error if name is not provided', async () => {
        await expect(did.create({ address: alice.address, name: '' })).rejects.toThrow('Name is required');
    });
  });

  describe('read()', () => {
  
      it('should throw an error when name is not provided', async () => {
        await expect(did.read({ address: alice.address, name: '' })).rejects.toThrow(
          'Name is required'
        );
      });
      it('should throw an error when DID is not found', async () => {
        const name = '1';
        await expect(did.read({ address: alice.address, name })).rejects.toThrow(
          `DID attribute not found: address=${alice.address}, name=${name}`
        );
      });

      it('should read a DID', async () => {
        const name = 'test-did-14';
        const result = await did.read({ address: alice.address, name });
        
        expect(result).toBeDefined();
        expect(result.value).toBeDefined();
        expect(result.validity).toBeDefined();
        expect(result.document).toBeDefined();
        expect(result.document.id).toBeDefined();
        expect(result.name).toBe(name);
        expect(result.created).toBe('1,682,100,174,024');
      }
    );
  });
});
