declare module 'peaq-did-proto-js' {
  interface DocumentWithToObject extends Document {
    toObject(): object;
  }

  export enum VerificationType {
    ED25519VERIFICATIONKEY2020 = 0,
    SR25519VERIFICATIONKEY2020 = 1,
  }

  export class VerificationMethod {
    setId(value: string): void;
    setType(value: VerificationType): void;
    setController(value: string): void;
    setPublickeymultibase(value: string): void;
  }

  export class Signature {
    setType(value: VerificationType): void;
    setIssuer(value: string): void;
    setHash(value: string): void;
  }

  export enum ServiceType {
    P2P = 0,
    PAYMENT = 1,
    METADATA = 2,
  }

  export enum Status {
    AVAILABLE = 0,
    UNAVAILABLE = 1,
  }

  export class Metadata {
    setName(value: string): void;
    setPower(value: string): void;
    setStatus(value: Status): void;
    setChargepointclientid(value: string): void;
    setConnectorscount(value: number): void;
    setPlugtype(value: string): void;
    setPriceperkwhr(value: number): void;
  }

  export class Service {
    setId(value: string): void;
    setType(value: ServiceType): void;
    setStringdata(value: string): void;
    setMetadata(value: Metadata): void;
    hasServiceendpoint(): boolean;
    clearServiceendpoint(): void;
  }

  export class Document implements DocumentWithToObject {
    setId(value: string): void;
    setController(value: string): void;
    addVerificationmethods(value: VerificationMethod, index?: number): void;
    setSignature(value: Signature): void;
    addServices(value: Service, index?: number): void;
    addAuthentications(value: string, index?: number): void;
    serializeBinary(): Uint8Array;
    static deserializeBinary(binary: Uint8Array): Document;
    toObject(): object;
  }
}
