import { v4 as uuidv4, v4 } from 'uuid';
import { CreateStorageKeysEnum, FetchRoles } from '../../types';
import { Base } from '../base';
import { ApiPromise } from '@polkadot/api';
import { createStorageKeys } from '../../utils';
import { stringToU8a } from '@polkadot/util';
import type { SDKMetadata, Address } from '../../types';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import { Entity } from '@peaq-network/types/interfaces';

interface CreateNewRole {
  name: string;
  id?: string;
  address?: Address;
  seed?: string;
}

export class RBAC extends Base {
  constructor(
    protected override readonly _api?: ApiPromise,
    protected readonly _metadata?: SDKMetadata
  ) {
    super();
  }
  /**
   * Creates a new role.
   * @param options - The options for creating the Roles.
   * @returns A promise that resolves when the role is created.
   */

  public async createRole(options: CreateNewRole) {
    try {
      const { name, id = '', address = '', seed = '' } = options;
      if (!name) throw new Error('Name is required');
      const generatedId = v4();
      const roleId = stringToU8a(id || generatedId);
      const roleName = stringToU8a(name);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const addRoleExtrinsics = api.tx?.['peaqRbac']?.['addRole'](
        roleId,
        roleName
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._signTransaction({
        nonce,
        address: keyPair,
        extrinsics: addRoleExtrinsics,
      });
      return {
        hash: addRoleExtrinsics.hash as unknown as CodecHash,
        id: id || generatedId,
      };
    } catch (error) {
      throw new Error(`Error occurred while creating roles: ${error}`);
    }
  }

  /**
   * Fetch all roles.
   * @param ownerAddress - The ownerAddress is public address of user or owner who created a roles.
   * @returns A promise that resolves when the role is fetched.
   */

  public async fetchRoles(ownerAddress: Address): Promise<FetchRoles[]> {
    try {
      if (!ownerAddress) throw new Error('Invalid owner address');
      const api = this._getApi();
      const roles = (await api.query?.['peaqRbac']?.['roleStore'](
        ownerAddress
      )) as unknown as Entity[];
      if (!roles) {
        throw new Error(
          `Roles not exits with this owner address = ${ownerAddress}`
        );
      }
      const responseData: FetchRoles[] = [];
      roles.forEach((item, index) => {
        const readAbleData = item.toHuman();
        const stringFyData = JSON.stringify(readAbleData);
        const parseData = JSON.parse(stringFyData);
        const { id, name, enabled } = parseData;
        let payload = {
          id,
          name,
          enabled,
        };
        responseData.push(payload);
      });
      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while fetching roles: ${error}`);
    }
  }
}
