import { ApiPromise, WsProvider } from '@polkadot/api';
import { mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import { defaultOptions } from '@peaq-network/types';

import { unsubscribeRuntimeVersion } from '../../utils';
import type { Options, SDKMetadata } from '../../types';

import { Base } from '../base';
import { Did } from '../did';
import { RBAC } from "../rbac";

/**
 * Main class for interacting with the SDK.
 */
export class Main extends Base {
  private readonly _options: Options;
  protected override _api: ApiPromise;
  private _metadata: SDKMetadata;
  public did: Did;
  public rbac: RBAC;

  constructor(options: Options) {
    super();
    this._options = options;
    this._api = this._createApi(options);
    this._metadata = {};

    this.did = new Did(this._api, this._metadata);
    this.rbac = new RBAC(this._api, this._metadata);
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
   * Connects the SDK to the network.
   */
  public async connect(): Promise<void> {
    try {
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
  private _createApi(options: Options): ApiPromise {
    const { baseUrl } = options || this._options;
    const provider = new WsProvider(baseUrl);
    return new ApiPromise({
      provider,
      noInitWarn: true,
      ...defaultOptions,
    });
  }
}
