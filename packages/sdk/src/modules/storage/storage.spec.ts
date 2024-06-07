import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Storage } from './index';
import { unsubscribeRuntimeVersion } from '../../utils';

const BASE_URL = "wss://wsspc1-qa.agung.peaq.network"//process.env['NX_NETWORK_BASE_URL'] as string;

describe('Storage', () => {
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

  // build out good testing sequences

  describe('addItem()', () => {
    it('basic add item', async() => {
        const itemType = "item_type"
        const item = "hi123";
        const result = await storage.addItem({
            itemType: itemType,
            item: item});
        console.log(result.log);
    }, 50000);
  });
  describe('getItem()', () => {
    it('basic get item', async() => {
        const itemType = "item_type"
        const result = await storage.getItem({
            itemType: itemType
        });
        console.log(result?.log);
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
        console.log(result.log);
    }, 50000);
  });

  describe('getItem()', () => {
    it('basic get item', async() => {
        const itemType = "item_type"
        const result = await storage.getItem({
            itemType: itemType
        });
        console.log(result?.log);
    }, 50000);
  });
  
  describe('removeItem()', () => {
    it('basic remove item', async() => {
        const itemType = "item_type"
        const result = await storage.removeItem({
            itemType: itemType
        });
        console.log(result.log);
    }, 50000);
  });
});
