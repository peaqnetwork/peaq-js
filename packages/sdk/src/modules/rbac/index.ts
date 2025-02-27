import { v4 as uuidv4, v4 } from 'uuid';
import { CreateStorageKeysEnum, } from '../../types';
import { Base } from '../base';
import { ApiPromise } from '@polkadot/api';
import { createStorageKeys } from '../../utils';
import { stringToU8a } from '@polkadot/util';
import type {
  SDKMetadata,
  ResponsePermission,
} from '../../types';
import { ChainType } from '../../types';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import {
  Entity,
  Permission2Role,
  Role2Group,
  Role2User,
  User2Group,
} from '@peaq-network/types/interfaces';

import { RbacClassEvm } from './evm_class_rbac';

// import interfaces
import { 
  EvmTransaction,
  CreateRole,
  UpdateRole,
  DisableRole,
  FetchRole,
  FetchRoles,
  FetchRolePermissions,
  AssignRoleToGroup,
  UnassignRoleToGroup,
  AssignRoleToUser,
  FetchUserRoles,
  UnassignRoleToUser,
  CreateGroup,
  UpdateGroup,
  DisableGroup,
  FetchGroup,
  FetchGroups,
  CreatePermission,
  UpdatePermission,
  DisablePermission,
  AssignPermissionToRole,
  UnassignPermissionToRole,
  AssignUserToGroup,
  UnassignUserToGroup,
  FetchUserPermissions,
  FetchUserGroups,
  FetchPermission,
  FetchResponseData,
  FetchPermissions,
  FetchResponseRole2Permission,
  FetchResponseRole2Group,
  FetchResponseRole2User,
  ResponseFetchUserGroups
} from './interfaces';


export class RBAC extends Base {
  constructor(
    protected override readonly _api?: ApiPromise,
    protected readonly _metadata?: SDKMetadata
  ) {
    super();
  }

  /**
   * Creates a new role of the given name at the role id. User may manually set role id
   * but it must be equal to 32 bytes.
   *
   * @param CreateRole - Create Role object parameter expecting:
   *      @param roleName - Name of the role that is created
   *      @param roleId? - Generate/user created role ID that acts as the key
   *      @param address? - Address to send the tx; defaults to use address at seed.
   *      @param seed? - If not set at create_instance, used to get a keypair to send txs.
   * @returns tx - The transaction object for add item that a user can send manually.
   */
  public async createRole(options: CreateRole): Promise<{
    tx?: EvmTransaction
    roleId: string;
  }> {
    try {
      const { roleName, roleId = '', address = '', seed = '' } = options;
      if (!roleName) throw new Error('Name is required');
      if (roleId && roleId.length !== 32)
        throw new Error('Role Id length should be 32 char only');
      const generatedRoleId = v4().slice(0, 32);

      if (this._metadata?.chainType == ChainType.EVM) {
          const evm = new RbacClassEvm();
          const tx: EvmTransaction = await evm.createRole({roleName: roleName,  roleId: roleId || generatedRoleId})
          return {tx: tx, roleId: roleId || generatedRoleId}
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const convertedRoleId = stringToU8a(roleId || generatedRoleId);
      const addRoleExtrinsics = api.tx?.['peaqRbac']?.['addRole'](
        convertedRoleId,
        roleName
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: addRoleExtrinsics,
      });
      return {
        roleId: roleId || generatedRoleId,
      };
    } catch (error) {
      throw new Error(`Error occurred while creating roles: ${error}`);
    }
  }

