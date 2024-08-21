import * as peaqDidProto from 'peaq-did-proto-js';
import { Attribute } from '@peaq-network/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { v4 as uuidv4 } from 'uuid';

import { createStorageKeys } from '../../utils';
import { CreateDidError, NameError, SeedError, AddressError, ReadDidError, UpdateDidError, RemoveDidError, DidNotFoundError, NoCustomFieldsError} from '../../utils/errors';
import type { Address, ReadDidResponse, SDKMetadata, SignTransction } from '../../types';
import { CreateStorageKeysEnum, DidDocument } from '../../types';
import { Base } from '../base';

export interface CustomDocumentFields {
  prefix?: string,
  verifications?: Verification[],
  signature?: Signature,
  services?: Service[];
}

export interface UpdateDocumentFields {
  prefix?: string,
  controller?: string,
  verifications?: Verification[],
  signature?: Signature,
  services?: Service[];
}

type Verification = {
  id?: string;
  type: peaqDidProto.VerificationType;
  controller?: string;
  publicKeyMultibase?: string;
}

type Signature = {
  type: peaqDidProto.VerificationType;
  issuer: string;
  hash: string;
}

type Service = {
  id: string;
  type: string;
  serviceEndpoint?: string;
  data?: string;
}

interface CreateDidOptions {
  name: string;
  address?: Address;
  seed?: string;
  customDocumentFields?: CustomDocumentFields;
}

interface ReadDidOptions {
  name: string;
  address?: Address;
}

interface UpdateDidOptions {
  name: string;
  address?: Address;
  seed?: string;
  customDocumentFields: UpdateDocumentFields;
}

interface UpdateDidDocumentOptions {
  didAccountAddress: Address;
  didControllerAddress: Address;
  customDocumentFields?: UpdateDocumentFields;
  oldDocument: DidDocument
}

interface RemoveDidOptions {
  name: string;
  address?: Address;
  seed?: string;
}

interface CreateDidResult {
  hash: CodecHash;
  unsubscribe: () => void;
}

interface RemoveDidResult {
  log?: string,
  hash: CodecHash;
  unsubscribe: () => void;
}

interface UpdateDidResult {
  log: string,
  hash: CodecHash;
  unsubscribe: () => void;
}


interface DidDocumentOptions {
  didAccountAddress: Address;
  didControllerAddress: Address;
  customDocumentFields?: CustomDocumentFields;
}

export class Did extends Base {
  constructor(
    protected override readonly _api?: ApiPromise,
    protected readonly _metadata?: SDKMetadata,
    protected _prefix?: string

  ) {
    super();
  }

  /**
   * Creates a new DID by adding a new attribute to the PEAQ DID registry.
   * @param options - The options for creating the DID.
   * @returns A promise that resolves when the DID is created.
   */
  public async create(
    options: CreateDidOptions,
    statusCallback?: (result: ISubmittableResult) => void | Promise<void>
  ): Promise<CreateDidResult> {
    try {
      const api = this._getApi();

      const { name, address = '', seed = '', customDocumentFields } = options;

      if (!name) throw new NameError('Name is required when creating a DID.');
      if (seed !== '') this._checkSeed(seed);
      if (address !== '') this._checkAddress(address);

      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || keyPair.address;

      const didDocument = this._createDidDocument({
        didAccountAddress: accountAddress,
        didControllerAddress: keyPair.address,
        customDocumentFields,
      });

      const attributeExtrinsic = api.tx?.['peaqDid']?.['addAttribute'](
        accountAddress,
        name,
        didDocument,
        null
      );

      const nonce = await this._getNonce(keyPair.address);
      const eventData = await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
      const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
          statusCallback(result as unknown as ISubmittableResult);
      });

