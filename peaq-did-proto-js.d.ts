declare module 'peaq-did-proto-js' {

  export enum VerificationType {
    ED25519VERIFICATIONKEY2020 = 0, 
    SR25519VERIFICATIONKEY2020 = 1
  }

  export class VerificationMethod {

    constructor(data?: any);

    getId(): string;
    setId(value: string): this;

    getType(): VerificationType;
    setType(value: VerificationType): this;

    getController(): string;
    setController(value: string): this;

    getPublickeymultibase(): string;
    setPublickeymultibase(value: string): this;

    serializeBinary(): Uint8Array;
    static deserializeBinary(bytes: Uint8Array): VerificationMethod;
    static deserializeBinaryFromReader(message: VerificationMethod, reader: any): VerificationMethod;
    toObject(includeInstance?: boolean): object;

  }

  export class Signature {

    constructor(data?: any);

    getType(): VerificationType;
    setType(value: VerificationType): this;

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

    getServiceendpoint(): string;
    setServiceendpoint(value: string): this;

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

    getVerificationmethodsList(): VerificationMethod[];
    setVerificationmethodsList(value: VerificationMethod[]): this;
    addVerificationmethods(value?: VerificationMethod, index?: number): VerificationMethod;
    clearVerificationmethodsList(): this;

    getSignature(): Signature | undefined;
    setSignature(value?: Signature): this;
    hasSignature(): boolean;
    clearSignature(): this;

    getServicesList(): Service[];
    setServicesList(value: Service[]): this;
    addServices(value?: Service, index?: number): Service;
    clearServicesList(): this;

    getAuthenticationsList(): string[];
    setAuthenticationsList(value: string[]): this;
    addAuthentications(value: string, index?: number): this;
    clearAuthenticationsList(): this;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): object;

    static deserializeBinary(bytes: Uint8Array): Document;
    static deserializeBinaryFromReader(message: Document, reader: any): Document;
    static toObject(includeInstance: boolean, msg: Document): object;

  }

  export function deserializeBinary(bytes: Uint8Array): Document;

}