  /**
   * Creates a new group of the given name at the group id. User may manually set group id
   * but it must be equal to 32 bytes.
   *
   * @param CreateGroup - Create Group object parameter expecting:
   *      @param groupName - Name of the group that is created
   *      @param groupId? - Generate/user created group ID that acts as the key.
   *      @param address? - Address to send the tx; defaults to use address at seed.
   *      @param seed? - If not set at create_instance, used to get a keypair to send txs.
   * @returns tx - The transaction object for add item that a user can send manually.
   */
  public async createGroup(options: CreateGroup): Promise<{
    tx?: EvmTransaction
    groupId: string;
  }> {
    try {
      const { groupName, groupId = '', address = '', seed = '' } = options;
      if (!groupName) throw new Error('Name is required');
      if (groupId && groupId.length !== 32)
        throw new Error('Group Id length should be 32 char only');
      const generatedGroupId = v4().slice(0, 32);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        const tx: EvmTransaction = await evm.createGroup({groupName: groupName,  groupId: groupId || generatedGroupId})
        return {tx: tx, groupId: groupId || generatedGroupId};
    }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const convertedGroupId = stringToU8a(groupId || generatedGroupId);
      const addGroupExtrinsics = api.tx?.['peaqRbac']?.['addGroup'](
        convertedGroupId,
        groupName
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: addGroupExtrinsics,
      });
      return {
        groupId: groupId || generatedGroupId,
      };
    } catch (error) {
      throw new Error(`Error occurred while creating group: ${error}`);
    }
  }

  /**
   * Creates a new permission of the given name at the permission id. User may manually set permission id
   * but it must be equal to 32 bytes.
   *
   * @param CreatePermission - Create permission object parameter expecting:
   *      @param permissionName - Name of the permission that is created
   *      @param permissionId? - Generate/user created permission ID that acts as the key.
   *      @param address? - Address to send the tx; defaults to use address at seed.
   *      @param seed? - If not set at create_instance, used to get a keypair to send txs.
   * @returns tx - The transaction object for add item that a user can send manually.
   */
  public async createPermission(options: CreatePermission): Promise<{
    tx?: EvmTransaction
    permissionId: string;
  }> {
    try {
      const {
        permissionName,
        permissionId = '',
        address = '',
        seed = '',
      } = options;
      if (!permissionName) throw new Error('Name is required');
      if (permissionId && permissionId.length !== 32)
        throw new Error('Permission Id length should be 32 char only');
      const generatedPermissionId = v4().slice(0, 32);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        const tx: EvmTransaction = await evm.createPermission({permissionName: permissionName,  permissionId: permissionId || generatedPermissionId});
        return {tx: tx, permissionId: permissionId || generatedPermissionId}
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const convertedPermissionId = stringToU8a(permissionId || generatedPermissionId);
      const addPermissionExtrinsics = api.tx?.['peaqRbac']?.['addPermission'](
        convertedPermissionId,
        permissionName
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: addPermissionExtrinsics,
      });
      return {
        permissionId: permissionId || generatedPermissionId,
      };
    } catch (error) {
      throw new Error(`Error occurred while creating permission: ${error}`);
    }
  }

  /** UPDATE
   * 
   * Assign permission to role.
   * @param options - The options for assigning permission to role.
   * @returns A promise that resolves when the permission is assign to role.
   */
  public async assignPermissionToRole(
    options: AssignPermissionToRole
  ): Promise<{ message: string } | EvmTransaction> {
    try {
      const { address = '', seed = '', permissionId, roleId } = options;
      this._validateInput(permissionId);
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.assignPermissionToRole({permissionId: permissionId, roleId: roleId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const assignPermissionToRoleExtrinsics = api.tx?.['peaqRbac']?.[
        'assignPermissionToRole'
      ](stringToU8a(permissionId), stringToU8a(roleId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: assignPermissionToRoleExtrinsics,
      });
      return {
        message: `Successfully assign permission ${permissionId} to role ${roleId}`,
      };
    } catch (error) {
      throw new Error(
        `Error occurred while assign permission to role: ${error}`
      );
    }
  }

  /** UPDATE
   * 
   * Assign role to group.
   * @param options - The options for assigning role to group.
   * @returns A promise that resolves when the role is assign to group.
   */
  public async assignRoleToGroup(
    options: AssignRoleToGroup
  ): Promise<{ message: string} | EvmTransaction> {
    try {
      const { groupId, roleId, address = '', seed = ''} = options;
      this._validateInput(groupId);
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.assignRoleToGroup({groupId: groupId, roleId: roleId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const assignRoleToGroupExtrinsics = api.tx?.['peaqRbac']?.[
        'assignRoleToGroup'
      ](stringToU8a(roleId), stringToU8a(groupId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: assignRoleToGroupExtrinsics,
      });
      return {
        message: `Successfully assign role ${roleId} to group ${groupId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while assign role to group: ${error}`);
    }
  }

  /**
   * UPDATE
   * 
   * Assign role to user.
   * @param options - The options for assigning role to user.
   * @returns A promise that resolves when the role is assign to user.
   */

  public async assignRoleToUser(
    options: AssignRoleToUser
  ): Promise<{ message: string } | EvmTransaction> {
    try {
      const { userId, roleId, address = '', seed = '', } = options;
      this._validateInput(userId);
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.assignRoleToUser({userId: userId, roleId: roleId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const assignRoleToUserExtrinsics = api.tx?.['peaqRbac']?.[
        'assignRoleToUser'
      ](stringToU8a(roleId), stringToU8a(userId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: assignRoleToUserExtrinsics,
      });
      return {
        message: `Successfully assign role ${roleId} to user ${userId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while assign role to user: ${error}`);
    }
  }

  /** UPDATE
   * 
   * 
   * Assign user to group.
   * @param options - The options for assigning user to group.
   * @returns A promise that resolves when the user is assign to group.
   */

  public async assignUserToGroup(
    options: AssignUserToGroup
  ): Promise<{ message: string } | EvmTransaction> {
    try {
      const { userId, groupId, address = '', seed = '' } = options;
      this._validateInput(userId);
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.assignUserToGroup({userId: userId, groupId: groupId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const assignUserToGroupExtrinsics = api.tx?.['peaqRbac']?.[
        'assignUserToGroup'
      ](stringToU8a(userId), stringToU8a(groupId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: assignUserToGroupExtrinsics,
      });
      return {
        message: `Successfully assign user ${userId} to group ${groupId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while assign user to group: ${error}`);
    }
  }

  /**
   * Disable the group.
   * @param options - The options for disable the group.
   * @returns A promise that resolves when group is disable.
   */

  public async disableGroup(
    options: DisableGroup
  ): Promise<{ message: string } | EvmTransaction> {
    try {
      const { groupId, address = '', seed = '' } = options;
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.disableGroup({groupId: groupId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const disableGroupExtrinsics = api.tx?.['peaqRbac']?.['disableGroup'](
        stringToU8a(groupId)
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: disableGroupExtrinsics,
      });
      return {
        message: `Successfully disable group ${groupId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while disable group: ${error}`);
    }
  }

  /**
   * Disable the permission.
   * @param options - The options for disable the permission.
   * @returns A promise that resolves when permission is disable.
   */

  public async disablePermission(
    options: DisablePermission
  ): Promise<{ message: string } | EvmTransaction> {
    try {
      const { permissionId, address = '', seed = '' } = options;
      this._validateInput(permissionId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.disablePermission({permissionId: permissionId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const disableGroupExtrinsics = api.tx?.['peaqRbac']?.[
        'disablePermission'
      ](stringToU8a(permissionId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: disableGroupExtrinsics,
      });
      return {
        message: `Successfully disable permission ${permissionId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while disable permission: ${error}`);
    }
  }

  /**
   * Disable the role.
   * @param options - The options for disable the role.
   * @returns A promise that resolves when role is disable.
   */

  public async disableRole(options: DisableRole): Promise<{ message: string } | EvmTransaction> {
    try {
      const { roleId, address = '', seed = '' } = options;
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.disableRole({roleId: roleId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const disableGroupExtrinsics = api.tx?.['peaqRbac']?.['disableRole'](
        stringToU8a(roleId)
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: disableGroupExtrinsics,
      });
      return {
        message: `Successfully disable role ${roleId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while disable role: ${error}`);
    }
  }

  /**
   * Fetches all of the roles this user address has.
   *
   * @param FetchRoles - The parameters this function is expecting:
   *      @param owner - Address that owns all of the roles.
   *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
   * @returns FetchResponseData[] - Array of object with the responses.
   */
  public async fetchRoles(options: FetchRoles): Promise<FetchResponseData[]> {
    try {
      const { owner, wssBaseUrl = '' } = options;
      if (!owner) throw new Error('Invalid owner address');

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchRoles({owner: owner, wssBaseUrl: wssBaseUrl});
    }

      const api = this._getApi();
      const roles = (await api.query?.['peaqRbac']?.['roleStore'](
        owner
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
    } catch (error) {
      throw new Error(`Error occurred while fetching roles: ${error}`);
    }
  }

  /**
   * Fetches the Group for the owner at the groupId.
   *
   * @param FetchGroup - The parameters this function is expecting:
   *      @param owner - Address that owns this particular group.
   *      @param groupId? - Specific group identifier that will be fetched.
   *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
   * @returns FetchResponseData - Object with the response.
   */
  public async fetchGroup(option: FetchGroup): Promise<FetchResponseData> {
    try {
      const { groupId, owner, wssBaseUrl = '' } = option;
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!owner) throw new Error("Address is required when reading an EVM transaction since an Account is never stored from seed.");
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchGroup({owner: owner,  groupId: groupId, wssBaseUrl: wssBaseUrl});
    }


      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: groupId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'Group',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const api = this._getApi();
      const groups = (await api.query?.['peaqRbac']?.['keysLookUpStore'](
        hashed_key
      )) as unknown as Entity;
      if (!groups) {
        throw new Error(`Group not exits with this owner address = ${owner}`);
      }
      const { id, name, enabled } = JSON.parse(
        JSON.stringify(groups.toHuman())
      );
      if (!name) {
        throw new Error(`Group not exits with this owner address = ${owner}`);
      }
      return {
        id,
        name,
        enabled,
      };
    } catch (error) {
      throw new Error(`Error occurred while fetching group: ${error}`);
    }
  }

  /**
   * Fetch all group permission.
   * @param option - The option for fetch group permissions.
   * @returns A promise that resolves when the group permission is fetched.
   */

  public async fetchGroupPermissions(
    option: FetchGroup
  ): Promise<FetchResponseData[]> {
    try {
      const { groupId, owner, wssBaseUrl='' } = option;
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchGroupPermissions({owner: owner, groupId: groupId, wssBaseUrl: wssBaseUrl});
      }

      const api = await this._getApi();
      const { hashed_key: role2GroupStoreKey } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: groupId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'R2G',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      let permissions: FetchResponseData[] = [];
      const role2GroupData = (await api.query?.['peaqRbac']?.[
        'role2GroupStore'
      ](role2GroupStoreKey)) as unknown as Role2Group[];
      const responseRole2UserGroup: FetchResponseRole2Group[] = role2GroupData?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      if (responseRole2UserGroup.length > 0) {
        for (const resRole2Group1 of responseRole2UserGroup) {
          const responeFetchRolePermission = await this.fetchRolePermissions({
            owner,
            roleId: resRole2Group1.role,
          });
          for (const resRole2Group2 of responeFetchRolePermission) {
            const responseFetchPermission = await this.fetchPermission({
              owner,
              permissionId: resRole2Group2.permission,
            });
            permissions.push(responseFetchPermission);
          }
        }
        return permissions;
      } else {
        throw new Error(`No permission is found with this groupId: ${groupId}`);
      }
    } catch (error) {
      throw new Error(
        `Error occurred while fetching group permission: ${error}`
      );
    }
  }

  /**
   * Fetch all group roles.
   * @param option - The option for fetch group roles.
   * @returns A promise that resolves when the group roles is fetched.
   */

  public async fetchGroupRoles(
    option: FetchGroup
  ): Promise<FetchResponseRole2Group[]> {
    try {
      const { owner, groupId, wssBaseUrl = '' } = option;
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchGroupRoles({owner: owner, groupId: groupId, wssBaseUrl: wssBaseUrl});
    }

      const api = await this._getApi();
      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: groupId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'R2G',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const role2GroupData = (await api.query?.['peaqRbac']?.[
        'role2GroupStore'
      ](hashed_key)) as unknown as Role2Group[];
      const responseRole2Group: FetchResponseRole2Group[] = role2GroupData?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      return responseRole2Group;
    } catch (error) {
      throw new Error(`Error occurred while fetching group roles: ${error}`);
    }
  }

  /**
   * Fetches all of the groups this user address has
   *
   * @param FetchGroups - The parameters this function is expecting:
   *      @param owner - Address that owns all of the groups.
   *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
   * @returns FetchResponseData[] - Array of object with the responses.
   */
  public async fetchGroups(options: FetchGroups): Promise<FetchResponseData[]> {
    try {
      const { owner, wssBaseUrl = '' } = options;
      if (!owner) throw new Error('Invalid owner address');

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchGroups({owner: owner, wssBaseUrl: wssBaseUrl});
    }
      const api = this._getApi();
      const groups = (await api.query?.['peaqRbac']?.['groupStore'](
        owner
      )) as unknown as Entity[];
      if (!groups) {
        throw new Error(`No group is found of owner: ${owner}`);
      }
      const responseData: FetchResponseData[] = groups?.map((item) =>
        JSON.parse(JSON.stringify(item.toHuman()))
      );
      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while fetching groups: ${error}`);
    }
  }

  /**
   * Fetches the permission for the owner at the permissionId.
   *
   * @param FetchPermission - The parameters this function is expecting:
   *      @param owner - Address that owns this particular permission.
   *      @param permissionId? - Specific permission identifier that will be fetched.
   *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
   * @returns FetchResponseData - Object with the response.
   */
  public async fetchPermission(
    option: FetchPermission
  ): Promise<FetchResponseData> {
    try {
      const { owner, permissionId, wssBaseUrl = ''  } = option;
      this._validateInput(permissionId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!owner) throw new Error("Address is required when reading an EVM transaction since an Account is never stored from seed.");
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchPermission({owner: owner,  permissionId: permissionId, wssBaseUrl: wssBaseUrl});
    }


      const api = await this._getApi();
      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: permissionId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'Permission',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const permission = (await api.query?.['peaqRbac']?.['keysLookUpStore'](
        hashed_key
      )) as unknown as Entity;
      const { id, name, enabled } = JSON.parse(
        JSON.stringify(permission.toHuman())
      );
      return {
        id,
        name,
        enabled,
      };
    } catch (error) {
      throw new Error(`Error occurred while fetching group roles: ${error}`);
    }
  }

  /**
   * Fetches all of the permissions this user address has
   *
   * @param FetchPermissions- The parameters this function is expecting:
   *      @param owner - Address that owns all of the permissions.
   *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
   * @returns FetchResponseData[] - Array of object with the responses.
   */
  public async fetchPermissions(options: FetchPermissions): Promise<FetchResponseData[]> {
    try {
      const { owner, wssBaseUrl = '' } = options;
      if (!owner) throw new Error('Invalid owner address');

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchPermissions({owner: owner, wssBaseUrl: wssBaseUrl});
    }

      const api = this._getApi();
      const permissions = (await api.query?.['peaqRbac']?.['permissionStore'](
        owner
      )) as unknown as Entity[];
      if (!permissions) {
        throw new Error(`No permission is found of owner: ${owner}`);
      }
      const responseData: FetchResponseData[] = permissions?.map((item) =>
        JSON.parse(JSON.stringify(item.toHuman()))
      );
      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while fetching permissions: ${error}`);
    }
  }

    /**
     * Fetches the Role for the owner at the roleId.
     *
     * @param FetchRole - The parameters this function is expecting:
     *      @param owner - Address that owns this particular role.
     *      @param roleId? - Specific role identifier that will be fetched.
     *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
     * @returns FetchResponseData - Object with the response.
     */
  public async fetchRole(option: FetchRole): Promise<FetchResponseData | undefined> {
    try {
      const { owner, roleId, wssBaseUrl = ''  } = option;
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!owner) throw new Error("Address is required when reading an EVM transaction since an Account is never stored from seed.");
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchRole({owner: owner,  roleId: roleId, wssBaseUrl: wssBaseUrl});
    }


      const api = await this._getApi();
      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: roleId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'Role',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const role = (await api.query?.['peaqRbac']?.['keysLookUpStore'](
        hashed_key
      )) as unknown as Entity;
      const { id, name, enabled } = JSON.parse(JSON.stringify(role.toHuman()));
      if (!name) {
        throw new Error(
          `Permission not exits with this owner address = ${owner}`
        );
      }
      return {
        id,
        name,
        enabled,
      };
    } catch (error) {
      throw new Error(`Error occurred while fetching role: ${error}`);
    }
  }

  /**
   * Fetch all role permissions.
   * @param option - The option for fetch role permission.
   * @returns A promise that resolves when the permission of role is fetched.
   */

  public async fetchRolePermissions(
    option: FetchRolePermissions
  ): Promise<FetchResponseRole2Permission[]> {
    try {
      const { owner, roleId, wssBaseUrl = '' } = option;
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchRolePermissions({owner: owner, roleId: roleId, wssBaseUrl: wssBaseUrl});
    }

      const api = await this._getApi();
      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: roleId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'P2R',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const rolePermissions = (await api.query?.['peaqRbac']?.[
        'permission2RoleStore'
      ](hashed_key)) as unknown as Permission2Role[];
      if (!rolePermissions)
        throw new Error(`Permission not exits with this roleId = ${roleId}`);
      const responeRolePermission: ResponsePermission[] = rolePermissions?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      return responeRolePermission;
    } catch (error) {
      throw new Error(
        `Error occurred while fetching role permission: ${error}`
      );
    }
  }

  /**
   * Fetch all user groups.
   * @param option - The option for fetch user groups.
   * @returns A promise that resolves when the user groups is fetched.
   */

  public async fetchUserGroups(
    option: FetchUserGroups
  ): Promise<ResponseFetchUserGroups[]> {
    try {
      const { owner, userId, wssBaseUrl = '' } = option;
      this._validateInput(userId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchUserGroups({owner: owner, userId: userId, wssBaseUrl: wssBaseUrl});
      }

      const api = await this._getApi();
      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: userId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'U2G',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const userGroups = (await api.query?.['peaqRbac']?.['user2GroupStore'](
        hashed_key
      )) as unknown as User2Group[];
      if (!userGroups) {
        throw new Error(`No group is assigned to this user`);
      }
      const response: ResponseFetchUserGroups[] = userGroups?.map((item) =>
        JSON.parse(JSON.stringify(item.toHuman()))
      );
      return response;
    } catch (error) {
      throw new Error(`Error occurred while fetching user groups: ${error}`);
    }
  }

  /**
   * Fetch all user permissions.
   * @param option - The option for fetch user permissions.
   * @returns A promise that resolves when the user permissions is fetched.
   */

  public async fetchUserPermissions(
    option: FetchUserPermissions
  ): Promise<FetchResponseData[]> {
    try {
      const { owner, userId, wssBaseUrl='' } = option;
      this._validateInput(userId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchUserPermissions({owner: owner, userId: userId, wssBaseUrl: wssBaseUrl});
      }

      const api = await this._getApi();
      const { hashed_key: Role2User_Key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: userId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'R2U',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);

      const { hashed_key: User2Group_Key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: userId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'U2G',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);

      const permissions: FetchResponseData[] = [];
      const processed_roles = [];

      // Role2User
      const role2userData = (await api.query?.['peaqRbac']?.['role2UserStore'](
        Role2User_Key
      )) as unknown as Role2User[];
      const responseRole2User: FetchResponseRole2User[] = role2userData?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      for (const resRole2User1 of responseRole2User) {
        processed_roles.push(resRole2User1.role);
        const responseFetchPermission = await this.fetchRolePermissions({
          owner,
          roleId: resRole2User1.role,
        });
        for (const resRole2User2 of responseFetchPermission) {
          const responseFetchPermission = await this.fetchPermission({
            owner,
            permissionId: resRole2User2.permission,
          });
          permissions.push(responseFetchPermission);
        }
      }

      // User2Group
      const user2GroupData = (await api.query?.['peaqRbac']?.[
        'user2GroupStore'
      ](User2Group_Key)) as unknown as User2Group[];
      const responseUser2Group: ResponseFetchUserGroups[] = user2GroupData?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      if (responseUser2Group.length === 0) {
        return permissions;
      }
      for (const resUser2Group1 of responseUser2Group) {
        const responseFetchGroupRoles = await this.fetchGroupRoles({
          owner,
          groupId: resUser2Group1.group,
        });
        for (const resUser2Group2 of responseFetchGroupRoles) {
          if (processed_roles.indexOf(resUser2Group2.role) === -1) {
            const responseFetchPermission = await this.fetchRolePermissions({
              owner,
              roleId: resUser2Group2.role,
            });
            for (const resUser2Group3 of responseFetchPermission) {
              const responseFetchPermission = await this.fetchPermission({
                owner,
                permissionId: resUser2Group3.permission,
              });
              permissions.push(responseFetchPermission);
            }
          }
        }
      }
      return permissions;
    } catch (error) {
      throw new Error(
        `Error occurred while fetching user permissions: ${error}`
      );
    }
  }

  /**
   * Fetch all user roles.
   * @param option - The option for fetch user roles.
   * @returns A promise that resolves when the user roles is fetched.
   */

  public async fetchUserRoles(
    option: FetchUserRoles
  ): Promise<FetchResponseRole2User[]> {
    try {
      const { owner, userId, wssBaseUrl = '' } = option;
      this._validateInput(userId);

      if (this._metadata?.chainType == ChainType.EVM) {
        if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
        const evm = new RbacClassEvm();
        return await evm.fetchUserRoles({owner: owner, userId: userId, wssBaseUrl: wssBaseUrl});
      }

      const api = await this._getApi();
      const { hashed_key } = createStorageKeys([
        {
          value: owner,
          type: CreateStorageKeysEnum.ADDRESS,
        },
        {
          value: userId,
          type: CreateStorageKeysEnum.STANDARD,
        },
        {
          value: 'R2U',
          type: CreateStorageKeysEnum.STANDARD,
        },
      ]);
      const role2userData = (await api.query?.['peaqRbac']?.['role2UserStore'](
        hashed_key
      )) as unknown as Role2User[];
      const responseRole2User: FetchResponseRole2User[] = role2userData?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      if (responseRole2User.length === 0) {
        throw new Error(`No role is assigned to this userId: ${userId}`);
      } else {
        return responseRole2User;
      }
    } catch (error) {
      throw new Error(`Error occurred while fetching user roles: ${error}`);
    }
  }

  /**
   * Unassign permission to role.
   * @param option - The option for unassign permission to role.
   * @returns A promise that resolves when the permission is unassign to role.
   */

  public async unassignPermissionToRole(
    option: UnassignPermissionToRole
  ): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { permissionId, roleId, address = '', seed = '' } = option;
      this._validateInput(permissionId);
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.unassignPermissionToRole({permissionId: permissionId, roleId: roleId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const unassignPermissionToRoleExtrinsics = api.tx?.['peaqRbac']?.[
        'unassignPermissionToRole'
      ](stringToU8a(permissionId), stringToU8a(roleId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: unassignPermissionToRoleExtrinsics,
      });
      return {
        message: `Successfully unassign role: ${roleId} from permission: ${permissionId}`,
      };
    } catch (error) {
      throw new Error(
        `Error occurred while unassign permission to role: ${error}`
      );
    }
  }

  /** UPDATE
   * 
   * 
   * Unassign role to group.
   * @param option - The option for unassign role to group.
   * @returns A promise that resolves when the role is unassign to group.
   */
  public async unassignRoleToGroup(option: UnassignRoleToGroup): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { roleId, groupId, address = '', seed = '' } = option;
      this._validateInput(roleId);
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.unassignRoleToGroup({roleId: roleId, groupId: groupId})
      }
      
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const unassignRoleToGroupExtrinsics = api.tx?.['peaqRbac']?.[
        'unassignPermissionToRole'
      ](stringToU8a(roleId), stringToU8a(groupId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: unassignRoleToGroupExtrinsics,
      });
      return {
        message: `Successfully unassign role: ${roleId} from group: ${groupId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while unassign role to group: ${error}`);
    }
  }

  /**
   * Unassign role to user.
   * @param option - The option for unassign role to user.
   * @returns A promise that resolves when the role is unassign to user.
   */

  public async unassignRoleToUser(option: UnassignRoleToUser): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { userId, roleId, address = '', seed = '' } = option;
      this._validateInput(userId);
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.unassignRoleToUser({roleId: roleId, userId: userId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const unassignRoleToUserExtrinsics = api.tx?.['peaqRbac']?.[
        'unassignRoleToUser'
      ](stringToU8a(roleId), stringToU8a(userId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: unassignRoleToUserExtrinsics,
      });
      return {
        message: `Successfully unassign user: ${userId} from role: ${roleId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while unassign role to user: ${error}`);
    }
  }

  /**
   * UPDATE
   * 
   * Unassign user to group.
   * @param option - The option for unassign user to group.
   * @returns A promise that resolves when the user is unassign to group.
   */

  public async unassignUserToGroup(option: UnassignUserToGroup): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { userId, groupId, address = '', seed = '' } = option;
      this._validateInput(userId);
      this._validateInput(groupId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.unassignUserToGroup({userId: userId, groupId: groupId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const unassignUserToGroupExtrinsics = api.tx?.['peaqRbac']?.[
        'unassignUserToGroup'
      ](stringToU8a(userId), stringToU8a(groupId));
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: unassignUserToGroupExtrinsics,
      });
      return {
        message: `Successfully unassign user: ${userId} from group: ${groupId}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while unassign role to user: ${error}`);
    }
  }

  /**
   * Update the group.
   * @param option - The option for update the group.
   * @returns A promise that resolves when the group is updated.
   */

  public async updateGroup(option: UpdateGroup): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { groupName, groupId, address = '', seed = '' } = option;
      if (!groupName) throw new Error('Name is required');

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.updateGroup({groupName: groupName, groupId: groupId})
      }

      this._validateInput(groupId);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const updateGroupExtrinsics = api.tx?.['peaqRbac']?.['updateGroup'](
        stringToU8a(groupId),
        groupName
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: updateGroupExtrinsics,
      });
      return {
        message: `Successfully update group ${groupId} with new name: ${name}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while update group: ${error}`);
    }
  }

  /**
   * Update the permission.
   * @param option - The option for update the permission.
   * @returns A promise that resolves when the permission is updated.
   */

  public async updatePermission(option: UpdatePermission): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { permissionName, permissionId, address = '', seed = '' } = option;
      if (!permissionName) throw new Error('Name is required');
      this._validateInput(permissionId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.updatePermission({permissionName: permissionName, permissionId: permissionId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const updatePermissionExtrinsics = api.tx?.['peaqRbac']?.[
        'updatePermission'
      ](stringToU8a(permissionId), permissionName);
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: updatePermissionExtrinsics,
      });
      return {
        message: `Successfully update permission ${permissionId} with new name: ${name}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while update permission: ${error}`);
    }
  }

  /**
   * Update the role.
   * @param option - The option for update the role.
   * @returns A promise that resolves when the role is updated.
   */

  public async updateRole(option: UpdateRole): Promise<{
    message: string;
  } | EvmTransaction> {
    try {
      const { roleName, roleId, address = '', seed = '' } = option;
      if (!roleName) throw new Error('Name is required');
      this._validateInput(roleId);

      if (this._metadata?.chainType == ChainType.EVM) {
        const evm = new RbacClassEvm();
        return await evm.updateRole({roleName: roleName, roleId: roleId})
      }

      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const updateRoleExtrinsics = api.tx?.['peaqRbac']?.['updateRole'](
        stringToU8a(roleId),
        roleName
      );
      const nonce = await this._getNonce(address || keyPair.address);
      await this._newSignTx({
        nonce,
        address: keyPair,
        extrinsics: updateRoleExtrinsics,
      });
      return {
        message: `Successfully update role ${roleId} with new name: ${name}`,
      };
    } catch (error) {
      throw new Error(`Error occurred while update role: ${error}`);
    }
  }
}