      return {
        hash: eventData[0]?.blockHash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
        throw new CreateDidError(`${error}`);
      }
  }

  /**
   * Reads the attribute of a PEAQ DID from the registry.
   * @param options - The options for reading the DID attribute.
   * @returns A promise that resolves with the DID attribute.
   */
  public async read(options: ReadDidOptions): Promise<ReadDidResponse | null> {
    try {
      const api = this._getApi();

      const { name, address = '' } = options;

      if (!name) throw new Error('Name is required when reading a DID.');
      if (address !== '') this._checkAddress(address);

      const accountAddress = address || this._metadata?.pair?.address;

      if (!accountAddress) throw new Error('Address is required');

      const { hashed_key } = createStorageKeys([
        {
          value: accountAddress,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        { value: name, type: CreateStorageKeysEnum.STANDARD },
      ]);

      const did = (await api.query?.['peaqDid']?.['attributeStore'](
        hashed_key
      )) as unknown as Attribute;

      if (!did || did.isStorageFallback) return null;

      const document = peaqDidProto.Document.deserializeBinary(did?.value);

      return {
        ...did.toHuman(),
        document: document.toObject(),
      } as ReadDidResponse;
    } catch (error) {
      throw new ReadDidError(`${error}`);
    }
  }

  public async update(options: UpdateDidOptions,
    statusCallback?: (result: ISubmittableResult) => void | Promise<void>
  ): Promise<UpdateDidResult | null> {
    try {
      const api = this._getApi();

      const { name, address = '', seed = '', customDocumentFields } = options;

      if (!name) throw new NameError('Name is required when updating a DID.');
      if (seed !== '') this._checkSeed(seed);
      if (address !== '') this._checkAddress(address);

      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || keyPair.address;

      if (!accountAddress) throw new AddressError('Address is required');
      if (!customDocumentFields) throw new NoCustomFieldsError('DID Document fields must be configured before manually changing.');

      const readDocument = await this.read({name: name, address: accountAddress});
      if (!readDocument) throw new DidNotFoundError(`DID Document of name ${name} for the account address ${accountAddress} was not found.`);

      const oldDocument = readDocument?.document as DidDocument;
      const didDocument = this._updateDidDocument({
        didAccountAddress: accountAddress,
        didControllerAddress: keyPair.address,
        customDocumentFields: customDocumentFields,
        oldDocument: oldDocument
      });

      const attributeExtrinsic = api.tx?.['peaqDid']?.['updateAttribute'](
        accountAddress,
        name,
        didDocument,
        null
      );

      const nonce = await this._getNonce(keyPair.address);
      const eventData = await this._newSignTx({ nonce, address: keyPair, extrinsics: attributeExtrinsic });
      const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
          statusCallback(result as unknown as ISubmittableResult);
      });

      return {
        log: `Successfully updated the DID Document of name ${name} at address ${accountAddress}`,
        hash: eventData[0]?.blockHash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
      throw new UpdateDidError(`${error}`);
    }
  }

  // TODO add custom errors
  public async remove(options: RemoveDidOptions,
    statusCallback?: (result: ISubmittableResult) => void | Promise<void>
  ): Promise<RemoveDidResult | null> {
    try {
      const api = this._getApi();

      const { name, address = '', seed = '' } = options;

      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || this._metadata?.pair?.address;

      if (!name) throw new Error('Name is required');
      if (!accountAddress) throw new Error('Address is required');

      const readDocument = await this.read({name: name, address: accountAddress});
      if (!readDocument) throw new Error(`DID Document of name ${name} for the account address ${accountAddress} was not found.`);

      const attributeExtrinsic = api.tx?.['peaqDid']?.['removeAttribute'](
        accountAddress,
        name
      );

      const nonce = await this._getNonce(keyPair.address);
      const eventData = await this._newSignTx({ nonce, address: keyPair, extrinsics: attributeExtrinsic });
      // await attributeExtrinsic.signAsync(keyPair, { nonce });
      const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
          statusCallback(result as unknown as ISubmittableResult);
      });
      
      return {
        log: `Successfully removed the DID of name ${name} from address ${accountAddress}`,
        hash: eventData[0]?.blockHash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
      throw new RemoveDidError(`Remove DID ${error}`);
    }
  }

  private _getDidId(address: Address, prefix: string): string {
    if (prefix == ''){
      return `did:peaq:${address}`;
    }
    return `did:${prefix}:${address}`;
  }

  private _createVerificationMethod(verification: Verification, address: Address, prefix: string, keyNum: number) {
    const verificationMethod = new peaqDidProto.VerificationMethod();
    const id = this._getDidId(address.toString(), prefix);

    verificationMethod.setId(id);

    if (verification.type !== peaqDidProto.VerificationType.ED25519VERIFICATIONKEY2020 &&
      verification.type !== peaqDidProto.VerificationType.SR25519VERIFICATIONKEY2020) {
      throw new Error('Invalid type: Type must be either 0: ED25519VERIFICATIONKEY2020 or 1: SR25519VERIFICATIONKEY2020');
    }

    verificationMethod.setType(verification.type);
    verificationMethod.setController(this._getDidId(address, prefix));

    // generate & set public key multibase
    const publicKey = decodeAddress(address, false, 42)
    const publicKeyHex = u8aToHex(publicKey);
    const publicKeyMultibase = publicKeyHex.replace(/^0x/, '');
    verificationMethod.setPublickeymultibase(publicKeyMultibase);

    return { verificationMethod, verificationId: id };
  }

  private _createSignature(signature: Signature) {
    if (!Object.values(peaqDidProto.VerificationType).includes(signature.type)) throw new Error('Signature Type is required');
    if (!signature.issuer) throw new Error('Signature Issuer is required');
    if (!signature.hash) throw new Error('Signature Hash is required');

    const signatureMethod = new peaqDidProto.Signature();

    signatureMethod.setType(signature.type);
    signatureMethod.setIssuer(signature.issuer);
    signatureMethod.setHash(signature.hash);

    return signatureMethod;
  }

  private _createService(service: Service) {
    if (!service.id) throw new Error('Service ID is required');
    if (!service.type) throw new Error('Service type is required');
    if (!(service.serviceEndpoint) && !(service.data))
      throw new Error(
        'Either service endpoint or data is required for service'
      );

    const documentService = new peaqDidProto.Service();

    documentService.setId(service.id);
    documentService.setType(service.type);
    if (service.serviceEndpoint) {
      documentService.setServiceendpoint(service.serviceEndpoint);
    }

    if (service.data) {
      documentService.setData(service.data);
    }
    return documentService;
  }

  private _createDidDocument(options: DidDocumentOptions): `0x${string}` {
    const { didAccountAddress, didControllerAddress, customDocumentFields } = options;

    const document = new peaqDidProto.Document();

    if (customDocumentFields?.prefix){
      this._prefix = customDocumentFields?.prefix;
    }
    else { // default to peaq prefix after did: if user doesn't manually set
      this._prefix = 'peaq';
    }

    document.setId(this._getDidId(didAccountAddress.toString(), this._prefix));
    document.setController(this._getDidId(didControllerAddress.toString(), this._prefix));


    if (customDocumentFields?.verifications) {
      let keyNum = 1;
      customDocumentFields.verifications.forEach((verification) => {
        const { verificationId, verificationMethod } = this._createVerificationMethod(verification, didAccountAddress.toString(), this._prefix as string, keyNum);
        document.addVerificationmethods(verificationMethod);
        document.addAuthentications(verificationId);
        keyNum += 1;
      });
    }

    if (customDocumentFields?.signature) {
        const signature = customDocumentFields?.signature;
        const documentSignature = this._createSignature(signature);
        document.setSignature(documentSignature);
    }

    if (customDocumentFields?.services) {
      customDocumentFields.services.forEach((service) => {
        const documentService = this._createService(service);
        document.addServices(documentService);
      });
    }

    const bytes = document.serializeBinary();
    return u8aToHex(bytes);
  }

  private _updateDidDocument(options: UpdateDidDocumentOptions): `0x${string}` {
    const { didAccountAddress, didControllerAddress, customDocumentFields, oldDocument } = options;
    
    const new_document = new peaqDidProto.Document();

    const old_id = oldDocument.id;
    const idParts = old_id.split(':');

    // if there is a prefix change id to include that prefix
    if (customDocumentFields?.prefix){
      // only allows the change if current prefix matches what was set beforehand
      if (idParts.length === 3 && idParts[1] === this._prefix) {
        this._prefix = customDocumentFields?.prefix;
        const new_id = `did:${this._prefix}:${idParts[2]}`;
        new_document.setId(new_id);
      }
    }
    else { // default to previous prefix after did: if user doesn't manually set
      new_document.setId(oldDocument.id);
      this._prefix = idParts[1];
    }


    // set old controller if not present
    if (customDocumentFields?.controller) {
      // TODO is there a check to make sure they can change controller?
      // if the read public metadata key and the old_document controller match, then you are able to change the controller

      let controller = customDocumentFields?.controller;
      controller = `did:${this._prefix}:${controller}`;

      const regex = /^did:[^:]+:5[1-9A-HJ-NP-Za-km-z]{47}$/; // regex would need to change if we update to use ethereum keyrings as well
      if(!regex.test(controller)) {
        throw new Error('Incorrect controller format. Make sure to set prefix in customDocumentFields.');
      }
      new_document.setController(controller);
    }
    else  {
      // if the prefix has been changed update the controller to reflect it
      const old_controller = oldDocument.controller;
      const controllerParts = old_controller.split(':');
      if (this._prefix !== controllerParts[1]) {
        new_document.setController(`did:${this._prefix}:${controllerParts[2]}`);
      }
      else {
        new_document.setController(oldDocument.controller);
      }
    }

    if (customDocumentFields?.verifications) {
      customDocumentFields.verifications.forEach((verification) => {
        let keyNum = 1; 
        const { verificationId, verificationMethod } = this._createVerificationMethod(verification, didAccountAddress.toString(), this._prefix as string, keyNum);
        new_document.addVerificationmethods(verificationMethod);
        new_document.addAuthentications(verificationId);
        keyNum += 1;
      })
    }

    if (customDocumentFields?.signature) {
      const signature = customDocumentFields?.signature;
      const documentSignature = this._createSignature(signature);
      new_document.setSignature(documentSignature);
    }

    if (customDocumentFields?.services) {
        customDocumentFields.services.forEach((service) => {
          const documentService = this._createService(service);
          new_document.addServices(documentService);
      });
    }

    const bytes = new_document.serializeBinary();
    return u8aToHex(bytes);
  }

  private _checkSeed(seed: string){
    const words = seed.trim().split(/\s+/);

    // Check if the length is either 12 or 24
    if (words.length !== 12 && words.length !== 24) {
      throw new SeedError('Invalid seed phrase length: Seed phrase must be either 12 or 24 words long.');
    }
  }

  private _checkAddress(accountAddress: Address) {
    if (!accountAddress) throw new AddressError('Address is required');
    const regex = /^[1-9A-HJ-NP-Za-km-z]{48}$/; // regex used to check address format
    if(!regex.test(accountAddress as string)) throw new AddressError('Incorrect SS58 Address format. Given address does not match expected length or contains an invalid char. SS58 address are 58 char in length with 0, O, I & l omitted.');
  }
}