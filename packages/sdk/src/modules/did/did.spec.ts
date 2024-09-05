import dotenv from 'dotenv';
import * as peaqDidProto from 'peaq-did-proto-js';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a } from '@polkadot/util';
import type { DidDocument, ReadDidResponse } from '../../types';
import { CustomDocumentFields, Did } from './index';
import { unsubscribeRuntimeVersion } from '../../utils';
import { CreateDidError, ReadDidError, UpdateDidError, RemoveDidError} from '../../utils/errors';
import { Main as SDK } from '../main';

dotenv.config(); // Load variables from .env file

/**
 * Global variables used to initialize the BASE_URL, and seed phrases that are used to create wallets.
 * 
 * Address error used multiple times, so it is initialized here.
 */
const BASE_URL = process.env['BASE_URL'] as string;
const SEED = process.env['SEED'] as string;
const SEED2 = process.env['SEED2'] as string;

const address_error = `AddressError: Incorrect Substrate SS58/Ethereum Address format. Given address does not match expected length or contains an invalid char. 
        SS58 address are 58 char in length with 0, O, I & l omitted. Ethereum addresses are 42 characters in length, starting with "0x" followed by 
        40 hexadecimal characters (0-9, a-f, A-F) with no characters omitted.`
/**
 * Tests functionality in the sdk for DID operations. Before all tests, creates a new instance of
 * user Keyring to execute the operations. Creates, Reads, Updates, and Removes DID by calling
 * the peaq pallets to perform the operation as defined in did/index.tx and base/index.ts.
 * 
 * This flow ensures that a user needs less than .2 token to execute all tests and funds will be returned back.
 */
