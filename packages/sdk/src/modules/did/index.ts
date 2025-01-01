import * as peaqDidProto from 'peaq-did-proto-js';
import { Attribute } from '@peaq-network/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createStorageKeys } from '../../utils';
import { CreateDidError, NameError, SeedError, AddressError, ReadDidError, UpdateDidError, RemoveDidError, DidNotFoundError, NoCustomFieldsError} from '../../utils/errors';
import type { Address, ReadDidResponse, SDKMetadata, SignTransction } from '../../types';
import { CreateStorageKeysEnum, DidDocument } from '../../types';
import { Base } from '../base';

export interface CustomDocumentFields {
  prefix?: string,
  controller?: string,
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
  type: string;
  controller?: string;
  publicKeyMultibase?: string;
}

type Signature = {
  type: string;
  issuer: string;
  hash: string;
}

type Service = {
  id: string;
  type: string;
  serviceEndpoint?: string;
  data?: string;
}

export interface GenerateDidOptions {
  address: Address;
  customDocumentFields?: CustomDocumentFields;
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

export interface GenerateDidResult {
  value: string;
}

interface CreateDidResult {
  block_hash: CodecHash;
  unsubscribe: () => void;
}

interface RemoveDidResult {
  log?: string,
  block_hash: CodecHash;
  unsubscribe: () => void;
}

interface UpdateDidResult {
  log: string,
  block_hash: CodecHash;
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
   * Generates a new DID hash value by creating a DID document with the proto and converting u8a to hex.
   * 
   * @param options - The options for generating a DID.
   * @returns value - The hash value of the generated DID document.
   */
  public async generate(options: GenerateDidOptions): Promise<GenerateDidResult> {
    try {

      const { address = '', customDocumentFields } = options;
      if (address !== '') this._checkAddress(address);

      const accountAddress = address;

      const didDocumentHash = this._generateDidDocument({
        didAccountAddress: accountAddress,
        didControllerAddress: accountAddress,
        customDocumentFields,
      });

      return {
        value: didDocumentHash,
      };
    } catch (error) {
        throw new CreateDidError(`${error}`);
      }
  }

