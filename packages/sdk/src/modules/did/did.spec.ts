import * as peaqDidProto from 'peaq-did-proto-js';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a,  } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ethers } from 'ethers';
import type { DidDocument } from '../../types';
import { CreateDidError, ReadDidError, UpdateDidError, RemoveDidError} from '../../utils/errors';
import { Main as Sdk } from '../main';
import { ChainType } from '../../types/common';
import {
  ReadDidResponse,
  CustomDocumentFields,
  CreateDidResult,
  RemoveDidResult,
  EvmTransaction
 } from './interface'



/**
 * Global variables used to initialize the BASE_URL, and seed phrases that are used to create wallets.
 * 
 * Address error used multiple times, so it is initialized here.
 */
// const BASE_URL_HTTPS = process.env['BASE_URL_HTTPS'] as string;
// const BASE_URL_WSS = process.env['BASE_URL_WSS'] as string;
// const BASE_URL = BASE_URL_HTTPS;

const SEED = process.env['SEED'] as string;
const SEED2 = process.env['SEED2'] as string;
// const SUBSTRATE_ADDRESS = process.env['SUBSTRATE_ADDRESS'] as string;
// const EVM_ADDRESS = process.env['EVM_ADDRESS'] as string;
// const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;
const PRECOMPILE_DID = process.env['PRECOMPILE_DID'] as string;

const address_error = `AddressError: Incorrect Substrate SS58/Ethereum Address format. Given address does not match expected length or contains an invalid char. 
        SS58 address are 58 char in length with 0, O, I & l omitted. Ethereum addresses are 42 characters in length, starting with "0x" followed by 
        40 hexadecimal characters (0-9, a-f, A-F) with no characters omitted.`



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


// used when testing bytecode of constructed evm txs
const abiCoder = new ethers.AbiCoder();
enum FunctionSignaturesPrefix {
  ADD_ATTRIBUTE = '0xcc4a70ca',
  UPDATE_ATTRIBUTE = '0x68b4b2c1',
  REMOVE_ATTRIBUTE = '0xe8a81690'
}
type ExpectedEvmCreateDid = {
  address: string;
  didName: string;
  customFields: CustomDocumentFields | null;
  validityFor: number;
}
type ExpectedEvmUpdateDid = {
  address: string;
  didName: string;
  customFields: CustomDocumentFields | null;
  validityFor: number;
}
type ExpectedEvmRemoveDid = {
  address: string;
  didName: string;
} 

/**
 * Tests functionality in the sdk for DID operations. Before all tests, creates a new instance of
 * user Keyring to execute the operations. Creates, Reads, Updates, and Removes DID by calling
 * the peaq pallets to perform the operation as defined in did/index.tx and base/index.ts.
 * 
 * This flow ensures that a user needs less than .2 token to execute all tests and funds will be returned back.
 */