describe('Did', () => {
  let api: ApiPromise;
  let keyring: Keyring;
  let keyring2: Keyring;
  let user: KeyringPair;
  let user2: KeyringPair;
  let did: Did;
  let did2: Did;
  let sdk: SDK;

  beforeAll(async () => {
    const provider = new WsProvider(BASE_URL);
    api = await ApiPromise.create({ provider, noInitWarn: true });
    keyring = new Keyring({ type: 'sr25519' });
    keyring2 = new Keyring({ type: 'sr25519' });
    user = keyring.addFromUri(SEED);
    user2 = keyring2.addFromUri(SEED2);
    did = new Did(api, { pair: user });
    did2 = new Did(api, { pair: user2 });
    sdk = await SDK.createOfflineInstance();
  }, 40000);

  afterAll(async () => {
    await unsubscribeRuntimeVersion(api);
    await api?.disconnect();
  });

  /**
   * Tests the generation of a DID hash value, without calling blockchain extrinsics. Checks for expected errors.
   */
    describe('generate()', () => {
      it('generate did with an incorrect Substrate address', async () => {
        const address1 = 'Incorrect Address Format';
        const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
        const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has an additional char at the end (47 chars)
        const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
        const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
        const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
        const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included
  
        await expect(sdk.did.generate({address: address1}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address2}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address3}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address4}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address5}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address6}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address7}))
          .rejects.toThrow(new CreateDidError(address_error));
      });

      it('generate did with an incorrect Ethereum address', async () => {
        const address1 = 'Incorrect Address Format';
        const address2 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641CC';       // address has an additional char at the end (43 chars)
        const address3 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641';         // address has an one less char at the end (41 chars)
        const address4 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Z';        // address is proper length but has invalid hex value of 'Z'

        await expect(sdk.did.generate({address: address1}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address2}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address3}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(sdk.did.generate({address: address4}))
          .rejects.toThrow(new CreateDidError(address_error));
      });
  
      it('generate did', async () => {
        const result = await sdk.did.generate({address: user.address});
        const did_hash = result.value;
        // check did hash return value: starts with '0x' and only contains hexadecimal values
        expect(did_hash.startsWith('0x')).toBe(true);
        expect(/^0x[a-fA-F0-9]+$/.test(did_hash)).toBe(true);
      });

      it('generate did Substrate address', async () => {
        const result = await sdk.did.generate({address: user.address});
        const did_hash = result.value;
        // check did hash return value: starts with '0x' and only contains hexadecimal values
        expect(did_hash.startsWith('0x')).toBe(true);
        expect(/^0x[a-fA-F0-9]+$/.test(did_hash)).toBe(true);

        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;

        await readDocument(did_document, user, null, user.address);
      });

      it('generate did Ethereum address', async () => {
        const addressETH = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641C';
        const result = await sdk.did.generate({address: addressETH, customDocumentFields: {controller: addressETH}});
        const did_hash = result.value;
        // check did hash return value: starts with '0x' and only contains hexadecimal values
        expect(did_hash.startsWith('0x')).toBe(true);
        expect(/^0x[a-fA-F0-9]+$/.test(did_hash)).toBe(true);

        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;

        await readDocument(did_document, user, null, addressETH);
      });

      it('generate did Substrate address with a custom prefix, controller & document fields', async () => {
        const customFields: CustomDocumentFields = {
          prefix: 'custom_name',
          controller: `${user2.address}`,
          verifications: [{
            type: "Ed25519VerificationKey2020"
          }],
          signature: {
            type: "Ed25519VerificationKey2020",
            issuer: '123',
            hash: '0x123'
          },
          services: [{
            id: 'machine-identifier-1',
            type: 'Machine-1',
            serviceEndpoint: 'http://localhost:8080/ipfs/'
          }]
      }

        const result = await sdk.did.generate({address: user.address, customDocumentFields: customFields});
        const did_hash = result.value;
        // check did hash return value: starts with '0x' and only contains hexadecimal values
        expect(did_hash.startsWith('0x')).toBe(true);
        expect(/^0x[a-fA-F0-9]+$/.test(did_hash)).toBe(true);

        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;

        await readDocument(did_document, user, customFields, user.address);
      });

      it('generate did Ethereum address with a custom prefix, controller & document fields', async () => {
        const addressETH = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641C';
        const customFields: CustomDocumentFields = {
          prefix: 'custom_name',
          controller: addressETH,
          verifications: [{
            type: "Ed25519VerificationKey2020"
          }],
          signature: {
            type: "Ed25519VerificationKey2020",
            issuer: '123',
            hash: '0x123'
          },
          services: [{
            id: 'machine-identifier-1',
            type: 'Machine-1',
            serviceEndpoint: 'http://localhost:8080/ipfs/'
          }]
      }

        const result = await sdk.did.generate({address: addressETH, customDocumentFields: customFields});
        const did_hash = result.value;
        // check did hash return value: starts with '0x' and only contains hexadecimal values
        expect(did_hash.startsWith('0x')).toBe(true);
        expect(/^0x[a-fA-F0-9]+$/.test(did_hash)).toBe(true);

        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;

        await readDocument(did_document, user, customFields, addressETH);
      });
    });

  /**
   * Test the creation of DID using the sdk. Executes a pre-defined flow in createReadRemove()
   * to verify the operation. Checks for expected errors.
   */
  describe('create()', () => {
    // tests error when an empty name is set
    it('create did with no name set', async () => {
      await expect(did.create({name: ''}))
        .rejects.toThrow(new CreateDidError('NameError: Name is required when creating a DID.'));
    });
    // tests errors when an incorrect SS58 address is passed. 
    // link below states that SS58 address can only be 58 char long with the chars, "0, O, I, and l" omitted
    // https://docs.substrate.io/learn/accounts-addresses-keys/#:~:text=Address%20encoding%20and%20chain%2Dspecific%20addresses&text=The%20SS58%20address%20format%20is,than%20a%20hex%2Dencoded%20address
    it('create did with an incorrect address', async () => {
      const new_did  = 'did-test-1';
      const address1 = 'Incorrect Address Format';
      const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
      const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has an additional char at the end (47 chars)
      const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
      const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
      const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
      const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included

      await expect(did.create({name: new_did, address: address1}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(did.create({name: new_did, address: address2}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(did.create({name: new_did, address: address3}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(did.create({name: new_did, address: address4}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(did.create({name: new_did, address: address5}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(did.create({name: new_did, address: address6}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(did.create({name: new_did, address: address7}))
        .rejects.toThrow(new CreateDidError(address_error));
    });

    // throws an error when a seed phrase is not 12 or 24 words long
    it('create did with an incorrect seed', async () => {
      const new_did  = 'did-test-1';
      await expect(did.create({name: new_did, seed: 'My incorrect seed phrase'}))
        .rejects.toThrow(new CreateDidError('SeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
    });

    // creates, reads, and removes to align with expected
    it('create single did with no custom fields', async () => {
      const new_did  = 'did-test-1';
      await createReadRemove(new_did, did, user, null, null, null);
    }, 150000);

    // creates, reads, and removes to align with expected
    it('create single did with proper address initialization', async () => {
      const new_did  = 'did-test-1';
      const address = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pg';
      await createReadRemove(new_did, did, user, null, null, address);
    }, 150000);

    it('create single did with custom seed', async () => {
      const new_did  = 'did-test-1';
      const seed = SEED;
      await createReadRemove(new_did, did, user, null, seed, null);
    }, 150000);

    it('create did by setting address manually based on keyring', async () => {
      const new_did  = 'did-test-1';
      await createReadRemove(new_did, did, user, null, null, user.address);
    }, 150000);

    it('add a custom prefix when creating a did', async () => {
      const new_did  = 'did-test-1';
      const prefix = 'custom_name';
      const customFields: CustomDocumentFields = {
        prefix: prefix
      }
      await createReadRemove(new_did, did, user, customFields, null, user.address);
    }, 150000);

    // try to create a did of the same name -> expect error
    it('create did of same name error', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      await expect(did.create({ name: new_did }))
        .rejects.toThrow("Error: AttributeAlreadyExist for peaqDid.");

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    // did with service custom field
    it('create custom did with service custom field', async () => {
      const new_did  = 'did-test-1';

      const customFields: CustomDocumentFields = {
        services: [{
          id: 'Machine-1',
          type: 'Service-Endpoint',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
          },
          {
          id: 'Machine-1',
          type: 'Data',
          data: '0x12354terfsrew42'
        }]
      }
      // test
      await createReadRemove(new_did, did, user, customFields, null, null);
    }, 150000);

    it('create custom did without the necessary service fields', async () => {
      const new_did  = 'did-test-1';

      // needs to have data/service fields
      const customFields: CustomDocumentFields = {
        services: [{
          id: 'Machine-1',
          type: 'Service-Endpoint',
          },]
      }

      await expect(did.create({name: new_did,customDocumentFields: customFields}))
        .rejects.toThrow('Error: Either service endpoint or data is required for service');
    });

    // verification and signature custom field
    it('create custom did with verification and signature custom fields', async () => {
      const new_did  = 'did-test-1';

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        }
      }
      await createReadRemove(new_did, did, user, customFields, null, null);
    }, 150000);

    // verification, signature, and service custom fields
    it('create custom did with verification (ed), signature, & service custom fields', async () => {
      const new_did  = 'did-test-1';

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      await createReadRemove(new_did, did, user, customFields, null, null);
    }, 150000);

    it('create custom did with verification (sr), signature, & service custom fields', async () => {
      const new_did  = 'did-test-1';

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }],
        signature: {
          type: "Sr25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      await createReadRemove(new_did, did, user, customFields, null, null);
    }, 150000);

    it('create custom did with verification publicKeyMultibase set by user manually', async () => {
      const new_did  = 'did-test-1';

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Sr25519VerificationKey2020",
          publicKeyMultibase: 'z6Mk2LwdsH9ik4vY7m9k5npfJ8a2sBLyUv67mZrkLbPZ7rtN',
        }],
        signature: {
          type: "Sr25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      await createReadRemove(new_did, did, user, customFields, null, null);
    }, 150000);
  });


  /**
   * Majority of the read() tests are executed in the create() flow from the createReadRemove()
   * function. These tests perform the error checking and read with an address passed.
   */
  describe('read()', () => {
    it('should throw an error when name is not provided', async () => {
      await expect(
        did.read({ address: user.address, name: '' })
      ).rejects.toThrow('Name is required');
    });

    it('should return null when DID is not found', async () => {
      const name = '1';
      await expect(did.read({ address: user.address, name })).resolves.toBeNull();
    });
    it('read did with an incorrect address', async () => {
      const new_did  = 'did-test-1';
      const address1 = 'Incorrect Address Format';
      const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
      const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has an additional char at the end (47 chars)
      const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
      const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
      const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
      const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included

      await expect(did.read({name: new_did, address: address1}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(did.read({name: new_did, address: address2}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(did.read({name: new_did, address: address3}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(did.read({name: new_did, address: address4}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(did.read({name: new_did, address: address5}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(did.read({name: new_did, address: address6}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(did.read({name: new_did, address: address7}))
        .rejects.toThrow(new ReadDidError(address_error));
    });

    it('read a known did with address and proper name passed', async () => {
      const known_did  = 'did-test';

      const read_did = await did.read({name: known_did, address: user.address}) ;
      expect(read_did).toBeDefined();
      await readDid(read_did as ReadDidResponse, known_did, user, null);
    })
  });


  /**
   * Tests the update function in the peaq sdk for did. Checks for errors and proper
   * execution flow.
   */
  describe('update()', () => {
    it('update did with no name set', async () => {
      const customFields: CustomDocumentFields = {services: [{
        id: '#machine',
        type: 'machine',
        data: 'test_data'
      }]}
      await expect(did.update({name: '', customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError('NameError: Name is required when updating a DID.'));
    });
    // throws an error when a seed phrase is not 12 or 24 words long
    it('update did with an incorrect seed', async () => {
      const known_did  = 'did-test';
      const customFields: CustomDocumentFields = {services: [{
        id: '#machine',
        type: 'machine',
        data: 'test_data'
      }]}
      await expect(did.update({name: known_did, seed: 'My incorrect seed phrase', customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError('SeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
    });
    it('update did with an incorrect address', async () => {
      const new_did  = 'did-test-1';
      const address1 = 'Incorrect Address Format';
      const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
      const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has an additional char at the end (47 chars)
      const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
      const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
      const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
      const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included

      const customFields: CustomDocumentFields = {services: [{
        id: '#machine',
        type: 'machine',
        data: 'test_data'
      }]}

      await expect(did.update({name: new_did, address: address1, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(did.update({name: new_did, address: address2, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(did.update({name: new_did, address: address3, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(did.update({name: new_did, address: address4, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(did.update({name: new_did, address: address5, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(did.update({name: new_did, address: address6, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(did.update({name: new_did, address: address7, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
    });
    it('try to update attribute that does not exist', async() => {
      const new_did  = 'did-test-1';
      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
      }
      await expect(did.update({
        name: new_did,
        customDocumentFields: customFields
      })).rejects.toThrow(new UpdateDidError(`DidNotFoundError: DID Document of name ${new_did} for the account address ${user.address} was not found.`));

    }, 150000);

    it('try to update a did from an address the owner does not own', async() => {
      const new_did = 'did-test-1';
      // create a new did for user's did
      await did.create({name: new_did});
  
      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }

      // use the did2 instance of sdk which is created using the user2 keyring to try to update a did they do not own. Expects to throw an error.
      await expect(did2.update({
        name: new_did,
        address: user.address,
        customDocumentFields: customFields
      })).rejects.toThrow(new UpdateDidError("Error: AttributeAuthorizationFailed for peaqDid."));
  
      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');

    }, 150000);
    
    it('should update a DID', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      const customFields: CustomDocumentFields = {
        prefix: 'custom_name',
        controller: `${user2.address}`,
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      
      const result = await did.update({
        name: new_did,
        customDocumentFields: customFields
      });

      expect(result).toBeDefined();
      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user, customFields);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with a custom prefix', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      const customFields: CustomDocumentFields = {
        prefix: 'custom_name',
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      
      const result = await did.update({
        name: new_did,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();
      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user, customFields);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('create did with a custom prefix, and add a verification method. Verification method should use the previously set prefix.', async () => {
      const new_did  = 'did-test-1';
      const prefix = 'custom_name';
      const customFields: CustomDocumentFields = {
        prefix: prefix
      }

      // create new did to see if the prefix stays
      await did.create({name: new_did, customDocumentFields: customFields});

      // add verification, but do not change the prefix
      const customFields2: CustomDocumentFields = {
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }
      // add verification method. Should use the previously set prefix in the create function.
      const result = await did.update({name: new_did, customDocumentFields: customFields2});

      expect(result).toBeDefined();
      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      // custom fields to check which includes prefix and verification
      const customFields3: CustomDocumentFields = {
        prefix: prefix,
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }

      await readDid(result2 as ReadDidResponse, new_did, user, customFields3);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 100000);

    it('create did with a custom prefix, and add a verification method that also changes the prefix.', async () => {
      const new_did  = 'did-test-1';
      const prefix = 'custom_name';
      const customFields: CustomDocumentFields = {
        prefix: prefix
      }

      // create new did to see if the prefix stays
      await did.create({name: new_did, customDocumentFields: customFields});

      const customFields2: CustomDocumentFields = {
        prefix: 'new_prefix',
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }
      // add verification method. Uses the new set prefix.
      const result = await did.update({name: new_did, customDocumentFields: customFields2});

      expect(result).toBeDefined();
      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      // use the previously set customFields2 that will overwrite the previous prefix
      await readDid(result2 as ReadDidResponse, new_did, user, customFields2);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with an address passed', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      
      const result = await did.update({
        name: new_did,
        address: user.address,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user, customFields);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with a seed passed', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      
      const result = await did.update({
        name: new_did,
        seed: SEED,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user, customFields);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with a custom publicKeyMultibase set', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020",
          publicKeyMultibase: 'z6Mk2LwdsH9ik4vY7m9k5npfJ8a2sBLyUv67mZrkLbPZ7rtN'
        }],
        signature: {
          type: "Ed25519VerificationKey2020",
          issuer: '123',
          hash: '0x123'
        },
        services: [{
          id: 'machine-identifier-1',
          type: 'Machine-1',
          serviceEndpoint: 'http://localhost:8080/ipfs/'
        }]
      }
      
      const result = await did.update({
        name: new_did,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user, customFields);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);
    });


  /**
   * Tests the remove function from the peaq sdk for did. Ensures that a previously created did 
   * is removed correctly.
   */
  describe('remove()', () => {
    // try to remove a did not present
    it('try remove DID not present', async () => {
      const new_did = 'did-test-1';

      await expect(did.remove({name: new_did}))
        .rejects.toThrow(new RemoveDidError(`DidNotFoundError: DID Document of name ${new_did} for the account address ${user.address} was not found.`));

    });

    // throws an error when a seed phrase is not 12 or 24 words long
    it('create did with an incorrect seed', async () => {
      const new_did  = 'did-test-1';
      await expect(did.remove({name: new_did, seed: 'My incorrect seed phrase'}))
        .rejects.toThrow(new RemoveDidError('SeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
    });

    it('remove did with an incorrect address', async () => {
      const new_did  = 'did-test-1';
      const address1 = 'Incorrect Address Format';
      const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
      const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has an additional char at the end (47 chars)
      const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
      const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
      const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
      const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included

      await expect(did.remove({name: new_did, address: address1}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(did.remove({name: new_did, address: address2}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(did.remove({name: new_did, address: address3}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(did.remove({name: new_did, address: address4}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(did.remove({name: new_did, address: address5}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(did.remove({name: new_did, address: address6}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(did.remove({name: new_did, address: address7}))
        .rejects.toThrow(new RemoveDidError(address_error));
    });

    it('create & remove a DID', async () => {
      const new_did = 'did-test-1';
      await did.create({name: new_did});
      const result = await did.remove({name: new_did});

      expect(result?.block_hash).toBeDefined();
      expect(typeof result?.unsubscribe).toBe('function');
    }, 150000);

    it('try to remove DID they does not exist', async () =>{
      const new_did = 'did-test-1';
      await did.create({name: new_did}); // create did using user key

      await expect(did2.remove({name: new_did}))
        .rejects.toThrow(new RemoveDidError(`DidNotFoundError: DID Document of name ${new_did} for the account address ${user2.address} was not found.`));


      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('try to remove DID they do not own', async () =>{
      const new_did = 'did-test-1';
      await did.create({name: new_did}); // create did using user key

      await expect(did2.remove({name: new_did, address: user.address}))
        .rejects.toThrow(new RemoveDidError("Error: AttributeAuthorizationFailed for peaqDid."));


      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);
  });
});

/**
 * General Flow to ensure proper DID and DID Document creation.
 * 1. DID is created based on customFields (or uses none if none are set)
 * 2. Newly created DID is read
 *  - DID Document fields are compared to the expected the check for proper initialization/update/removal
 * 3. Previously created DID is removed 
 * 
 * @param new_did - The name of the did to be created/read from
 * @param did - Object representation of the sdk instance
 * @param user - KeyringPair object that contains the address from which the sdk was initialized with
 * @param customFields - The customizable fields the user manually set to be checked
 * @param seed - The seed field that can be set when creating the did
 * @param address - Address to be manually set when creating did
 * @returns - None
 */

async function createReadRemove(new_did: string, did: Did, user: KeyringPair, customFields: CustomDocumentFields | null, seed: string | null, address: string | null) {
  const result = await did.create({
    name: new_did,
    ...(address !== null && {address: address}),
    ...(customFields && { customDocumentFields: customFields }),
    ...(seed !== null && { seed: seed }), // Only add `seed` if it is not null
  });

  expect(result.block_hash).toBeDefined();
  // expect(typeof result.unsubscribe).toBe('function');

  // read newly created did
  const read_did = await did.read({
    name: new_did
  });

  // // helpful debugging
  // console.log("read_did", read_did, "\n for new name: ", new_did);
  // console.log("did document", read_did?.document, "\n for new name: ", new_did);

  // test name of set did
  expect(read_did).toBeDefined();

  // test specific did document information
  await readDid(read_did as ReadDidResponse, new_did, user, customFields || null);

  // remove did for cleanup
  const removeResult = await did.remove({name: new_did});
  expect(removeResult?.block_hash).toBeDefined();
  expect(typeof removeResult?.unsubscribe).toBe('function');
}

/**
 * Determines the validity of the returned object from the read() did function in the sdk. Ensures that 
 * the document contains the proper regex format of dynamic values. Checks for proper initialization
 * of the did document, whether or not customFields are set. 
 * 
 * @param read_did - Returned object from the read sdk function that contains the did document to be validated
 * @param new_did - The name of the did to be created/read from
 * @param user - KeyringPair object that contains the address from which the sdk was initialized with
 * @param customFields - The customizable fields the user manually set to be checked
 * @returns - None
 */
async function readDid(read_did: ReadDidResponse, new_did: string, user: KeyringPair, customFields: CustomDocumentFields | null) {
  expect(read_did).toBeDefined();
  expect(read_did?.name).toBe(new_did);

  // check value, validity, and created to be defined
  expect(read_did?.value).toBeDefined();
  expect(read_did?.validity).toBeDefined();
  expect(read_did?.value).toBeDefined();

  // value names based on expected regex formats
  const valuePattern = /^0x[0-9a-fA-F]+$/;
  const validityPattern = /^\d{1,3}(,\d{3})*$/;
  const createdPattern = /^\d{1,3}(,\d{3})*$/;
  
  // makes sure all values align with expected regex
  expect(valuePattern.test(read_did?.value as string)).toBe(true);
  expect(validityPattern.test(read_did?.validity as string)).toBe(true);
  expect(createdPattern.test(read_did?.created as string)).toBe(true);

  expect(read_did?.document).toBeDefined();
  const document = read_did?.document;
  const address = user.address;
  // tests did document values
  await readDocument(document, user, customFields, address);
}

async function readDocument(document: DidDocument, user: KeyringPair, customFields: CustomDocumentFields | null, address: string){
  const didDocument = document;
  if (customFields?.prefix) {
    expect(didDocument?.id).toBe(`did:${customFields?.prefix}:${address}`);
    if (customFields?.controller) { 
      expect(didDocument?.controller).toBe(`did:${customFields?.prefix}:${customFields?.controller}`);
    }
    else {
      expect(didDocument?.id).toBe(`did:${customFields?.prefix}:${address}`);
    }
  }
  else {
    expect(didDocument?.id).toBe(`did:peaq:${address}`);
    expect(didDocument?.controller).toBe(`did:peaq:${address}`);
  }

  if (customFields == null){ // test did document default empty values
    expect(didDocument?.verificationMethods).toEqual([]);
    expect(didDocument?.signature).toBeUndefined(); // have undefined here, do we want empty list like others?
    expect(didDocument?.services).toEqual([]);
    expect(didDocument?.authentications).toEqual([]);
  }
  else { // test custom values if not default by looping thru the read did document to check against the expected set customFields

    // Iterate through verifications
    if (didDocument.verificationMethods) {
      didDocument.verificationMethods.forEach(verification => {
        customFields.verifications?.forEach(setVerification => {
          // test verification id
          const patternSS58 = /^did:[^:]+:5[1-9A-HJ-NP-Za-km-z]{47}#keys-[\d]$/;
          const patternETH = /^did:[^:]+:0x[a-fA-F0-9]{40}#keys-[\d]$/;
          expect(patternSS58.test(verification.id as string) || patternETH.test(verification.id as string)).toBe(true);
          // test verification type
          expect(verification.type).toEqual(setVerification.type);

          // test verification prefix and controller
          if (customFields?.prefix && customFields?.controller){
            expect(verification.controller).toEqual(`did:${customFields?.prefix}:${customFields?.controller}`);
          }
          else if (customFields?.prefix && !customFields?.controller){
            expect(verification.controller).toEqual(`did:${customFields?.prefix}:${address}`);
          }
          else {
            expect(verification.controller).toEqual(`did:peaq:${address}`);
          }

          if (setVerification?.publicKeyMultibase){
            expect(verification.publicKeyMultibase).toEqual(setVerification?.publicKeyMultibase);
          }
          else {
            // test verification of the proper publicKeyMultibase pattern
            const multibase_pattern = /^[a-fA-F0-9]{64}$/;
            const multibase_pattern2 = /^[a-fA-F0-9]{40}$/;
            expect(multibase_pattern.test(verification.publicKeyMultibase as string) || multibase_pattern2.test(verification.publicKeyMultibase as string)).toBe(true);
          }
        });
      });
    }

    if (didDocument.signature) {
        expect(didDocument.signature.type).toEqual(customFields.signature?.type);
        expect(didDocument.signature.issuer).toEqual(customFields.signature?.issuer);
        expect(didDocument.signature.hash).toEqual(customFields.signature?.hash);
    }

    // Iterate through read DID services and check it matches the expected
    if (didDocument.services) {
      didDocument.services.forEach(service => {
        customFields.services?.forEach(setService => { // Iterate through customFields to see if it was created correctly
          if ('serviceEndpoint' in setService && service.data == undefined) {
            expect(service.id).toEqual(setService.id);
            expect(service.type).toEqual(setService.type);
            expect(service?.serviceEndpoint).toEqual(setService.serviceEndpoint);
          }
          if ('data' in setService && service.serviceEndpoint == undefined) {
            expect(service.id).toEqual(setService.id);
            expect(service.type).toEqual(setService.type);
            expect(service.data).toEqual(setService.data);
          }
        });
      });
    }
  }
}