  /**
   * Creates a new DID by adding a new attribute to the PEAQ DID registry.
   * 
   * @param options - The options for creating the DID.
   * @returns CreateDidResult - Contains the block_hash of the executed transaction and unsubscribe() to terminate event listening.
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

      const didDocument = this._generateDidDocument({
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
        block_hash: eventData[0]?.blockHash as unknown as CodecHash,
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

      const didValue = String(did.toHuman()['value']);
      const document = peaqDidProto.Document.deserializeBinary(hexToU8a(didValue));

      return {
        ...did.toHuman(),
        document: document.toObject(),
      } as ReadDidResponse;
    } catch (error) {
      throw new ReadDidError(`${error}`);
    }
  }

  /**
   * Updates a previously created DID Document and overwrites the previously set data.
   * 
   * @param options: UpdateDidOptions = {address: Address, customDocumentFields?: CustomDocumentFields}
   * @returns UpdateDidResult - Contains log information, block_hash of the executed transaction and unsubscribe() to terminate event listening.
   */
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
        block_hash: eventData[0]?.blockHash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
      throw new UpdateDidError(`${error}`);
    }
  }

  
  /**
   * Removes a previously created DID Document.
   * 
   * @param options: UpdateDidOptions = {address: Address, customDocumentFields?: CustomDocumentFields}
   * @returns RemoveDidResult - Contains log information, block_hash of the executed transaction and unsubscribe() to terminate event listening.
   */
  public async remove(options: RemoveDidOptions,
    statusCallback?: (result: ISubmittableResult) => void | Promise<void>
  ): Promise<RemoveDidResult | null> {
    try {
      const api = this._getApi();

      const { name, address = '', seed = '' } = options;

      if (!name) throw new NameError('Name is required when removing a DID.');
      if (seed !== '') this._checkSeed(seed);
      if (address !== '') this._checkAddress(address);

      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || this._metadata?.pair?.address;

      if (!accountAddress) throw new AddressError('Address is required');

      const readDocument = await this.read({name: name, address: accountAddress});
      if (!readDocument) throw new DidNotFoundError(`DID Document of name ${name} for the account address ${accountAddress} was not found.`);

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
        block_hash: eventData[0]?.blockHash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
      throw new RemoveDidError(`${error}`);
    }
  }

  private _getDidId(address: Address, prefix: string): string {
    if (prefix == ''){
      return `did:peaq:${address}`;
    }
    return `did:${prefix}:${address}`;
  }

  private _createVerificationMethod(verification: Verification, didAccountAddress: Address, didControllerAddress: string, prefix: string, keyCounter: number) {
    const verificationMethod = new peaqDidProto.VerificationMethod();
    let id = this._getDidId(didAccountAddress.toString(), prefix);
    id = `${id}#keys-${keyCounter}`;

    verificationMethod.setId(id);

    if (verification.type == "Ed25519VerificationKey2020"){
      verificationMethod.setType("Ed25519VerificationKey2020");
    }
    else if (verification.type == "Sr25519VerificationKey2020") {
      verificationMethod.setType("Sr25519VerificationKey2020");
    }
    else {
      throw new Error('Invalid type: Type must be either Ed25519VerificationKey2020 or Sr25519VerificationKey2020');
    }

    verificationMethod.setController(didControllerAddress as string);

    if (verification?.publicKeyMultibase) {
      verificationMethod.setPublicKeyMultibase(verification?.publicKeyMultibase);
    }
    else {
      // generate & set public key multibase BASED ON the didAccountAddress?? -> MAY NEED TO CHANGE TO CONTROLLER??
      const publicKey = decodeAddress(didAccountAddress, false, 42)
      const publicKeyHex = u8aToHex(publicKey);
      const publicKeyMultibase = publicKeyHex.replace(/^0x/, '');
      verificationMethod.setPublicKeyMultibase(publicKeyMultibase);
    }


    return { verificationMethod, verificationId: id };
  }

  private _createSignature(signature: Signature) {
    if (!["Ed25519VerificationKey2020", "Sr25519VerificationKey2020"].includes(signature.type)) {
      throw new Error('Signature Type must be "Ed25519VerificationKey2020" or "Sr25519VerificationKey2020"');
  }
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
      documentService.setServiceEndpoint(service.serviceEndpoint);
    }
    if (service.data) {
      documentService.setData(service.data);
    }
    return documentService;
  }

 private _generateDidDocument(options: DidDocumentOptions): string {
    const { didAccountAddress, didControllerAddress, customDocumentFields } = options;

    let document = new peaqDidProto.Document();

    if (customDocumentFields?.prefix){
      this._prefix = customDocumentFields?.prefix;
    }
    else { // default to peaq prefix after did: if user doesn't manually set
      this._prefix = 'peaq';
    }

    // set id
    document.setId(this._getDidId(didAccountAddress.toString(), this._prefix));

    // set controller if present in customDocumentFields
    if (customDocumentFields?.controller){
      document = this._setController(customDocumentFields, document);
    }
    else { // default set controller
      document.setController(this._getDidId(didControllerAddress.toString(), this._prefix));
    }


    if (customDocumentFields?.verifications) {
      customDocumentFields.verifications.forEach((verification) => {
        let keyCounter = 1;
        const { verificationId, verificationMethod } = this._createVerificationMethod(verification, didAccountAddress.toString(), document.getController(), this._prefix as string, keyCounter);
        document.addVerificationMethods(verificationMethod);
        document.addAuthentications(verificationId);
        keyCounter += 1;
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
    const hexString = u8aToHex(bytes);

    // remove '0x' prefix if present
    const hash = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    return hash;
  }

  private _updateDidDocument(options: UpdateDidDocumentOptions): string {
    const { didAccountAddress, didControllerAddress, customDocumentFields, oldDocument } = options;
    
    let newDocument = new peaqDidProto.Document();

    const oldId = oldDocument.id;
    const idParts = oldId.split(':');

    // if there is a prefix change id to include that prefix
    if (customDocumentFields?.prefix){
      // only allows the change if current prefix matches what was set beforehand
      if (idParts.length === 3 && idParts[1] === this._prefix) {
        this._prefix = customDocumentFields?.prefix;
        const new_id = `did:${this._prefix}:${idParts[2]}`;
        newDocument.setId(new_id);
      }
    }
    else { // default to previous prefix after did: if user doesn't manually set
      newDocument.setId(oldDocument.id);
      this._prefix = idParts[1];
    }

    if (customDocumentFields?.controller) {
      newDocument = this._setController(customDocumentFields, newDocument);
    }
    else  {
      const oldController = oldDocument.controller;
      const controllerParts = oldController.split(':');
      // if the prefix has been changed update the controller to reflect it
      if (this._prefix !== controllerParts[1]) {
        newDocument.setController(`did:${this._prefix}:${controllerParts[2]}`);
      }
      else {
        newDocument.setController(oldDocument.controller);
      }
  }

    if (customDocumentFields?.verifications) {
      customDocumentFields.verifications.forEach((verification) => {
        let keyCounter = 1;
        const { verificationId, verificationMethod } = this._createVerificationMethod(verification, didAccountAddress.toString(), newDocument.getController(), this._prefix as string, keyCounter);
        newDocument.addVerificationMethods(verificationMethod);
        newDocument.addAuthentications(verificationId);
        keyCounter += 1;
      })
    }

    if (customDocumentFields?.signature) {
      const signature = customDocumentFields?.signature;
      const documentSignature = this._createSignature(signature);
      newDocument.setSignature(documentSignature);
    }

    if (customDocumentFields?.services) {
        customDocumentFields.services.forEach((service) => {
          const documentService = this._createService(service);
          newDocument.addServices(documentService);
      });
    }

    const bytes = newDocument.serializeBinary();
    const hexString = u8aToHex(bytes);

    // remove '0x' prefix if present
    const hash = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    return hash;
  }

  private _setController(customDocumentFields: UpdateDocumentFields, newDocument: peaqDidProto.Document){
      const controllerHold = customDocumentFields?.controller;
      const controller = `did:${this._prefix}:${controllerHold}`;

      const regexSS58 = /^did:[^:]+:5[1-9A-HJ-NP-Za-km-z]{47}$/;
      const regexETH = /^did:[^:]+:0x[a-fA-F0-9]{40}$/;
      if(!regexSS58.test(controller as string) && !regexETH.test(controller as string)) {
        throw new Error('Incorrect controller format. Make sure to set prefix and controller in customDocumentFields. Controller must either be a SS58 or Ethereum Address');
      }
      newDocument.setController(controller);
      return newDocument;
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
    const regexSS58 = /^[1-9A-HJ-NP-Za-km-z]{48}$/; // regex for ss58
    const regexETH = /^0x[a-fA-F0-9]{40}$/;         // regex for Ethereum
    if(!regexSS58.test(accountAddress as string) && !regexETH.test(accountAddress as string)){
      throw new AddressError(`Incorrect Substrate SS58/Ethereum Address format. Given address does not match expected length or contains an invalid char. 
        SS58 address are 58 char in length with 0, O, I & l omitted. Ethereum addresses are 42 characters in length, starting with "0x" followed by 
        40 hexadecimal characters (0-9, a-f, A-F) with no characters omitted.`);
    }
  }
}