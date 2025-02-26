import { ApiPromise, WsProvider } from '@polkadot/api';
import { mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import { defaultOptions } from '@peaq-network/types';

import { unsubscribeRuntimeVersion } from '../../utils';
import { ChainType, type CreateInstanceOptions, type SDKMetadata, type SendEvmTx } from '../../types';

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
  private readonly _options: CreateInstanceOptions;
  protected override _api: ApiPromise | undefined;
  private _metadata: SDKMetadata;

  public did: Did;
  public rbac: RBAC;
  public storage: Storage;
  private ptp: Ptp;

  constructor(options: CreateInstanceOptions) {
    super();
    this._options = options;
    this._metadata = {
      "baseUrl": options.baseUrl, 
      "chainType": options.chainType
    };
    
    this._api = this._createApi();
    
    this.did = new Did(this._api, this._metadata);
    this.rbac = new RBAC(this._api, this._metadata);
    this.storage = new Storage(this._api, this._metadata);
    this.ptp = new Ptp();
  }

  /**
   * Creates a new instance of the SDK and connects to the network.
   *
   * @param CreateInstanceOptions - Options for the SDK with fields:
   *    @param chainType - Used to differentiate between Substrate and EVM txs.
   *    @param baseUrl - RPC url that the API will be connected to.
   *    @param seed - Private key that will sign the transaction.
   * @returns sdk - The SDK built with executable class functions.  
   */
  public static async createInstance(options: CreateInstanceOptions): Promise<Main> {
    await cryptoWaitReady();
    const sdk = new Main(options);
    await sdk.connect();
    return sdk;
  }

  /**
   * Generates a hash of the DID Document without connecting to the chain.
   * @param GenerateDidOptions - The options for generating a DID:
   *    @param address - User address used to construct DID Document.
   *    @param customDocumentFields - Fields that will populate the DID Document.
   *    @param update - Indicates whether you want to build an upgraded DID Document.
   * @returns The hash value of the generated DID document to be stored on chain.
   */
  public static async generateDidDocument(
    options: GenerateDidOptions
  ): Promise<GenerateDidResult> {
    const did = new Did();
    return did.generate(options);
  }

  /**
   * Connects the SDK to the network. 
   * If chainType is EVM no connection is established.
   */
  public async connect(): Promise<void> {
    try {
      // can skip if evm set
      if (this._metadata.chainType == ChainType.EVM) {
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

  /**
   * Checks the seed passed when connecting Substrate.
   */
  private _validateOptions(): void {
    const { seed = '' } = this._options;
    if (seed) {
      const isSeedValid = mnemonicValidate(seed);
      if (!isSeedValid) throw new Error('Invalid seed');
    }
  }

  /**
   * Sets the KeyPair in a metadata object so it can be later
   * to send transactions on behalf of the user.
   */
  private _setMetadata(): void {
    const { seed = '' } = this._options;
    if (seed) {
      const pair = this._getKeyPair(seed);
      this._metadata.pair = pair;
    }
  }

  /**
   * Creates a new instance of the peaq's native Polkadot API connection.
   * @returns undefined - When EVM is set, there is no API connection initialized.
   * @returns ApiPromise - Instance of the Substrate wss connection.
   */
  private _createApi(): ApiPromise | undefined {
      if (this._metadata.chainType == ChainType.EVM) {
        if (!this._metadata.baseUrl.startsWith("https://")) {
          throw new Error(
            `Invalid base URL for EVM interactions: ${this._metadata.baseUrl}. It must start with 'https://'.`
            )}
        if (this._options.seed) {
          throw new Error("Construction of EVM txs does not require seed. Use the sendEvmTx() to send a transaction on chain or send manually.")
        }
        return undefined
        }
  
      // Sets up a substrate api connection if chain_id is set or undefined (defaults to this)
      else if (this._metadata.chainType == ChainType.SUBSTRATE || this._metadata.chainType == undefined ) {
        if (!this._metadata.baseUrl.startsWith("wss://")) {
          throw new Error(
            `Invalid base URL for Substrate interactions: ${this._metadata.baseUrl}. It must start with 'wss://'.`
            )}

        const provider = new WsProvider(this._metadata.baseUrl);
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

  /**
   * Send an EVM transaction on behalf of the user using their funded seed.
   * @param SendEvmTx - Object with the parameters:
   *    @param tx - EVM tx object that will be sent to chain.
   *    @param chainType - Guarantees user knows they are sending an EVM-like tx.
   *    @param baseUrl - RPC url that the tx will be sent to.
   *    @param seed - Private key that will sign the transaction.
   * @returns The receipt of the transaction.
   */
  public static async sendEvmTx(options: SendEvmTx) {
    try {
      let provider;
      if (options.baseUrl.startsWith('wss')) {
        throw new Error(`Invalid base URL for EVM interactions: ${options.baseUrl}. It must start with 'https://'.`);
      } else if (options.baseUrl.startsWith('https')) {
        // JsonRpcProvider for HTTPS URLs
        provider =  new ethers.JsonRpcProvider(options.baseUrl);
      } else {
        throw new Error(`Invalid base URL for EVM interactions: ${options.baseUrl}. It must start with 'https://'.`);
      }
      const signer = this._isEvmWalletInputValid(options.seed, provider);
      const response = await signer.sendTransaction(options.tx);
      const receipt = await response.wait().finally(); // TODO figure out why it is hanging right here.
      return receipt
      }
    // Basic error catching: TODO - create better object
  catch(error) {
    let errorMessage = "";

    // Narrow the error type: check if it's an object with a 'reason' property
    if (error && typeof error === 'object' && 'reason' in error) {
      errorMessage = (error as any).reason || "";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    const regex = /message:\s*Some\("([^"]+)"\)/;
    const match = errorMessage.match(regex);
    const extractedMessage = match ? match[1] : errorMessage;
  
    throw new Error(`Transaction reverted with error: ${extractedMessage}`);
    }
  }
/**
* Builds an EVM wallet for the user to send transactions.
* Allows for the wallet to be built with a private key or mnemonic phrase.
* @param key - Private key or seed phrase used to construct the wallet.
* @param provider - Ethers provider that establishes the sender's connection.
* @returns The new EVM wallet that will be used to send the tx.
*/
  private static _isEvmWalletInputValid(key: string, provider: ethers.Provider): ethers.Wallet | ethers.HDNodeWallet {
    try {
        // Try to create a wallet from the input (could be a private key or mnemonic)
         // For mnemonic
        return ethers.Wallet.fromPhrase(key, provider);
    } catch (error) {
        try {
             // For private key
            return new ethers.Wallet(key, provider);
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