describe('DID', () => {
  describe('EVM Tests', () => {
    describe.skip('generate()', () => {
      it('throw an error when no chainType set', async () => {
        const address = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641C';
        await expect(Sdk.generateDidDocument({address: EVM_ADDRESS}))
          .rejects.toThrow("AddressError: Incorrect Substrate SS58 Address format. SS58 address are 58 char in length with 0, O, I & l omitted.");
      });
      it('throw an error when an invalid EVM address is used', async () => {
        const address1 = 'Incorrect Address Format';
        const address2 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Ca';       // address has an additional char at the end (49 chars)
        const address3 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641';         // address has one less char at the end (47 chars)
        const address4 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Z';        // address is proper length but has invalid hex value of 'Z'
        await expect(Sdk.generateDidDocument({address: address1, chainType: ChainType.EVM}))
          .rejects.toThrow(`The address of ${address1} is not a valid EVM address`);
        await expect(Sdk.generateDidDocument({address: address2, chainType: ChainType.EVM}))
          .rejects.toThrow(`The address of ${address2} is not a valid EVM address`);
        await expect(Sdk.generateDidDocument({address: address3, chainType: ChainType.EVM}))
          .rejects.toThrow(`The address of ${address3} is not a valid EVM address`);
        await expect(Sdk.generateDidDocument({address: address4, chainType: ChainType.EVM}))
          .rejects.toThrow(`The address of ${address4} is not a valid EVM address`);
      });
      it('generate a basic DID document', async () => {
        const result = await Sdk.generateDidDocument({address: EVM_ADDRESS, chainType: ChainType.EVM});
        expect(result).toBeDefined();
        expect(/^[a-fA-F0-9]+$/.test(result.value)).toBe(true);
        // convert the serialized did into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;
        await readDocument(did_document, null, EVM_ADDRESS);
      });
      it('generate a DID document with custom fields', async () => {
        const customFields: CustomDocumentFields = {
          services: [{
            id: '#serviceEndpoint',
            type: 'serviceEndpoint',
            serviceEndpoint: 'http://localhost:8080/ipfs/'
          }]
        }
        const result = await Sdk.generateDidDocument({address: EVM_ADDRESS, chainType: ChainType.EVM, customDocumentFields: customFields});
        expect(/^[a-fA-F0-9]+$/.test(result.value)).toBe(true);
        // convert the serialized did into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;
        await readDocument(did_document, customFields, EVM_ADDRESS);
      });
      it('generate did Ethereum address with more diverse fields', async () => {
        const customFields: CustomDocumentFields = {
          prefix: 'custom_name',
          controller: EVM_ADDRESS,
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
        const result = await Sdk.generateDidDocument({address: EVM_ADDRESS, chainType: ChainType.EVM, customDocumentFields: customFields});
        expect(/^[a-fA-F0-9]+$/.test(result.value)).toBe(true);
        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;
        await readDocument(did_document, customFields, EVM_ADDRESS);
      });
    });
    describe.skip('create()', () => {
      let sdk: Sdk;
      beforeAll(async () => {
        sdk = await Sdk.createInstance({baseUrl: BASE_URL_HTTPS, chainType: ChainType.EVM});
      });
      it('throw error when no name set', async () => {
        await expect(sdk.did.create({name: ''}))
          .rejects.toThrow(new CreateDidError('NameError: Name is required when creating a DID.'));
      });
      it('throw error when incorrect EVM address', async () => {
        const name = 'did-test-1';
        const address1 = 'Incorrect Address Format';
        const address2 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Ca';       // address has an additional char at the end (49 chars)
        const address3 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641';         // address has one less char at the end (47 chars)
        const address4 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Z';        // address is proper length but has invalid hex value of 'Z'
        await expect(sdk.did.create({name: name, address: address1}))
          .rejects.toThrow(`The address of ${address1} is not a valid EVM address`);
        await expect(sdk.did.create({name: name, address: address2}))
          .rejects.toThrow(`The address of ${address2} is not a valid EVM address`);
        await expect(sdk.did.create({name: name, address: address3}))
          .rejects.toThrow(`The address of ${address3} is not a valid EVM address`);
        await expect(sdk.did.create({name: name, address: address4}))
          .rejects.toThrow(`The address of ${address4} is not a valid EVM address`);
          await expect(sdk.did.create({name: name, address: SUBSTRATE_ADDRESS}))
          .rejects.toThrow(`The address of ${SUBSTRATE_ADDRESS} is not a valid EVM address`);
      });
      it('throw error when no address passed in create() for EVM', async () => {
        const name = 'did-test-1';
        await expect(sdk.did.create({name: name}))
          .rejects.toThrow(new Error("Error: Address is required when creating an EVM transaction since an Account is never stored from seed."));
      });
      it('build an ethereum transaction (does not send)', async () => {
        const name = 'did-test-1';
        const expected: ExpectedEvmCreateDid = {
          address: EVM_ADDRESS,
          didName: name,
          customFields: null,
          validityFor: 0
        };
        const tx = await sdk.did.create({name: name, address: EVM_ADDRESS}) as EvmTransaction;
        await checkEvmTx(tx, FunctionSignaturesPrefix.ADD_ATTRIBUTE, expected);
      });
      it('build an ethereum transaction with custom fields (does not send)', async () => {
        const name = 'did-test-1';
        // create the custom fields for the DID Document
        const customFields: CustomDocumentFields = {
          prefix: 'custom_name',
          verifications: [{
            type: "EcdsaSecp256k1RecoveryMethod2020"
          }],
          signature: {
            type: "EcdsaSecp256k1RecoveryMethod2020",
            issuer: '123',
            hash: '0x123'
          },
          services: [{
            id: 'machine-identifier-1',
            type: 'Machine-1',
            serviceEndpoint: 'http://localhost:8080/ipfs/'
          }]
        };
        // create an object of what is to be expected in the `data` of the transaction
        const expected: ExpectedEvmCreateDid = {
          address: EVM_ADDRESS,
          didName: name,
          customFields: customFields,
          validityFor: 0
        };
        const tx = await sdk.did.create({name: name, address: EVM_ADDRESS, customDocumentFields: customFields}) as EvmTransaction;
        await checkEvmTx(tx, FunctionSignaturesPrefix.ADD_ATTRIBUTE, expected);
      });
      it('throw error when did of same name is attempted to be created', async () => {
        const new_did  = 'did-test-1';
        const tx = await sdk.did.create({name: new_did, address: EVM_ADDRESS});
        await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // try to create again
        const tx2 = await sdk.did.create({ name: new_did, address: EVM_ADDRESS });
        await expect(Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE}))
          .rejects.toThrow("Transaction reverted with error: AttributeAlreadyExist");

        // remove did for cleanup
        const tx3 = await sdk.did.remove({name: new_did, address: EVM_ADDRESS});
        await Sdk.sendEvmTx({tx: tx3, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
      }, 150000);
      // creates, reads, and removes to align with expected
      it('create single did with no custom fields; creates, reads, and removes', async () => {
        const name  = 'did-test-1';
        const expected: ExpectedEvmCreateDid = {
          address: EVM_ADDRESS,
          didName: name,
          customFields: null,
          validityFor: 0
        };
        await createReadRemove(name, sdk, EVM_ADDRESS, null, null, EVM_ADDRESS, expected);
      }, 150000);
      it('create single did with custom fields; creates, reads, and removes', async () => {
        const name  = 'did-test-1';
        const customFields: CustomDocumentFields = {
          verifications: [{
            type: "EcdsaSecp256k1RecoveryMethod2020"
          }],
          signature: {
            type: "EcdsaSecp256k1RecoveryMethod2020",
            issuer: '123',
            hash: '0x123'
          },
          services: [{
            id: 'machine-identifier-1',
            type: 'Machine-1',
            serviceEndpoint: 'http://localhost:8080/ipfs/'
          }]
        };
        const expected: ExpectedEvmCreateDid = {
          address: EVM_ADDRESS,
          didName: name,
          customFields: customFields,
          validityFor: 0
        };
        await createReadRemove(name, sdk, EVM_ADDRESS, customFields, null, EVM_ADDRESS, expected);
      }, 150000);
      it('throw error when incorrect verification method set for EVM', async () => {
        const name  = 'did-test-1';
        const verificationType = "Wrong Type";
        const verificationType2 = "Ed25519VerificationKey2020";
        const verificationType3 = "Sr25519VerificationKey2020";
        const customFields: CustomDocumentFields = {
          verifications: [{
            type: verificationType
          }]
        };
        await expect(sdk.did.create({name: name, address: EVM_ADDRESS, customDocumentFields: customFields}))
          .rejects.toThrow(`GenerateDidError: Error: Verification Type for EVM of ${verificationType} not recognized. Currently only supports method of "EcdsaSecp256k1RecoveryMethod2020" for EVM txs.`);
        const customFields2: CustomDocumentFields = {
            verifications: [{
              type: verificationType2
            }]
          };
        await expect(sdk.did.create({name: name, address: EVM_ADDRESS, customDocumentFields: customFields2}))
          .rejects.toThrow(`GenerateDidError: Error: Verification Type for EVM of ${verificationType2} not recognized. Currently only supports method of "EcdsaSecp256k1RecoveryMethod2020" for EVM txs.`);
        const customFields3: CustomDocumentFields = {
            verifications: [{
              type: verificationType3
            }]
          };
        await expect(sdk.did.create({name: name, address: EVM_ADDRESS, customDocumentFields: customFields3}))
          .rejects.toThrow(`GenerateDidError: Error: Verification Type for EVM of ${verificationType3} not recognized. Currently only supports method of "EcdsaSecp256k1RecoveryMethod2020" for EVM txs.`);
      });
    });
      // TODO try to create with the seed phrase as well

    describe.skip('read()', () => {
      let sdk: Sdk;
      let knownDidNoFields: string;
      let knownDidWithFields: string;

      beforeAll(async () => {
        sdk = await Sdk.createInstance({baseUrl: BASE_URL_HTTPS, chainType: ChainType.EVM});
        knownDidNoFields = "did-test-with-no-custom-fields";
        knownDidWithFields = "did-test-with-custom-fields";
      });
      it('throw error when wssBaseUrl is not provided', async () => {
        await expect(
          sdk.did.read({ address: EVM_ADDRESS, name: knownDidNoFields })
        ).rejects.toThrow( "Error: Need to provide a wss url for the chain you plan to read from.");
      });
      it('throw error when incorrect wssBaseUrl is used', async () => {
        await expect(sdk.did.read({ address: EVM_ADDRESS, name: knownDidNoFields, wssBaseUrl: BASE_URL_HTTPS }))
          .rejects.toThrow(`Base url of ${BASE_URL_HTTPS}, is not valid. It must start with 'wss://' to establish WSS connection to read data.`);
      });
      it('throw error when name is not provided', async () => {
        await expect(
          sdk.did.read({ address: EVM_ADDRESS, name: '', wssBaseUrl: BASE_URL_WSS})
        ).rejects.toThrow('Name is required');
      });
      it('throw error when DID is not found', async () => {
        await expect(sdk.did.read({ address: EVM_ADDRESS, name: "no_did", wssBaseUrl: BASE_URL_WSS }))
          .rejects.toThrow(`Error: Data for the name no_did at the wss url ${BASE_URL_WSS} at address ${EVM_ADDRESS} was not found.`);
      });
      it('throw error with an incorrect address', async () => {
        const name = 'did-test-1';
        const address1 = 'Incorrect Address Format';
        const address2 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Ca';       // address has an additional char at the end (49 chars)
        const address3 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641';         // address has one less char at the end (47 chars)
        const address4 = '0x9Eeab1aCcb1A701aEfAB00F3b8a275a39646641Z';        // address is proper length but has invalid hex value of 'Z'
        await expect(sdk.did.read({name: name, address: address1, wssBaseUrl: BASE_URL_WSS}))
          .rejects.toThrow(`The address of ${address1} is not a valid EVM address`);
        await expect(sdk.did.read({name: name, address: address2, wssBaseUrl: BASE_URL_WSS}))
          .rejects.toThrow(`The address of ${address2} is not a valid EVM address`);
        await expect(sdk.did.read({name: name, address: address3, wssBaseUrl: BASE_URL_WSS}))
          .rejects.toThrow(`The address of ${address3} is not a valid EVM address`);
        await expect(sdk.did.read({name: name, address: address4, wssBaseUrl: BASE_URL_WSS}))
          .rejects.toThrow(`The address of ${address4} is not a valid EVM address`);
          await expect(sdk.did.read({name: name, address: SUBSTRATE_ADDRESS, wssBaseUrl: BASE_URL_WSS}))
          .rejects.toThrow(`The address of ${SUBSTRATE_ADDRESS} is not a valid EVM address`);
      });
      it('read on a known DID with no custom data', async () => {
        const result = await sdk.did.read({name: knownDidNoFields, address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        await readDid(result as ReadDidResponse, knownDidNoFields, EVM_ADDRESS, null);
      });
      it('read on a known DID with custom data', async () => {
        const customFields: CustomDocumentFields = {
          prefix: 'custom_name',
          verifications: [{
            type: "EcdsaSecp256k1RecoveryMethod2020"
          }],
          signature: {
            type: "EcdsaSecp256k1RecoveryMethod2020",
            issuer: '123',
            hash: '0x123'
          },
          services: [{
            id: 'machine-identifier-1',
            type: 'Machine-1',
            serviceEndpoint: 'http://localhost:8080/ipfs/'
          }]
        }
        const result = await sdk.did.read({name: knownDidWithFields, address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        await readDid(result as ReadDidResponse, knownDidWithFields, EVM_ADDRESS, customFields);
      });
    });

    describe('update()', () => {
      let sdk: Sdk;
      beforeAll(async () => {
        sdk = await Sdk.createInstance({baseUrl: BASE_URL_HTTPS, chainType: ChainType.EVM});
      });
      it('throw error when updated did with no name set', async () => {
        const customFields: CustomDocumentFields = {services: [{
          id: '#machine',
          type: 'machine',
          data: 'test_data'
        }]}
        await expect(sdk.did.update({name: '', customDocumentFields: customFields}))
          .rejects.toThrow(new UpdateDidError('NameError: Name is required when updating a DID.'));
      });
      it('throw error when no address is passed', async () => {
        const customFields: CustomDocumentFields = {}
        await expect(sdk.did.update({name: 'valid-did', customDocumentFields: customFields}))
          .rejects.toThrow("Error: Address is required when updating an EVM transaction since an Account is never stored from seed.");
      });
      it('try to update a DID on EVM when no WSS is set', async () => {
        const customFields: CustomDocumentFields = {}
        await expect(sdk.did.update({name: 'valid-did', address: EVM_ADDRESS, customDocumentFields: customFields}))
          .rejects.toThrow("GenerateDidError: ReadDidError: Error: Need to provide a wss url for the chain you plan to read from.");
      });
      it('Try to update a DID that does not exist', async () => {
        await expect(sdk.did.update({name: "my-fake-did", address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS, customDocumentFields: {verifications: [{type: "EcdsaSecp256k1RecoveryMethod2020"}]}}))
          .rejects.toThrow(`GenerateDidError: ReadDidError: Error: Data for the name my-fake-did at the wss url ${BASE_URL_WSS} at address ${EVM_ADDRESS} was not found.`)
      });
      it('Update a previously created DID', async () => {
        const didName = "evm-test-10004";
        const customFields: CustomDocumentFields = {verifications: [{type: "EcdsaSecp256k1RecoveryMethod2020"}]};
        const expected: ExpectedEvmUpdateDid = {
          address: EVM_ADDRESS,
          didName: didName,
          customFields: customFields,
          validityFor: 0
        }

        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.did.update({name: didName, address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS, customDocumentFields: customFields}) as EvmTransaction;
        await checkEvmTx(tx, FunctionSignaturesPrefix.UPDATE_ATTRIBUTE, expected);
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        console.log(`Receipt for updated ${didName}: ${receipt}`);


        const result = await sdk.did.read({name: didName, address: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        console.log(result?.document)
        await readDid(result as ReadDidResponse, didName, EVM_ADDRESS, customFields);
      }, 50000);
    });

    describe.skip('remove()', () => {
      it('Try to remove a DID that does not exist', async () => {
        const didName = "my-fake-did";
        const expected: ExpectedEvmRemoveDid = {
          address: EVM_ADDRESS,
          didName: didName
        }
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.did.remove({name: didName, address: EVM_ADDRESS}) as EvmTransaction;
        await checkEvmTx(tx, FunctionSignaturesPrefix.REMOVE_ATTRIBUTE, expected); // should still be constructed correctly

        await expect(Sdk.sendEvmTx({tx: tx,baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE}))
          .rejects.toThrow("Transaction reverted with error: AttributeNotFound");
      });
      it('Try to remove a known DID', async () => {
        const didName = "evm-test-100000";
        const expected: ExpectedEvmRemoveDid = {
          address: EVM_ADDRESS,
          didName: didName
        }
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.did.remove({name: didName, address: EVM_ADDRESS}) as EvmTransaction;
        await checkEvmTx(tx, FunctionSignaturesPrefix.REMOVE_ATTRIBUTE, expected); // should still be constructed correctly

        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        console.log(`Receipt for removed ${didName}: ${receipt}`);

        // make sure it was removed
        await expect(Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE}))
          .rejects.toThrow("Transaction reverted with error: AttributeNotFound");
      }, 50000);

      it('Try to remove another known DID', async () => {
        const didName = "evm-test-100001";
        const expected: ExpectedEvmRemoveDid = {
          address: EVM_ADDRESS,
          didName: didName
        }
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.did.remove({name: didName, address: EVM_ADDRESS}) as EvmTransaction;
        await checkEvmTx(tx, FunctionSignaturesPrefix.REMOVE_ATTRIBUTE, expected); // should still be constructed correctly

        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        console.log(`Receipt for removed ${didName}: ${receipt}`);

        // make sure it was removed
        await expect(Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE}))
          .rejects.toThrow("Transaction reverted with error: AttributeNotFound");
      }, 50000);
    });
  });



  /**
   * Tests the generation of a DID hash value, without calling blockchain extrinsics. Checks for expected errors.
   */
  describe.skip('Substrate Tests', () => {
    let keyring: Keyring;
    let keyring2: Keyring;
    let user: KeyringPair;
    let user2: KeyringPair;
    let sdk: Sdk;
    let sdk2: Sdk;
    beforeAll(async () => {
      keyring = new Keyring({ type: 'sr25519' });
      keyring2 = new Keyring({ type: 'sr25519' });
      await cryptoWaitReady();
      user = keyring.addFromUri(SEED);
      await cryptoWaitReady();
      user2 = keyring2.addFromUri(SEED2);
      sdk = await Sdk.createInstance({baseUrl: BASE_URL_WSS, seed: SEED});
      sdk2 = await Sdk.createInstance({baseUrl: BASE_URL_WSS, seed: SEED2});
    }, 40000);
    afterAll(async () => {
    });

    describe('generate()', () => {
      it('generate did with an incorrect Substrate address', async () => {
        const address1 = 'Incorrect Address Format';
        const address2 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pgg'; // address has an additional char at the end (49 chars)
        const address3 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P';   // address has one less char at the end (47 chars)
        const address4 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12P0';  // address that is proper length but has 0 included
        const address5 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PO';  // address that is proper length but has O included
        const address6 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12PI';  // address that is proper length but has I included
        const address7 = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pl';  // address that is proper length but has I included
  
        await expect(Sdk.generateDidDocument({address: address1}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(Sdk.generateDidDocument({address: address2}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(Sdk.generateDidDocument({address: address3}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(Sdk.generateDidDocument({address: address4}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(Sdk.generateDidDocument({address: address5}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(Sdk.generateDidDocument({address: address6}))
          .rejects.toThrow(new CreateDidError(address_error));
        await expect(Sdk.generateDidDocument({address: address7}))
          .rejects.toThrow(new CreateDidError(address_error));
      });
      it('generate did', async () => {
        const result = await Sdk.generateDidDocument({address: user.address});
        const did_hash = result.value;
        // check did hash return value: only contains hexadecimal values
        expect(/^[a-fA-F0-9]+$/.test(did_hash)).toBe(true);
      });
      it('generate did Substrate address', async () => {
        const result = await Sdk.generateDidDocument({address: user.address});
        const did_hash = result.value;
        // check did hash return value: only contains hexadecimal values
        expect(/^[a-fA-F0-9]+$/.test(did_hash)).toBe(true);

        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;

        await readDocument(did_document, null, user.address);
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
        const result = await Sdk.generateDidDocument({address: user.address, customDocumentFields: customFields});
        const did_hash = result.value;
        // check did hash return value: only contains hexadecimal values
        expect(/^[a-fA-F0-9]+$/.test(did_hash)).toBe(true);
        // convert the did hash into a readable did document to check the default values
        const document = peaqDidProto.Document.deserializeBinary(hexToU8a(result?.value));
        const did_document = document.toObject() as DidDocument;
        await readDocument(did_document, customFields, user.address);
      });
    });

  /**
   * Test the creation of DID using the sdk. Executes a pre-defined flow in createReadRemove()
   * to verify the operation. Checks for expected errors.
   */
  describe('create()', () => {
    // tests error when an empty name is set
    it('create did with no name set', async () => {
      await expect(sdk.did.create({name: ''}))
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

      await expect(sdk.did.create({name: new_did, address: address1}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(sdk.did.create({name: new_did, address: address2}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(sdk.did.create({name: new_did, address: address3}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(sdk.did.create({name: new_did, address: address4}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(sdk.did.create({name: new_did, address: address5}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(sdk.did.create({name: new_did, address: address6}))
        .rejects.toThrow(new CreateDidError(address_error));
      await expect(sdk.did.create({name: new_did, address: address7}))
        .rejects.toThrow(new CreateDidError(address_error));
    });

    // throws an error when a seed phrase is not 12 or 24 words long
    it('create did with an incorrect seed', async () => {
      const new_did  = 'did-test-1';
      await expect(sdk.did.create({name: new_did, seed: 'My incorrect seed phrase'}))
        .rejects.toThrow(new CreateDidError('SeedError: Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.'));
    });

    // creates, reads, and removes to align with expected
    it('create single did with no custom fields', async () => {
      const new_did  = 'did-test-1';
      await createReadRemove(new_did, sdk, user.address, null, null, null, null);
    }, 150000);

    // creates, reads, and removes to align with expected
    it('create single did with proper address initialization', async () => {
      const new_did  = 'did-test-1';
      const address = '5Df42mkztLtkksgQuLy4YV6hmhzdjYvDknoxHv1QBkaY12Pg';
      await createReadRemove(new_did, sdk, user.address, null, null, address, null);
    }, 150000);

    it('create single did with custom seed', async () => {
      const new_did  = 'did-test-1';
      const seed = SEED;
      await createReadRemove(new_did, sdk, user.address, null, seed, null, null);
    }, 150000);

    it('create did by setting address manually based on keyring', async () => {
      const new_did  = 'did-test-1';
      await createReadRemove(new_did, sdk, user.address, null, null, user.address, null);
    }, 150000);

    it('add a custom prefix when creating a did', async () => {
      const new_did  = 'did-test-1';
      const prefix = 'custom_name';
      const customFields: CustomDocumentFields = {
        prefix: prefix
      }
      await createReadRemove(new_did, sdk, user.address, customFields, null, user.address, null);
    }, 150000);

    // try to create a did of the same name -> expect error
    it('create did of same name error', async () => {
      const new_did  = 'did-test-1';
      await sdk.did.create({name: new_did});

      await expect(sdk.did.create({ name: new_did }))
        .rejects.toThrow("Error: AttributeAlreadyExist for peaqDid.");

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
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
      await createReadRemove(new_did, sdk, user.address, customFields, null, null, null);
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

      await expect(sdk.did.create({name: new_did,customDocumentFields: customFields}))
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
      await createReadRemove(new_did, sdk, user.address, customFields, null, null, null);
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
      await createReadRemove(new_did, sdk, user.address, customFields, null, null, null);
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
      await createReadRemove(new_did, sdk, user.address, customFields, null, null, null);
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
      await createReadRemove(new_did, sdk, user.address, customFields, null, null, null);
    }, 150000);
  });


  /**
   * Majority of the read() tests are executed in the create() flow from the createReadRemove()
   * function. These tests perform the error checking and read with an address passed.
   */
  describe('read()', () => {
    it('should throw an error when name is not provided', async () => {
      await expect(
        sdk.did.read({ address: user.address, name: '' })
      ).rejects.toThrow('Name is required');
    });

    it('should return null when DID is not found', async () => {
      const name = '1';
      await expect(sdk.did.read({ address: user.address, name })).resolves.toBeNull();
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

      await expect(sdk.did.read({name: new_did, address: address1}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(sdk.did.read({name: new_did, address: address2}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(sdk.did.read({name: new_did, address: address3}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(sdk.did.read({name: new_did, address: address4}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(sdk.did.read({name: new_did, address: address5}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(sdk.did.read({name: new_did, address: address6}))
        .rejects.toThrow(new ReadDidError(address_error));
      await expect(sdk.did.read({name: new_did, address: address7}))
        .rejects.toThrow(new ReadDidError(address_error));
    });

    it('read a known did with address and proper name passed', async () => {
      const known_did  = 'did-test-123';

      const read_did = await sdk.did.read({name: known_did, address: user.address}) ;
      expect(read_did).toBeDefined();
      await readDid(read_did as ReadDidResponse, known_did, user.address, null);
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
      await expect(sdk.did.update({name: '', customDocumentFields: customFields}))
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
      await expect(sdk.did.update({name: known_did, seed: 'My incorrect seed phrase', customDocumentFields: customFields}))
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

      await expect(sdk.did.update({name: new_did, address: address1, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(sdk.did.update({name: new_did, address: address2, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(sdk.did.update({name: new_did, address: address3, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(sdk.did.update({name: new_did, address: address4, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(sdk.did.update({name: new_did, address: address5, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(sdk.did.update({name: new_did, address: address6, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
      await expect(sdk.did.update({name: new_did, address: address7, customDocumentFields: customFields}))
        .rejects.toThrow(new UpdateDidError(address_error));
    });
    it('try to update attribute that does not exist', async() => {
      const new_did  = 'did-test-1';
      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Ed25519VerificationKey2020"
        }],
      }
      await expect(sdk.did.update({
        name: new_did,
        customDocumentFields: customFields
      })).rejects.toThrow(new UpdateDidError(`DidNotFoundError: DID Document of name ${new_did} for the account address ${user.address} was not found.`));

    }, 150000);

    it('try to update a did from an address the owner does not own', async() => {
      const new_did = 'did-test-1';
      // create a new did for user's did
      await sdk.did.create({name: new_did});
  
      const customFields: CustomDocumentFields = {
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }

      // use the did2 instance of sdk which is created using the user2 keyring to try to update a did they do not own. Expects to throw an error.
      await expect(sdk2.did.update({
        name: new_did,
        address: user.address,
        customDocumentFields: customFields
      })).rejects.toThrow(new UpdateDidError("Error: AttributeAuthorizationFailed for peaqDid."));
  
      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');

    }, 150000);
    
    it('should update a DID', async () => {
      const new_did  = 'did-test-1';
      await sdk.did.create({name: new_did});

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
      
      const result = await sdk.did.update({
        name: new_did,
        customDocumentFields: customFields
      });

      expect(result).toBeDefined();
      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with a custom prefix', async () => {
      const new_did  = 'did-test-1';
      await sdk.did.create({name: new_did});

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
      
      const result = await sdk.did.update({
        name: new_did,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();
      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
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
      await sdk.did.create({name: new_did, customDocumentFields: customFields});

      // add verification, but do not change the prefix
      const customFields2: CustomDocumentFields = {
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }
      // add verification method. Should use the previously set prefix in the create function.
      const result = await sdk.did.update({name: new_did, customDocumentFields: customFields2});

      expect(result).toBeDefined();
      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      // custom fields to check which includes prefix and verification
      const customFields3: CustomDocumentFields = {
        prefix: prefix,
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }

      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields3);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
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
      await sdk.did.create({name: new_did, customDocumentFields: customFields});

      const customFields2: CustomDocumentFields = {
        prefix: 'new_prefix',
        verifications: [{
          type: "Sr25519VerificationKey2020"
        }]
      }
      // add verification method. Uses the new set prefix.
      const result = await sdk.did.update({name: new_did, customDocumentFields: customFields2});

      expect(result).toBeDefined();
      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      // use the previously set customFields2 that will overwrite the previous prefix
      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields2);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with an address passed', async () => {
      const new_did  = 'did-test-1';
      await sdk.did.create({name: new_did});

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
      
      const result = await sdk.did.update({
        name: new_did,
        address: user.address,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with a seed passed', async () => {
      const new_did  = 'did-test-1';
      await sdk.did.create({name: new_did});

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
      
      const result = await sdk.did.update({
        name: new_did,
        seed: SEED,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('should update a DID with a custom publicKeyMultibase set', async () => {
      const new_did  = 'did-test-1';
      await sdk.did.create({name: new_did});

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
      
      const result = await sdk.did.update({
        name: new_did,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await sdk.did.read({ address: user.address, name: new_did });
      expect(result2).toBeDefined();

      await readDid(result2 as ReadDidResponse, new_did, user.address, customFields);

      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
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

      await expect(sdk.did.remove({name: new_did}))
        .rejects.toThrow(new RemoveDidError(`DidNotFoundError: DID Document of name ${new_did} for the account address ${user.address} was not found.`));

    });

    // throws an error when a seed phrase is not 12 or 24 words long
    it('create did with an incorrect seed', async () => {
      const new_did  = 'did-test-1';
      await expect(sdk.did.remove({name: new_did, seed: 'My incorrect seed phrase'}))
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

      await expect(sdk.did.remove({name: new_did, address: address1}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(sdk.did.remove({name: new_did, address: address2}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(sdk.did.remove({name: new_did, address: address3}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(sdk.did.remove({name: new_did, address: address4}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(sdk.did.remove({name: new_did, address: address5}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(sdk.did.remove({name: new_did, address: address6}))
        .rejects.toThrow(new RemoveDidError(address_error));
      await expect(sdk.did.remove({name: new_did, address: address7}))
        .rejects.toThrow(new RemoveDidError(address_error));
    });

    it('create & remove a DID', async () => {
      const new_did = 'did-test-1';
      await sdk.did.create({name: new_did});
      const result = await sdk.did.remove({name: new_did}) as RemoveDidResult;

      expect(result?.block_hash).toBeDefined();
      expect(typeof result?.unsubscribe).toBe('function');
    }, 150000);

    it('try to remove DID they does not exist', async () =>{
      const new_did = 'did-test-1';
      await sdk.did.create({name: new_did}); // create did using user key

      await expect(sdk2.did.remove({name: new_did}))
        .rejects.toThrow(new RemoveDidError(`DidNotFoundError: DID Document of name ${new_did} for the account address ${user2.address} was not found.`));


      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);

    it('try to remove DID they do not own', async () =>{
      const new_did = 'did-test-1';
      await sdk.did.create({name: new_did}); // create did using user key

      await expect(sdk2.did.remove({name: new_did, address: user.address}))
        .rejects.toThrow(new RemoveDidError("Error: AttributeAuthorizationFailed for peaqDid."));


      // remove did for cleanup
      const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
      expect(removeResult?.block_hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 150000);
  });
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
 * @param expectedByteCode - Used to determine whether or not the constructed EVM TX bytecode is valid.
 * @returns - None
 */
async function createReadRemove(new_did: string, sdk: Sdk, user: string, customFields: CustomDocumentFields | null, seed: string | null, address: string | null , expectedByteCode: ExpectedEvmCreateDid | null) {
  // 1. create
  const result = await sdk.did.create({
    name: new_did,
    ...(address !== null && {address: address}),
    ...(customFields !== null && { customDocumentFields: customFields }),
    ...(seed !== null && { seed: seed }), // Only add `seed` if it is not null
  }) as CreateDidResult | EvmTransaction;

  // CreateDidResult Case
  if ('block_hash' in result){
    expect(result.block_hash).toBeDefined();
    // 2. read
    const read_did = await sdk.did.read({
      name: new_did
    });
    expect(read_did).toBeDefined();
    await readDid(read_did as ReadDidResponse, new_did, user, customFields || null);
    // 3. remove
    const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
    expect(removeResult?.block_hash).toBeDefined();
    expect(typeof removeResult?.unsubscribe).toBe('function');
  }

  // EvmTransaction Case
  else if ('to' in result) {
    await checkEvmTx(result, FunctionSignaturesPrefix.ADD_ATTRIBUTE, expectedByteCode);
    await Sdk.sendEvmTx({tx: result, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
    // 2. read
    const read_did = await sdk.did.read({
      name: new_did,
      address: user,
      wssBaseUrl: BASE_URL_WSS
    });
    expect(read_did).toBeDefined();
    await readDid(read_did as ReadDidResponse, new_did, user, customFields || null);
    // 3. remove
    const tx = await sdk.did.remove({name: new_did, address: user}) as EvmTransaction;
    await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
  }

  // Failure
  else {
    console.log(result);
    throw new Error(`Return Object of ${result} is not recognized.`)
  }


  // expect(typeof result.unsubscribe).toBe('function');

  // // read newly created did
  // const read_did = await sdk.did.read({
  //   name: new_did
  // });

  // // helpful debugging
  // console.log("read_did", read_did, "\n for new name: ", new_did);
  // console.log("did document", read_did?.document, "\n for new name: ", new_did);

  // // test name of set did
  // expect(read_did).toBeDefined();

  // // test specific did document information
  // await readDid(read_did as ReadDidResponse, new_did, user, customFields || null);

  // // remove did for cleanup
  // const removeResult = await sdk.did.remove({name: new_did}) as RemoveDidResult;
  // expect(removeResult?.block_hash).toBeDefined();
  // expect(typeof removeResult?.unsubscribe).toBe('function');
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
async function readDid(read_did: ReadDidResponse, new_did: string, address: string, customFields: CustomDocumentFields | null) {
  expect(read_did).toBeDefined();
  expect(read_did?.name).toBe(new_did);

  // check value, validity, and created to be defined
  expect(read_did?.value).toBeDefined();
  expect(read_did?.validity).toBeDefined();
  expect(read_did?.value).toBeDefined();

  // value names based on expected regex formats
  const valuePattern = /^[0-9a-fA-F]+$/;
  const validityPattern = /^\d{1,3}(,\d{3})*$/;
  const createdPattern = /^\d{1,3}(,\d{3})*$/;
  
  // makes sure all values align with expected regex
  expect(valuePattern.test(read_did?.value as string)).toBe(true);
  expect(validityPattern.test(read_did?.validity as string)).toBe(true);
  expect(createdPattern.test(read_did?.created as string)).toBe(true);

  expect(read_did?.document).toBeDefined();
  const document = read_did?.document;

  // tests did document values
  await readDocument(document, customFields, address);
}

async function readDocument(document: DidDocument, customFields: CustomDocumentFields | null | undefined, address: string){
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
            const multibase_pattern3 = /^0x[a-fA-F0-9]{40}$/;
            expect(multibase_pattern.test(verification.publicKeyMultibase as string) || multibase_pattern2.test(verification.publicKeyMultibase as string) || multibase_pattern3.test(verification.publicKeyMultibase as string)).toBe(true);
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

/**
 * Reads the Evm Tx object and determines whether of not the transaction object was constructed properly.
 * 
 * @param tx - EVM transaction with a to parameter (DID precompile) and data parameter (function and params in DID precompile)
 * @param functionPrefix - Identifies which function is being executed on the DID precompile
 * @param expected - The parameters of the encoded calldata to be sent on chain
 * 
 * @returns - None
 */
async function checkEvmTx(tx: EvmTransaction, functionPrefix: FunctionSignaturesPrefix, expected: ExpectedEvmCreateDid | ExpectedEvmUpdateDid| ExpectedEvmRemoveDid | null) {
  expect(tx).toBeDefined();
  expect(tx.to).toBeDefined();
  expect(tx.data).toBeDefined();
  expect(tx.to).toBe(PRECOMPILE_DID);
  await decodeTxData(tx, functionPrefix, expected);
  return;
}

/**
 * Decodes the data based on what type of transaction is occurring to guarantee
 * what is being sent to chain is valid.
 * 
 * @param tx - EVM transaction with a to parameter and data parameter
 * @param functionPrefix - Identifies which function is being executed on the DID precompile
 * @param expected - The parameters of the encoded calldata to be sent on chain
 * @returns - None
 */
async function decodeTxData(tx: EvmTransaction, functionPrefix: FunctionSignaturesPrefix, expected: ExpectedEvmCreateDid | ExpectedEvmUpdateDid | ExpectedEvmRemoveDid | null) {
  expect(tx.data.startsWith(functionPrefix)).toBe(true);
  const encodedParameters = "0x" + tx.data.slice(10);

  switch (functionPrefix) {
    case FunctionSignaturesPrefix.ADD_ATTRIBUTE: {
      const decoded = abiCoder.decode(
        ["address", "bytes", "bytes", "uint32"],
        encodedParameters
      );
      const address = decoded[0];
      const didName = decoded[1];
      const didVal = decoded[2];
      const validityFor = decoded[3];

      const originalAddress = address;
      const originalName = ethers.toUtf8String(didName);
      const originalDidValue = ethers.toUtf8String(didVal);
      const document = peaqDidProto.Document.deserializeBinary(hexToU8a(originalDidValue)).toObject() as DidDocument;
      const originalValidity = Number(validityFor);

      expect(originalAddress).toBe(expected?.address);
      expect(originalName).toBe(expected?.didName);
      if (expected != null && 'customFields' in expected) {
        readDocument(document, expected?.customFields, EVM_ADDRESS); // checks DID Document
      }
      expect(originalValidity).toBe(0);
      return;
    }
    case FunctionSignaturesPrefix.UPDATE_ATTRIBUTE: {
      const decoded = abiCoder.decode(
        ["address", "bytes", "bytes", "uint32"],
        encodedParameters
      );
      const address = decoded[0];
      const didName = decoded[1];
      const didVal = decoded[2];
      const validityFor = decoded[3];

      const originalAddress = address;
      const originalName = ethers.toUtf8String(didName);
      const originalDidValue = ethers.toUtf8String(didVal);
      const document = peaqDidProto.Document.deserializeBinary(hexToU8a(originalDidValue)).toObject() as DidDocument;
      const originalValidity = Number(validityFor);

      expect(originalAddress).toBe(expected?.address);
      expect(originalName).toBe(expected?.didName);
      if (expected != null && 'customFields' in expected) {
        readDocument(document, expected?.customFields, EVM_ADDRESS); // checks DID Document
      } 
      expect(originalValidity).toBe(0);
      return;
    }
      // Implement logic for CASE3
      // return;
      
    case FunctionSignaturesPrefix.REMOVE_ATTRIBUTE:
      const decoded = abiCoder.decode(
        ["address", "bytes"],
        encodedParameters
      );
      const address = decoded[0];
      const didName = decoded[1];

      const originalAddress = address;
      const originalName = ethers.toUtf8String(didName);

      expect(originalAddress).toBe(expected?.address);
      expect(originalName).toBe(expected?.didName);
      return;
      
    default:
      // This ensures exhaustiveness – if a new enum value is added,
      // TypeScript will warn if it's not handled.
      throw new Error(`Unhandled function prefix: ${functionPrefix}`);
  }
}
