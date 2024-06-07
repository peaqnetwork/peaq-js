import * as peaqDidProto from 'peaq-did-proto-js';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import type { ReadDidResponse } from '../../types';
import { CustomDocumentFields, Did } from './index';
import { unsubscribeRuntimeVersion } from '../../utils';

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
  }, 40000);

  afterAll(async () => {
    await unsubscribeRuntimeVersion(api);
    await api?.disconnect();
  });

  describe('create()', () => {
    // creates, reads, and removes to align with expected
    it('create single did with no custom fields', async () => {
      const new_did  = 'did-test-1';
      await createReadRemove(new_did, did, alice, null);
    }, 80000);

    // try to create a did of the same name -> expect error
    it('create did of same name error', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      await expect(did.create({ name: new_did }))
        .rejects.toThrow("Create DID Error: AttributeAlreadyExist for peaqDid.");

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 80000);

    // did with service custom field
    it('create custom did with service custom field', async () => {
      const new_did  = 'did-test-1';

      // create proto document to represent new custom service did documents fields
      const peaqServiceProto = new peaqDidProto.Service();
      peaqServiceProto.setId('machine-identifier-1');
      peaqServiceProto.setType('Machine-1');
      peaqServiceProto.setServiceendpoint('http://localhost:8080/ipfs/');

      const customFields: CustomDocumentFields = {
        services: [
          peaqServiceProto
        ]
      }

      await createReadRemove(new_did, did, alice, customFields);

    }, 80000);

    // verification and signature custom field
    it('create custom did with verification and signature custom fields', async () => {
      const new_did  = 'did-test-1';

      const peaqVerificationProto = new peaqDidProto.VerificationMethod();
      peaqVerificationProto.setType(peaqDidProto.VerificationType.ED25519VERIFICATIONKEY2020);

      const peaqSignatureProto = new peaqDidProto.Signature();
      peaqSignatureProto.setIssuer("123");
      peaqSignatureProto.setHash("0x123");

      const customFields: CustomDocumentFields = {
        verifications: [
          peaqVerificationProto
        ],
        signatures: [
          peaqSignatureProto
        ],
      }

      await createReadRemove(new_did, did, alice, customFields);
    }, 80000);

    // verification, signature, and service custom fields
    it('create custom did with verification and signature custom fields', async () => {
      const new_did  = 'did-test-1';

      const peaqVerificationProto = new peaqDidProto.VerificationMethod();
      peaqVerificationProto.setType(peaqDidProto.VerificationType.ED25519VERIFICATIONKEY2020);

      const peaqSignatureProto = new peaqDidProto.Signature();
      peaqSignatureProto.setIssuer("123");
      peaqSignatureProto.setHash("0x123");

      const peaqServiceProto = new peaqDidProto.Service();
      peaqServiceProto.setId('machine-identifier-1');
      peaqServiceProto.setType('Machine-1');
      peaqServiceProto.setServiceendpoint('http://localhost:8080/ipfs/');

      const customFields: CustomDocumentFields = {
        verifications: [
          peaqVerificationProto
        ],
        signatures: [
          peaqSignatureProto
        ],
        services: [
          peaqServiceProto
        ]
      }
      
      await createReadRemove(new_did, did, alice, customFields);
    }, 80000);
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
  });

  describe('update()', () => {
    it('try to update attribute that does not exist', async() => {
      const new_did  = 'did-test-1';
      const peaqVerificationProto = new peaqDidProto.VerificationMethod();
      peaqVerificationProto.setType(peaqDidProto.VerificationType.ED25519VERIFICATIONKEY2020);

      const customFields: CustomDocumentFields = {
        verifications: [
          peaqVerificationProto
        ],
      }

      await expect(did.update({
        name: new_did,
        customDocumentFields: customFields
      })).rejects.toThrow('Update DID Error: AttributeNotFound for peaqDid.');

    }, 40000);
    it('should update a DID', async () => {
      const new_did  = 'did-test-1';
      await did.create({name: new_did});

      const peaqVerificationProto = new peaqDidProto.VerificationMethod();
      peaqVerificationProto.setType(peaqDidProto.VerificationType.ED25519VERIFICATIONKEY2020);

      const peaqSignatureProto = new peaqDidProto.Signature();
      peaqSignatureProto.setIssuer("123");
      peaqSignatureProto.setHash("0x123");

      const peaqServiceProto = new peaqDidProto.Service();
      peaqServiceProto.setId('machine-identifier-1');
      peaqServiceProto.setType('Machine-1');
      peaqServiceProto.setServiceendpoint('http://localhost:8080/ipfs/');

      const customFields: CustomDocumentFields = {
        verifications: [
          peaqVerificationProto
        ],
        signatures: [
          peaqSignatureProto
        ],
        services: [
          peaqServiceProto
        ]
      }

      // how to confirm the previous verifications if they add a new one
      // do we want to overwrite previous?
      const result = await did.update({
        name: new_did,
        customDocumentFields: customFields
      });
      expect(result).toBeDefined();

      const result2 = await did.read({ address: alice.address, name: new_did });
      expect(result2).toBeDefined();

      console.log(result2?.document);

      await readDid(result2 as ReadDidResponse, new_did, alice, customFields);

      // remove did for cleanup
      const removeResult = await did.remove({name: new_did});
      expect(removeResult?.hash).toBeDefined();
      expect(typeof removeResult?.unsubscribe).toBe('function');
    }, 80000);
    });

  describe('remove()', () => {
    // try to remove a did not present
    it('try remove DID not present', async () => {
      const new_did = 'did-test-1';

      await expect(did.remove({name: new_did}))
        .rejects.toThrow('Remove DID Error: AttributeNotFound for peaqDid.');

    }, 40000);

    it('create & remove a DID', async () => {
      const new_did = 'did-test-1';
      await did.create({name: new_did});

      const result = await did.remove({name: new_did});

      expect(result?.hash).toBeDefined();
      expect(typeof result?.unsubscribe).toBe('function');
    }, 70000);
  });
});


