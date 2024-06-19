import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Storage } from './index';
import { unsubscribeRuntimeVersion } from '../../utils';

const BASE_URL = process.env['NX_NETWORK_BASE_URL'] as string;

// WIP -> Need to have further discussions on proper implementation
// - create test to make sure remove storage function only works with the address that created the object
describe.skip('Storage', () => {
  let api: ApiPromise;
  let keyring: Keyring;
  let alice: KeyringPair;
  let storage: Storage;

  beforeAll(async () => {
    const provider = new WsProvider(BASE_URL);
    api = await ApiPromise.create({ provider, noInitWarn: true });
    keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    storage = new Storage(api, { pair: alice });
  }, 40000);

  afterAll(async () => {
    await unsubscribeRuntimeVersion(api);
    await api?.disconnect();
  });

  // TODO build out good testing sequences

  describe('addItem()', () => {
    it('basic add item', async() => {
        const itemType = "item_type"
        const item = "hi123";
        const result = await storage.addItem({
            itemType: itemType,
            item: item});
        expect(result).toBeDefined();
        expect(result.log).toBe(`Successfully added the storage item type ${itemType} with item ${item} for the address ${alice.address}`)
    }, 50000);
  });
  describe('getItem()', () => {
    it('basic get item', async() => {
        const itemType = "item_type"
        const result = await storage.getItem({
            itemType: itemType
        });
        expect(result).toBeDefined();
        expect(result?.log).toBe('returned as hi123');
    }, 50000);
  });

  describe('updateItem()', () => {
    // should a failed extrinsic be sent if we try to update a value that already has the same item?
    it('basic get item', async() => {
        const itemType = "item_type";
        const item = "bye123";
        const result = await storage.updateItem({
            itemType: itemType,
            item: item
        });
        expect(result).toBeDefined();
        expect(result?.log).toBe(`Successfully updated the storage item type ${itemType} to the new item ${item} for the address ${alice.address}`)
    }, 50000);
  });

  describe('getItem()', () => {
    it('basic get item', async() => {
        const itemType = "item_type"
        const result = await storage.getItem({
            itemType: itemType
        });
        expect(result).toBeDefined();
        expect(result?.log).toBe('returned as bye123');
    }, 50000);
  });
  
  describe('removeItem()', () => {
    it('basic remove item', async() => {
        const itemType = "item_type"
        const result = await storage.removeItem({
            itemType: itemType
        });
        expect(result.log).toBeDefined();
        expect(result?.log).toBe(`Successfully removed the storage item type ${itemType} from address ${alice.address}`);
    }, 50000);
  });
});
