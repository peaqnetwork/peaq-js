import * as peaqDidProto from 'peaq-did-proto-js';
import { Attribute } from '@peaq-network/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { v4 as uuidv4 } from 'uuid';

import { createStorageKeys } from '../../utils';
import type { Address, ReadDidResponse, SDKMetadata, SignTransction } from '../../types';
import { CreateStorageKeysEnum } from '../../types';
import { Base } from '../base';

export interface CustomDocumentFields {
  services: DocumentService[];
}

type DocumentService = {
  id: string;
  type: string;
} & (
  | {
      serviceEndpoint: string;
    }
  | {
      data: string;
    }
);

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
  customDocumentFields: CustomDocumentFields;
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
  log?: string,
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

      const { name, address = '', seed = '', customDocumentFields } = options;

      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const accountAddress = address || keyPair.address;

      if (!name) throw new Error('Name is required');
      if (!accountAddress) throw new Error('Address is required');

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

  // TODO create requirements so that the DID Document is updated correctly based on the peaq-did-proto
  // - read to make sure there is one?
  // - how to confirm the previous verifications if they add a new one
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

      
      // TODO: read did to get back did document to add new data to
      // - discuss how to properly update and implement
      const did_document = await this.read({name, address});

      // do I need to create a new one or update the old one??
      // can call the _updateDidDocument() function below -> not started, need to decide best practices
      const didDocument = this._createDidDocument({
        didAccountAddress: accountAddress,
        didControllerAddress: keyPair.address,
        customDocumentFields,
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

  private _getDidId(address: Address): string {
    return `did:peaq:${address}`;
  }

  private _createVerificationMethod(address: Address) {
    const id = uuidv4();
    const verificationMethod = new peaqDidProto.VerificationMethod();

    verificationMethod.setId(id);
    verificationMethod.setType(
      peaqDidProto.VerificationType.ED25519VERIFICATIONKEY2020
    );
    verificationMethod.setController(this._getDidId(address));
    verificationMethod.setPublickeymultibase(`z${address}`);

    return { verificationMethod, verificationId: id };
  }

  private _createService(service: DocumentService) {
    if (!service.id) throw new Error('Service ID is required');
    if (!service.type) throw new Error('Service type is required');
    if (!('serviceEndpoint' in service) && !('data' in service))
      throw new Error(
        'Either service endpoint or data is required for service'
      );

    const documentService = new peaqDidProto.Service();

    documentService.setId(service.id);
    documentService.setType(service.type);

    if ('serviceEndpoint' in service) {
      documentService.setServiceendpoint(service.serviceEndpoint);
    }

    if ('data' in service) {
      documentService.setData(service.data);
    }

    return documentService;
  }

  private _createDidDocument(options: DidDocumentOptions): `0x${string}` {
    const document = new peaqDidProto.Document();

    document.setId(this._getDidId(options.didAccountAddress.toString()));
    document.setController(
      this._getDidId(options.didControllerAddress.toString())
    );

    const { verificationId, verificationMethod } =
      this._createVerificationMethod(options.didAccountAddress.toString());

    document.addVerificationmethods(verificationMethod);

    document.addAuthentications(verificationId);

    if (options.customDocumentFields?.services) {
      options.customDocumentFields.services.forEach((service) => {
        const documentService = this._createService(service);
        document.addServices(documentService);
      });
    }

    const bytes = document.serializeBinary();
    return u8aToHex(bytes);
  }

  // in my update function I am calling _createDidDocument. Need to have conversations to see what is best.
  private _updateDidDocument(options: UpdateDidOptions): `0x${string}` {
    // add checks here

    // const { verificationId, verificationMethod } =
    // this._updateVerificationMethod(options.didAccountAddress.toString());

    return u8aToHex();
  }
}