async function createReadRemove(new_did: string, did: Did, alice: KeyringPair, customFields: CustomDocumentFields | null) {
  const result = await did.create({
    name: new_did,
    ...(customFields && { customDocumentFields: customFields })
  });

  expect(result.hash).toBeDefined();
  expect(typeof result.unsubscribe).toBe('function');

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
  await readDid(read_did as ReadDidResponse, new_did, alice, customFields || null);

  // remove did for cleanup
  const removeResult = await did.remove({name: new_did});
  expect(removeResult?.hash).toBeDefined();
  expect(typeof removeResult?.unsubscribe).toBe('function');

}

async function readDid(read_did: ReadDidResponse, new_did: string, alice: KeyringPair, customFields: CustomDocumentFields | null) {
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

  // test common did document default values
  expect(read_did?.document).toBeDefined();
  const didDocument = read_did?.document;
  expect(didDocument?.id).toBe(`did:peaq:${alice.address}`);
  expect(didDocument?.controller).toBe(`did:peaq:${alice.address}`);

  if (customFields == null){ // test did document default empty values
    expect(didDocument?.verificationmethodsList).toEqual([]);
    expect(didDocument?.signature).toBeUndefined(); // have undefined here, do we want empty list like others?
    expect(didDocument?.servicesList).toEqual([]);
    expect(didDocument?.authenticationsList).toEqual([]);
  }
  else { // test custom values if not default by looping thru the read did document to check against the expected set customFields

    // Iterate through verifications
    if (didDocument.verificationmethodsList) {
      didDocument.verificationmethodsList.forEach(verification => {
        customFields.verifications?.forEach(setVerification => {
          const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
          expect(uuidPattern.test(verification.id as string)).toBe(true);
          expect(verification.type).toEqual(setVerification.getType());
          expect(verification.controller).toEqual(`did:peaq:${alice.address}`);
          
          // error here with proto doc
          // expect(verification.publicKeyMultibase).toEqual(`z${alice.address}`);
        });
      });
    }

    // Iterate through signatures -> not iterating currently as there is only 1 expected signature
    if (didDocument.signature) {
      customFields.signatures?.forEach(setSignature => {
        expect(didDocument.signature.type).toEqual(setSignature.getType());
        expect(didDocument.signature.issuer).toEqual(setSignature.getIssuer());
        expect(didDocument.signature.hash).toEqual(setSignature.getHash());
      });
    }

    // Iterate through read DID services and check it matches the expected
    if (didDocument.servicesList) {
      didDocument.servicesList.forEach(service => {
        // currently debugging for proper proto creation
        //console.log("READ Service: ", service);
        customFields.services?.forEach(setService => { // Iterate through customFields to see if it was created correctly
          // currently debugging for proper proto creation
          //console.log("EXPECTED Service: ", setService);

          // TODO show discrepancy between read and expected service and how I can't access the read from the serviceendpoint
          // how to build new proto: https://github.com/peaqnetwork/peaq-network-did-proto-format
          expect(service.id).toEqual(setService.getId());
          expect(service.type).toEqual(setService.getType());
          if ('serviceEndpoint' in setService && service.serviceEndpoint != '') {
            // error here with proto doc
            //expect(service?.serviceEndpoint).toEqual(setService.serviceEndpoint);
          }
          if ('data' in setService && service.serviceEndpoint != '') {
            // error here with proto doc
            // expect(service.data).toEqual(setService.data);
          }
        });
      });
    }
  }
}



// old tests

    // it.skip('should create a new Did', async () => {
    //   const name = `test-did-1070`;

    //   const customFields: CustomDocumentFields = {
    //     verifications: [
    //       {
    //         type: 0
    //       },
    //       {
    //         type: 1
    //       }
    //     ],
    //     signatures: [
    //       {
    //         type: 1,
    //         issuer: "123",
    //         hash: "0x123"
    //       }
    //     ],
    //     services: [
    //       {
    //         id: 'svc1',
    //         type: 'Type1',
    //         serviceEndpoint: 'https://example.com',
    //         data: 'data',
    //       },
    //       {
    //         id: 'svc2',
    //         type: 'Type2',
    //         serviceEndpoint: 'https://example.com',
    //         data: 'data',
    //       },
    //     ],
    //   };

    //   const result = await did.create({
    //     name: name,
    //     customDocumentFields: customFields,
    //   });

      // // what can we use did hash for?
      // // - use did hash to check against read data matches the signature
    //   console.log(u8aToHex(result.hash));
    //   expect(result.hash).toBeDefined();
    //   expect(typeof result.unsubscribe).toBe('function');

      
    // }, 50000);

    // it('should throw an error if name is not provided', async () => {
    //   await expect(
    //     did.create({ address: alice.address, name: '' })
    //   ).rejects.toThrow('Name is required');
    // });

    // it('should throw error if service is missing required fields', async () => {
    //   const name = `test-did-${generateRandomString()}`;

    //   const customFields: any = {
    //     services: [
    //       {
    //         // Missing id
    //         type: 'Type1',
    //       },
    //     ],
    //   };

    //   await expect(
    //     did.create({
    //       address: alice.address,
    //       name,
    //       customDocumentFields: customFields,
    //     })
    //   ).rejects.toThrow('Service ID is required');
    // });