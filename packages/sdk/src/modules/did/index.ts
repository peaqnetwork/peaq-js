import * as peaqDidProto from 'peaq-did-proto-js';
import { Attribute } from '@peaq-network/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { v4 as uuidv4 } from 'uuid';

import { createStorageKeys } from '../../utils';
import type { Address, ReadDidResponse, SDKMetadata, SignTransction } from '../../types';
import { CreateStorageKeysEnum, DidDocument } from '../../types';
import { Base } from '../base';

export interface CustomDocumentFields {
  verifications?: Verification[],
  signature?: Signature,
  services?: Service[];
}

export interface UpdateDocumentFields {
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
  prefix?: string;
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
  prefix?: string
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
  prefix?: string;
  customDocumentFields?: CustomDocumentFields;
}

export class Did extends Base {
  constructor(
    protected override readonly _api?: ApiPromise,
    protected readonly _metadata?: SDKMetadata
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

      const { name, address = '', seed = '', prefix = '', customDocumentFields } = options;

      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || keyPair.address;

      if (!name) throw new Error('Name is required');
      if (!accountAddress) throw new Error('Address is required');

      const didDocument = this._createDidDocument({
        didAccountAddress: accountAddress,
        didControllerAddress: keyPair.address,
        prefix: prefix,
        customDocumentFields,
      });

      const attributeExtrinsic = api.tx?.['peaqDid']?.['addAttribute'](
        accountAddress,
        name,
        didDocument,
        null
      );

      const nonce = await this._getNonce(keyPair.address);
      await this._newSignTx({nonce, address: keyPair, extrinsics: attributeExtrinsic});
      // await attributeExtrinsic.signAsync(keyPair, { nonce });
      const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
          statusCallback(result as unknown as ISubmittableResult);
      });

      return {
        hash: attributeExtrinsic.hash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
      throw new Error(`Error creating DID: ${error}`);
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

      const { name, address } = options;
      const accountAddress = address || this._metadata?.pair?.address;

      if (!name) throw new Error('Name is required');
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
      throw new Error(`Error reading DID attribute: ${error}`);
    }
  }

  public async update(options: UpdateDidOptions,
    statusCallback?: (result: ISubmittableResult) => void | Promise<void>
  ): Promise<UpdateDidResult | null> {
    try {
      const api = this._getApi();

      const { name, address = '', seed = '', customDocumentFields } = options;
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || keyPair.address;

      if (!name) throw new Error('Name is required');
      if (!accountAddress) throw new Error('Address is required');
      if (!customDocumentFields) throw new Error('DID Document fields must be configured before manually changing.');

      const readDocument = await this.read({name: name, address: accountAddress});
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
      await this._newSignTx({ nonce, address: keyPair, extrinsics: attributeExtrinsic });
      const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
          statusCallback(result as unknown as ISubmittableResult);
      });

      return {
        log: `Successfully updated the DID Document of name ${name} at address ${accountAddress}`,
        hash: attributeExtrinsic.hash as unknown as CodecHash,
        unsubscribe,
      };
    } catch (error) {
      throw new Error(`Update DID ${error}`);
    }
  }

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

      const attributeExtrinsic = api.tx?.['peaqDid']?.['removeAttribute'](
        accountAddress,
        name
      );

      const nonce = await this._getNonce(keyPair.address);
      await this._newSignTx({ nonce, address: keyPair, extrinsics: attributeExtrinsic });
      // await attributeExtrinsic.signAsync(keyPair, { nonce });
      const unsubscribe = await attributeExtrinsic.send((result) => {
        statusCallback &&
          statusCallback(result as unknown as ISubmittableResult);
      });
      
      return {
        log: `Successfully removed the DID of name ${name} from address ${accountAddress}`,
        hash: attributeExtrinsic.hash,
        unsubscribe,
      };
    } catch (error) {
      throw new Error(`Remove DID ${error}`);
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
    const { didAccountAddress, didControllerAddress, prefix = '', customDocumentFields } = options;

    const document = new peaqDidProto.Document();

    document.setId(this._getDidId(didAccountAddress.toString(), prefix));
    document.setController(this._getDidId(didControllerAddress.toString(), prefix));


    if (customDocumentFields?.verifications) {
      let keyNum = 1;
      customDocumentFields.verifications.forEach((verification) => {
        const { verificationId, verificationMethod } = this._createVerificationMethod(verification, didAccountAddress.toString(), prefix, keyNum);
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
    const { didAccountAddress, didControllerAddress, prefix = '', customDocumentFields, oldDocument } = options;
    
    const new_document = new peaqDidProto.Document();
    new_document.setId(oldDocument.id);

    // set old controller if not present
    if (customDocumentFields?.controller) {
      // TODO is there a check to make sure they can change controller?
      // if the read public metadata key and the old_document controller match, then you are able to change the controller

      const controller = customDocumentFields?.controller;

      const regex = /^did:[^:]+:5[1-9A-HJ-NP-Za-km-z]{47}$/; // regex would need to change if we update to use ethereum keyrings as well
      if(!regex.test(controller)) {
        throw new Error('Incorrect controller format. Must be in the form did:${prefix}:${OwnerAddress}');
      }
      new_document.setController(customDocumentFields?.controller);
    }
    else  {
      new_document.setController(oldDocument.controller);
    }

    if (customDocumentFields?.verifications) {
      customDocumentFields.verifications.forEach((verification) => {
        let keyNum = 1; 
        const { verificationId, verificationMethod } = this._createVerificationMethod(verification, didAccountAddress.toString(), prefix, keyNum);
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
}