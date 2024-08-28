declare module 'peaq-did-proto-js' {

  export enum VerificationType {
    ED25519VERIFICATIONKEY2020 = 0, 
    SR25519VERIFICATIONKEY2020 = 1
  }

  export class VerificationMethod {

    constructor(data?: any);

    getId(): string;
    setId(value: string): this;

    getType(): string;
    setType(value: string): this;

    getController(): string;
    setController(value: string): this;

    getPublicKeyMultibase(): string;
    setPublicKeyMultibase(value: string): this;

    serializeBinary(): Uint8Array;
    static deserializeBinary(bytes: Uint8Array): VerificationMethod;
    static deserializeBinaryFromReader(message: VerificationMethod, reader: any): VerificationMethod;
    toObject(includeInstance?: boolean): object;

  }

  export class Signature {

    constructor(data?: any);

    getType(): string;
    setType(value: string): this;

    getIssuer(): string;
    setIssuer(value: string): this;

    getHash(): string;
    setHash(value: string): this;

    serializeBinary(): Uint8Array;
    static deserializeBinary(bytes: Uint8Array): Signature;
    static deserializeBinaryFromReader(message: Signature, reader: any): Signature;
    toObject(includeInstance?: boolean): object;

  }

  export class Service {

    constructor(data?: any);

    getId(): string;
    setId(value: string): this;

    getType(): string;
    setType(value: string): this;

    getServiceEndpoint(): string;
    setServiceEndpoint(value: string): this;


    getData(): string;
    setData(value: string): this;

    serializeBinary(): Uint8Array;
    static deserializeBinary(bytes: Uint8Array): Service;
    static deserializeBinaryFromReader(message: Service, reader: any): Service;
    toObject(includeInstance?: boolean): object;
  }

  export class Document {

    constructor(data?: any);

    getId(): string;
    setId(value: string): this;

    getController(): string;
    setController(value: string): this;

    getVerificationMethods(): VerificationMethod[];
    setVerificationMethods(value: VerificationMethod[]): this;
    addVerificationMethods(value?: VerificationMethod, index?: number): VerificationMethod;
    clearVerificationMethods(): this;

    getSignature(): Signature | undefined;
    setSignature(value?: Signature): this;
    hasSignature(): boolean;
    clearSignature(): this;

    getServices(): Service[];
    setServices(value: Service[]): this;
    addServices(value?: Service, index?: number): Service;
    clearServices(): this;

    getAuthentications(): string[];
    setAuthentications(value: string[]): this;
    addAuthentications(value: string, index?: number): this;
    clearAuthentications(): this;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): object;

    static deserializeBinary(bytes: Uint8Array): Document;
    static deserializeBinaryFromReader(message: Document, reader: any): Document;
    static toObject(includeInstance: boolean, msg: Document): object;

  }

  export function deserializeBinary(bytes: Uint8Array): Document;

}