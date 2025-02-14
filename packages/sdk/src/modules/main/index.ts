import { ApiPromise, WsProvider } from '@polkadot/api';
import { mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import { defaultOptions } from '@peaq-network/types';

import { unsubscribeRuntimeVersion } from '../../utils';
import type { Options, SDKMetadata, SendEvmTx } from '../../types';

import { Base } from '../base';
import { GenerateDidOptions, GenerateDidResult, Did } from '../did';
import { RBAC } from '../rbac';
import { Storage } from '../storage';
import { Ptp, PtpOptions, type SyncResult } from '../ptp';

import { ethers } from 'ethers';

/**
 * Main class for interacting with the SDK.
 */
export class Main extends Base {
  private readonly _options: Options;
  protected override _api: ApiPromise | undefined;
  private _metadata: SDKMetadata;

  public did: Did;
  public rbac: RBAC;
  public storage: Storage;
  private ptp: Ptp;

  constructor(options: Options) {
    super();
    this._options = options;
    this._api = this._createApi(options);
    this._metadata = {
      "baseUrl": options.baseUrl, 
      "chainType": options.chainType?.toUpperCase()};

    this.did = new Did(this._api, this._metadata);
    this.rbac = new RBAC(this._api, this._metadata);
    this.storage = new Storage(this._api, this._metadata);
    this.ptp = new Ptp();
  }

  /**
   * Creates a new instance of the SDK and connects to the network.
   *
   * @param options - Options for the SDK.
   * @returns The created instance of the SDK.
   */
  public static async createInstance(options: Options): Promise<Main> {
    await cryptoWaitReady();
    const sdk = new Main(options);
    await sdk.connect();
    return sdk;
  }

  /**
   * Generates a hash of the DID Document without connecting to the chain.
   *
   * @param GenerateDidOptions - The options for generating a DID.
   * @returns The hash value of the generated DID document
   */
  public static async generateDidDocument(
    options: GenerateDidOptions
  ): Promise<GenerateDidResult> {
    const did = new Did();
    return did.generate(options);
  }

  /**
   * Connects the SDK to the network.
   */
  public async connect(): Promise<void> {
    try {
      // can skip if evm set
      if (this._metadata.chainType == "EVM") {
        return
      }
      if (!this._api) return;

      await this._api.isReadyOrError;
      this._validateOptions();
      this._setMetadata();

      !this._api.isConnected && (await this._api.connect());
    } catch (e) {
      throw new Error(`Connection error: ${e}`);
    }
  }

  /**
   * Disconnects the SDK from the network.
   */
  public async disconnect(): Promise<void> {
    try {
      if (this._api && this._api.isConnected) {
        await unsubscribeRuntimeVersion(this._api);
        await this._api.disconnect();
      }
    } catch (e) {
      throw new Error(`Disconnection error: ${e}`);
    }
  }

  private _validateOptions(): void {
    const { seed = '' } = this._options;
    if (seed) {
      const isSeedValid = mnemonicValidate(seed);
      if (!isSeedValid) throw new Error('Invalid seed');
    }
  }

  private _setMetadata(): void {
    const { seed = '' } = this._options;
    if (seed) {
      const pair = this._getKeyPair(seed);
      this._metadata.pair = pair;
    }
  }

  /**
   * Creates a new instance of the Polkadot API.
   *
   * @param options - Options for the API.
   * @returns The created instance of the API.
   */
  private _createApi(options: Options): ApiPromise | undefined{
    // do not create an api for evm transactions. We only construct the tx. Send option to be added later.
    if (this._metadata.chainType == "EVM") {
      return undefined
    }
    // Sets up a substrate api connection if chain_id is set or undefined (defaults to this)
    else if (this._metadata.chainType == "SUBSTRATE" || this._metadata.chainType == undefined ) {
      const { baseUrl } = options || this._options;
      const provider = new WsProvider(baseUrl);
      return new ApiPromise({
        provider,
        noInitWarn: true,
        ...defaultOptions,
      });
    }
    else {
      throw new Error("Chain Type not recognized. Please set to either 'evm' or 'substrate' based on what environment you are trying to connect to. No chainType set defaults to substrate.")
    }
  }

  // allows user to send an evm tx to peaq chain if they provide their key.
  public static async sendEvmTx(options: SendEvmTx) {
    let provider;
    if (options.chainType.toLocaleUpperCase() == "EVM"){
      if (options.baseUrl.startsWith('wss')) {
        // WebSocketProvider for WebSocket URLs
        provider =  new ethers.WebSocketProvider(options.baseUrl);
      } else if (options.baseUrl.startsWith('https')) {
        // JsonRpcProvider for HTTPS URLs
        provider =  new ethers.JsonRpcProvider(options.baseUrl);
      } else {
        throw new Error('Unsupported protocol in baseUrl. Only "wss" and "https" are supported.');
      }
      const signer = this._isEvmWalletInputValid(options.seed, provider);
      const response = await signer.sendTransaction(options.tx);
      const receipt = await response.wait(); // TODO figure out why it is hanging right here.
      return receipt
    }
    else{
      throw new Error(`Chain type of ${options.chainType} is not supported when trying to send EVM transactions`)
    }
  }

  private static _isEvmWalletInputValid(key: string, provider: ethers.Provider): ethers.Wallet | ethers.HDNodeWallet {
    try {
        // Try to create a wallet from the input (could be a private key or mnemonic)
         // For mnemonic
        return ethers.Wallet.fromPhrase(key, provider);
    } catch (error) {
        try {
             // For private key
            return new ethers.Wallet(key, provider);;
        } catch (error) {
            throw new Error("Input is neither a valid mnemonic nor a private key");
        }
    }
}

  /**
   * Subscribes to PTP time synchronization updates
   * @param options - PTP configuration options
   * @param callback - Function to handle synchronization updates
   * @returns Unsubscribe function
   */
  public static subscribeToPtp(
    options: PtpOptions,
    callback: (result: SyncResult) => void
  ): () => void {
    const ptp = new Ptp();
    return ptp.subscribe(options, callback);
  }
}
