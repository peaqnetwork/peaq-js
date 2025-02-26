import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Storage, AddItemResult, RemoveItemResult, UpdateItemResult} from './index';
import { u8aToHex, stringToU8a, hexToString } from '@polkadot/util';
import { unsubscribeRuntimeVersion } from '../../utils';
import { StorageError, ItemTypeError, ItemError, StorageAddressError} from '../../utils/errors';
import { Main as SDK } from '../main';
import { ChainType } from '../../types';



const BASE_URL_HTTPS = process.env['BASE_URL_HTTPS'] as string;
const BASE_URL_WSS = process.env['BASE_URL_WSS'] as string;
const BASE_URL = BASE_URL_HTTPS;

const EVM_ADDRESS = process.env['EVM_ADDRESS'] as string;
const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;


const SEED = process.env['SEED'] as string;

const address_error = `StorageAddressError: Incorrect Substrate SS58/Ethereum Address format. Given address does not match expected length or contains an invalid char. 
            SS58 address are 58 char in length with 0, O, I & l omitted. Ethereum addresses are 42 characters in length, starting with "0x" followed by 
            40 hexadecimal characters (0-9, a-f, A-F) with no characters omitted.`

// WIP -> Need to have further discussions on proper implementation
// - create test to make sure remove storage function only works with the address that created the object
describe('Storage', () => {
  describe('EVM Tests', () => {
    describe.skip('addItem()', () => {
    // 'my_new_item' 'evm-test-10000' exists
      it('try to add an item type with no name', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        await expect(sdk.storage.addItem({itemType: '', item: 'test'}))
        .rejects.toThrow(new StorageError("ItemTypeError: Item Type name is required"));
      });
      it('try to add an item with no name', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        await expect(sdk.storage.addItem({itemType: 'test', item: ''}))
        .rejects.toThrow(new StorageError("ItemError: Item name is required"));
      });
      it('try to add an item type larger than 64 bytes', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tooBig = "This is a sample string that is definitely more than 64 bytes long and should satisfy the requirement.";
        await expect(sdk.storage.addItem({itemType: tooBig, item: 'test'}))
        .rejects.toThrow(new StorageError("ItemTypeError: New Item Type cannot be larger than 64 bytes"));
      });
      it('try to add an item larger than 256 bytes', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tooBig = `The ancient forest was filled with a mysterious fog that twisted through the trees, whispering secrets that had been forgotten by time itself. A lone traveler, 
        with a weathered map in hand, ventured deeper into the unknown, the crunch of leaves underfoot echoing in the silence. The air was thick with the scent of pine and damp earth, 
        and every shadow seemed to shift with unseen movement. Somewhere in the distance, an owl hooted, its call a haunting melody that resonated through the darkness. As the traveler continued, 
        the fog began to clear, revealing a path lined with ancient stones, each one etched with symbols that glowed faintly in the dim light.`
        await expect(sdk.storage.addItem({itemType: 'test', item: tooBig}))
        .rejects.toThrow(new StorageError("ItemError: New Item cannot be larger than 256 bytes"));
      });
      it('add a new item', async () => {
        const itemType = 'evm-test-10000';
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tx = await sdk.storage.addItem({itemType: itemType, item: "this"});
        const receipt = await SDK.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
      }, 50000);
    });
    describe('getItem()', () => {
      it('try to add an item type with no name', async() => {
        const itemType = 'evm-test-10000';
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const result = await sdk.storage.getItem({itemType: itemType, address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        console.log(result);
      });
    });
    describe.skip('updateItem()', () => {
      it('try to update an item type with no name', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        await expect(sdk.storage.updateItem({itemType: '', item: 'test'}))
          .rejects.toThrow(new StorageError("ItemTypeError: Item Type name is required"));
      });
      it('try to update an item with no name', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        await expect(sdk.storage.updateItem({itemType: 'test', item: ''}))
          .rejects.toThrow(new StorageError("ItemError: Item name is required"));
      });
      it('try to update an item type larger than 64 bytes', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tooBig = "This is a sample string that is definitely more than 64 bytes long and should satisfy the requirement.";
        await expect(sdk.storage.updateItem({itemType: tooBig, item: 'test'}))
          .rejects.toThrow(new StorageError("ItemTypeError: New Item Type cannot be larger than 64 bytes"));
      });
      it('try to update an item larger than 256 bytes', async() => {
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tooBig = `The ancient forest was filled with a mysterious fog that twisted through the trees, whispering secrets that had been forgotten by time itself. A lone traveler, 
        with a weathered map in hand, ventured deeper into the unknown, the crunch of leaves underfoot echoing in the silence. The air was thick with the scent of pine and damp earth, 
        and every shadow seemed to shift with unseen movement. Somewhere in the distance, an owl hooted, its call a haunting melody that resonated through the darkness. As the traveler continued, 
        the fog began to clear, revealing a path lined with ancient stones, each one etched with symbols that glowed faintly in the dim light.`
        await expect(sdk.storage.updateItem({itemType: 'test', item: tooBig}))
          .rejects.toThrow(new StorageError("ItemError: New Item cannot be larger than 256 bytes"));
      });
      it('update and item', async() => {
        const itemType = 'evm-test-10000';
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tx = await sdk.storage.updateItem({itemType: itemType, item: "this1234"});
        const receipt = await SDK.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        console.log(receipt);
        const result = await sdk.storage.getItem({itemType: itemType, address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        console.log(result);
      }, 50000);
    });
    // does not work
    describe.skip('removeItem()', () => {
      it('try to remove item', async() => {
        const itemType = 'evm-test-10000';
        const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL});
        const tx = await sdk.storage.removeItem({itemType: itemType});
        const receipt = await SDK.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

    },50000);
  })

  });


  describe('Substrate Tests', () => {

    let api: ApiPromise;
    let keyring: Keyring;
    let user: KeyringPair;
    let storage: Storage;

    beforeAll(async () => {
      const provider = new WsProvider(BASE_URL_WSS);
      api = await ApiPromise.create({ provider, noInitWarn: true });
      keyring = new Keyring({ type: 'sr25519' });
      user = keyring.addFromUri(SEED);
      storage = new Storage(api, { pair: user, baseUrl: BASE_URL_WSS });
    }, 40000);

    afterAll(async () => {
      await unsubscribeRuntimeVersion(api);
      await api?.disconnect();
    });

    // TODO build out good testing sequences

    describe.skip('addItem()', () => {
      it('try to add an item type with no name', async() => {
        await expect(storage.addItem({itemType: '', item: 'test'}))
        .rejects.toThrow(new StorageError("ItemTypeError: Item Type name is required"));
      });
      it('try to add an item with no name', async() => {
        await expect(storage.addItem({itemType: 'test', item: ''}))
        .rejects.toThrow(new StorageError("ItemError: Item name is required"));
      });
      // throws an error when a seed phrase is not 12 or 24 words long
      it('add to storage with an incorrect seed', async () => {
        const new_did  = 'did-test-1';
        await expect(storage.addItem({itemType: new_did, item: 'hi123', seed: 'My incorrect seed phrase'}))
          .rejects.toThrow(new StorageError('StorageSeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
      });
      it('try to add an item type larger than 64 bytes', async() => {
        const tooBig = "This is a sample string that is definitely more than 64 bytes long and should satisfy the requirement.";
        await expect(storage.addItem({itemType: tooBig, item: 'test'}))
        .rejects.toThrow(new StorageError("ItemTypeError: New Item Type cannot be larger than 64 bytes"));
      });
      it('try to add an item larger than 256 bytes', async() => {
        const tooBig = `The ancient forest was filled with a mysterious fog that twisted through the trees, whispering secrets that had been forgotten by time itself. A lone traveler, 
        with a weathered map in hand, ventured deeper into the unknown, the crunch of leaves underfoot echoing in the silence. The air was thick with the scent of pine and damp earth, 
        and every shadow seemed to shift with unseen movement. Somewhere in the distance, an owl hooted, its call a haunting melody that resonated through the darkness. As the traveler continued, 
        the fog began to clear, revealing a path lined with ancient stones, each one etched with symbols that glowed faintly in the dim light.`
        await expect(storage.addItem({itemType: 'test', item: tooBig}))
        .rejects.toThrow(new StorageError("ItemError: New Item cannot be larger than 256 bytes"));
      });
      it('basic add item then remove', async() => {
          const itemType = "item_type"
          const item = "hi123";
          const result = await storage.addItem({
              itemType: itemType,
              item: item
          }) as AddItemResult;
          expect(result).toBeDefined();
          expect(result.message).toBe(`Successfully added the storage item type ${itemType} with item ${item} for the address ${user.address}`);
          const result2 = await storage.removeItem({itemType: itemType}) as AddItemResult;
          expect(result2).toBeDefined();
          expect(result2.message).toBe(`Successfully removed the storage item type ${itemType} from address ${user.address}`);
      }, 70000);

    });
    describe('getItem()', () => {
      it('try to add an item type with no name', async() => {
        await expect(storage.getItem({itemType: ''}))
        .rejects.toThrow(new StorageError("ItemTypeError: Item Type name is required"));
      });
      it('try to get an item with a bad address passed', async () => {
        const item_type  = 'item type with bad address test';
        const address1 = 'Incorrect Address Format';
        const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
        const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has an additional char at the end (47 chars)
        const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
        const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
        const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
        const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included
        await expect(storage.getItem({itemType: item_type, address: address1}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address2}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address3}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address4}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address5}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address6}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address7}))
          .rejects.toThrow(new StorageError(address_error));
      });
      it('generate did with an incorrect Ethereum address', async () => {
        const item_type  = 'item type with bad address test';
        const address1 = 'Incorrect Address Format';
        const address2 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641CC';       // address has an additional char at the end (43 chars)
        const address3 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641';         // address has an one less char at the end (41 chars)
        const address4 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Z';        // address is proper length but has invalid hex value of 'Z'
        await expect(storage.getItem({itemType: item_type, address: address1}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address2}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address3}))
          .rejects.toThrow(new StorageError(address_error));
        await expect(storage.getItem({itemType: item_type, address: address4}))
          .rejects.toThrow(new StorageError(address_error));
      });
      it('basic get item after creating, then delete', async() => {
          const itemType = "item_type"
          const item = "hi123";
          await storage.addItem({
              itemType: itemType,
              item: item
          });
          const result2 = await storage.getItem({
              itemType: itemType
          });
          expect(result2).toBeDefined();
          // const resultToString = hexToString(result2?.data);
          // expect(resultToString).toBe('hi123');
          const result3 = await storage.removeItem({itemType: itemType}) as RemoveItemResult;
          expect(result3).toBeDefined();
          expect(result3.message).toBe(`Successfully removed the storage item type ${itemType} from address ${user.address}`);
      }, 80000);
    });

    describe.skip('updateItem()', () => {
      it('try to update an item type with no name', async() => {
        await expect(storage.updateItem({itemType: '', item: 'test'}))
        .rejects.toThrow(new StorageError("ItemTypeError: Item Type name is required"));
      });
      it('try to update an item with no name', async() => {
        await expect(storage.updateItem({itemType: 'test', item: ''}))
        .rejects.toThrow(new StorageError("ItemError: Item name is required"));
      });
      // throws an error when a seed phrase is not 12 or 24 words long
      it('update to storage with an incorrect seed', async () => {
        const new_did  = 'did-test-1';
        await expect(storage.updateItem({itemType: new_did, item: 'hi123', seed: 'My incorrect seed phrase'}))
          .rejects.toThrow(new StorageError('StorageSeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
      });
      it('try to update an item type larger than 64 bytes', async() => {
        const tooBig = "This is a sample string that is definitely more than 64 bytes long and should satisfy the requirement.";
        await expect(storage.updateItem({itemType: tooBig, item: 'test'}))
        .rejects.toThrow(new StorageError("ItemTypeError: New Item Type cannot be larger than 64 bytes"));
      });
      it('try to update an item larger than 256 bytes', async() => {
        const tooBig = `The ancient forest was filled with a mysterious fog that twisted through the trees, whispering secrets that had been forgotten by time itself. A lone traveler, 
        with a weathered map in hand, ventured deeper into the unknown, the crunch of leaves underfoot echoing in the silence. The air was thick with the scent of pine and damp earth, 
        and every shadow seemed to shift with unseen movement. Somewhere in the distance, an owl hooted, its call a haunting melody that resonated through the darkness. As the traveler continued, 
        the fog began to clear, revealing a path lined with ancient stones, each one etched with symbols that glowed faintly in the dim light.`
        await expect(storage.updateItem({itemType: 'test', item: tooBig}))
        .rejects.toThrow(new StorageError("ItemError: New Item cannot be larger than 256 bytes"));
      });
      it('create item, read item, update item, read item, then remove', async() => {
          const itemType = "item_type";
          const item = "bye123";
          await storage.addItem({itemType: itemType, item: "hi123"});
          const result = await storage.getItem({
            itemType: itemType
          });
          expect(result).toBeDefined();
          // const resultToString = hexToString(result?.data);
          // expect(resultToString).toBe('hi123');
          const result2 = await storage.updateItem({
              itemType: itemType,
              item: item
          }) as UpdateItemResult;
          expect(result2).toBeDefined();
          expect(result2?.message).toBe(`Successfully updated the storage item type ${itemType} to the new item ${item} for the address ${user.address}`);
          const result3 = await storage.getItem({
            itemType: itemType
          });
          expect(result3).toBeDefined();
          // const resultToString2 = hexToString(result3?.data);
          // expect(resultToString2).toBe(item);
          await storage.removeItem({itemType: itemType});
      }, 90000);
    });

    
    describe.skip('removeItem()', () => {
      it('try to remove an item type with no name', async() => {
        await expect(storage.removeItem({itemType: ''}))
        .rejects.toThrow(new StorageError("ItemTypeError: Item Type name is required"));
      });
      // throws an error when a seed phrase is not 12 or 24 words long
      it('remove storage with an incorrect seed', async () => {
        const new_did  = 'did-test-1';
        await expect(storage.removeItem({itemType: new_did, seed: 'My incorrect seed phrase'}))
          .rejects.toThrow(new StorageError('StorageSeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
      });
      it('try to remove item', async() => {
          const itemType = "item_type"
          await storage.addItem({itemType: itemType, item: "hi123"});
          const result = await storage.removeItem({
              itemType: itemType
          }) as RemoveItemResult;
          expect(result.message).toBeDefined();
          expect(result?.message).toBe(`Successfully removed the storage item type ${itemType} from address ${user.address}`);
      }, 50000);
    });
  });
});