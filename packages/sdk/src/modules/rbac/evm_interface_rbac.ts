
import { ethers } from 'ethers';
import { Address, ReadDidResponse, CreateStorageKeysEnum, FetchResponseData } from '../../types';
import { defaultOptions } from '@peaq-network/types';

import { evmToAddress } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import { createStorageKeys } from '../../utils';
import { ApiPromise, WsProvider } from '@polkadot/api';

import {
    Entity,
    Permission2Role,
    Role2Group,
    Role2User,
    User2Group,
  } from '@peaq-network/types/interfaces';


enum FunctionSignatures {
    ADD_ROLE = "addRole(bytes32,bytes)",
}

enum PrecompileAddresses {
    DID = "0x0000000000000000000000000000000000000802"
}

interface CreateNewRole {
  roleName: string;
  roleId: Uint8Array;
}

interface FetchRole {
  owner: Address;
  roleId: string;
  chain: string;
}

interface FetchRoles {
    owner: Address;
    chain: string;
  }

export interface EvmTransaction {
    to: string;
    data: string;
}

export class RBACInterfaceEVM {
    private abiCoder = new ethers.AbiCoder();

    constructor() {
    }

    public async createRole(options: CreateNewRole): Promise<EvmTransaction> {
        const { roleName, roleId } = options;
        const createRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ROLE)).substring(0, 10);

        const roleNameBytes = ethers.hexlify(ethers.toUtf8Bytes(roleName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [roleId, roleNameBytes]
        );

        let payload = params.replace("0x", createRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    public async fetchRole(options: FetchRole): Promise<FetchResponseData> {
        const { owner, roleId, chain } = options;
        this._checkEvmAddress(owner);
        return this._storageDecoder(owner, roleId, "Role", chain);
    };

    public async fetchRoles(options: FetchRoles): Promise<FetchResponseData[]> {
        const { owner, chain } = options;
        const substrateAddress = evmToAddress(owner);
        const api = await this._getApiProvider(chain);
        const roles = (await api.query?.['peaqRbac']?.['roleStore'](
            substrateAddress
        )) as unknown as Entity[];
        if (!roles) {
            throw new Error(
                `Roles not exits with this owner address = ${owner}`
            );
        }
        const responseData: FetchResponseData[] = roles?.map(
            (item) => JSON.parse(JSON.stringify(item.toHuman()))
        );
        return responseData;
        }

    private async _storageDecoder(address: Address, value2: string, value3: string, chain: string): Promise<FetchResponseData> {
        // Convert EVM to Substrate address
        const substrateAddress = evmToAddress(address);

        const { hashed_key } = createStorageKeys([
            {
                value: substrateAddress,
                type: CreateStorageKeysEnum.ADDRESS,
            },
            {
                value: value2,
                type: CreateStorageKeysEnum.STANDARD,
            },
            {
                value: value3,
                type: CreateStorageKeysEnum.STANDARD,
            },
        ]);
        
        // init the api connection
        const api = await this._getApiProvider(chain);
        
        // read did from store
        const role = (await api.query?.['peaqRbac']?.['keysLookUpStore'](
            hashed_key
        )) as unknown as Entity;

        const { id, name, enabled } = JSON.parse(JSON.stringify(role.toHuman()));
        if (!name) {
            throw new Error(
              `Permission not exits with this owner address = ${address}`
            );
          }
          return {
            id,
            name,
            enabled,
          };
    }

    private async _getApiProvider(chain: string): Promise<ApiPromise> {
        let wsp: WsProvider;
        if (chain.toLocaleUpperCase() == 'PEAQ') {
            wsp = new WsProvider("wss://peaq.api.onfinality.io/public");
        }
        else if (chain.toLocaleUpperCase() == 'AGUNG'){
            wsp = new WsProvider("wss://peaq-agung.api.onfinality.io/public-ws");
        }
        else {
            throw new Error(`Chain of name ${chain} is not recognized. Please set to either 'peaq' or agung'.`)
        }
        var api = await (await ApiPromise.create({ provider: wsp, noInitWarn: true, ...defaultOptions })).isReady;
        return api;
    }

    /**
     * Used to validate a proper H160 address is being passed.
     */
    private _checkEvmAddress(address: Address){
        if (!ethers.isAddress(address)) {
            throw new Error(`${address} is not a valid EVM address`);
        }
    }
}