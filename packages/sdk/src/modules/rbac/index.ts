import { v4 as uuidv4, v4 } from 'uuid';
import { CreateStorageKeysEnum, FetchRoles } from '../../types';
import { Base } from '../base';
import { ApiPromise } from '@polkadot/api';
import { createStorageKeys } from '../../utils';
import { stringToU8a } from '@polkadot/util';
import type {
  SDKMetadata,
  Address,
  ResponseFetchGroup,
  ResponsePermission,
  ResponseFetchUserGroups,
  ResponseRole2User,
  ResponseRole2Group,
} from '../../types';
import type { CodecHash } from '@polkadot/types/interfaces/runtime/types';
import {
  Entity,
  Permission2Role,
  Role2Group,
  Role2User,
  User2Group,
} from '@peaq-network/types/interfaces';

interface CreateNewRole {
  roleName: string;
  roleId?: string;
  address?: Address;
  seed?: string;
}

interface CreateNewGroup {
  groupName: string;
  groupId?: string;
  address?: Address;
  seed?: string;
}

interface CreateNewPermission {
  permissionName: string;
  permissionId?: string;
  address?: Address;
  seed?: string;
}

interface AssignPermission {
  permissionId: string;
  roleId: string;
  address?: Address;
  seed?: string;
}

interface AssignRoleToGroup {
  groupId: string;
  roleId: string;
  address?: Address;
  seed?: string;
}

interface AssignRoleToUser {
  userId: string;
  roleId: string;
  address?: Address;
  seed?: string;
}

interface AssignUserToGroup {
  userId: string;
  groupId: string;
  address?: Address;
  seed?: string;
}

interface DisbaleGroup {
  groupId: string;
  address?: Address;
  seed?: string;
}

interface DisbalePermission {
  permissionId: string;
  address?: Address;
  seed?: string;
}

interface DisbaleRole {
  roleId: string;
  address?: Address;
  seed?: string;
}

interface FetchGroup {
  owner: Address;
  groupId: string;
}

interface FetchPermission {
  owner: Address;
  permissionId: string;
}

interface FetchRole {
  owner: Address;
  roleId: string;
}

interface FetchRolePermissions {
  owner: Address;
  roleId: string;
}

interface FetchUserGroups {
  owner: Address;
  userId: string;
}

interface FetchUserPermissions {
  owner: Address;
  userId: string;
}

interface FetchUserRoles {
  owner: Address;
  userId: string;
}

interface UnassignPermissionToRole {
  permissionId: string;
  roleId: string;
  address?: Address;
  seed?: string;
}

interface UnassignRoleToGroup {
  roleId: string;
  groupId: string;
  address?: Address;
  seed?: string;
}

interface UnassignRoleToUser {
  roleId: string;
  userId: string;
  address?: Address;
  seed?: string;
}

interface UnassignUserToGroup {
  userId: string;
  groupId: string;
  address?: Address;
  seed?: string;
}

interface UpdateGroup {
  name: string;
  groupId: string;
  address?: Address;
  seed?: string;
}

interface UpdatePermission {
  name: string;
  permissionId: string;
  address?: Address;
  seed?: string;
}

interface UpdateRole {
  name: string;
  roleId: string;
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

  public async createRole(options: CreateNewRole): Promise<{
    roleId: string;
  }> {
    try {
      const { roleName, roleId = '', address = '', seed = '' } = options;
      if (!roleName) throw new Error('Name is required');
      if (roleId && roleId.length !== 32)
        throw new Error('Role Id length should be 32 char only');
      const generatedRoleId = v4().slice(0, 32);
      const convertedRoleId = stringToU8a(roleId || generatedRoleId);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
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
   * Creates a new group.
   * @param options - The options for creating the Group.
   * @returns A promise that resolves when the group is created.
   */

  public async createNewGroup(options: CreateNewGroup): Promise<{
    groupId: string;
  }> {
    try {
      const { groupName, groupId = '', address = '', seed = '' } = options;
      if (!groupName) throw new Error('Name is required');
      if (groupId && groupId.length !== 32)
        throw new Error('Group Id length should be 32 char only');
      const generatedGroupId = v4().slice(0, 32);
      const convetedGroupId = stringToU8a(groupId || generatedGroupId);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const addGroupExtrinsics = api.tx?.['peaqRbac']?.['addGroup'](
        convetedGroupId,
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
   * Creates a new permission.
   * @param options - The options for creating the permission.
   * @returns A promise that resolves when the permission is created.
   */

  public async createPermission(options: CreateNewPermission): Promise<{
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
      const convertedPermissionId = stringToU8a(
        permissionId || generatedPermissionId
      );
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
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

  /**
   * Assign permission to role.
   * @param options - The options for assigning permission to role.
   * @returns A promise that resolves when the permission is assign to role.
   */

  public async assignPermissionToRole(
    options: AssignPermission
  ): Promise<{ message: string }> {
    try {
      const { address = '', seed = '', permissionId, roleId } = options;
      this._validateInput(permissionId);
      this._validateInput(roleId);
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

  /**
   * Assign role to group.
   * @param options - The options for assigning role to group.
   * @returns A promise that resolves when the role is assign to group.
   */
  public async assignRoleToGroup(
    options: AssignRoleToGroup
  ): Promise<{ message: string }> {
    try {
      const { address = '', seed = '', groupId, roleId } = options;
      this._validateInput(groupId);
      this._validateInput(roleId);
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
   * Assign role to user.
   * @param options - The options for assigning role to user.
   * @returns A promise that resolves when the role is assign to user.
   */

  public async assignRoleToUser(
    options: AssignRoleToUser
  ): Promise<{ message: string }> {
    try {
      const { address = '', seed = '', userId, roleId } = options;
      this._validateInput(userId);
      this._validateInput(roleId);
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

  /**
   * Assign user to group.
   * @param options - The options for assigning user to group.
   * @returns A promise that resolves when the user is assign to group.
   */

  public async assignUserToGroup(
    options: AssignUserToGroup
  ): Promise<{ message: string }> {
    try {
      const { address = '', seed = '', userId, groupId } = options;
      this._validateInput(userId);
      this._validateInput(groupId);
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
    options: DisbaleGroup
  ): Promise<{ message: string }> {
    try {
      const { groupId, address = '', seed = '' } = options;
      this._validateInput(groupId);
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
    options: DisbalePermission
  ): Promise<{ message: string }> {
    try {
      const { permissionId, address = '', seed = '' } = options;
      this._validateInput(permissionId);
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

  public async disableRole(options: DisbaleRole): Promise<{ message: string }> {
    try {
      const { roleId, address = '', seed = '' } = options;
      this._validateInput(roleId);
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

  /**
   * Fetch all group.
   * @param option - The option for fetch group.
   * @returns A promise that resolves when the group is fetched.
   */

  public async fetchGroup(option: FetchGroup): Promise<ResponseFetchGroup> {
    try {
      const { groupId, owner } = option;
      this._validateInput(groupId);
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
  ): Promise<ResponseFetchGroup[]> {
    try {
      const { groupId, owner } = option;
      this._validateInput(groupId);
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
      let permissions: ResponseFetchGroup[] = [];
      const role2GroupData = (await api.query?.['peaqRbac']?.[
        'role2GroupStore'
      ](role2GroupStoreKey)) as unknown as Role2Group[];
      const responseRole2UserGroup: ResponseRole2Group[] = role2GroupData?.map(
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
  ): Promise<ResponseRole2Group[]> {
    try {
      const { groupId, owner } = option;
      this._validateInput(groupId);
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
      const responseRole2Group: ResponseRole2Group[] = role2GroupData?.map(
        (item) => JSON.parse(JSON.stringify(item.toHuman()))
      );
      return responseRole2Group;
    } catch (error) {
      throw new Error(`Error occurred while fetching group roles: ${error}`);
    }
  }

  /**
   * Fetch all groups.
   * @param option - The option for fetch groups.
   * @returns A promise that resolves when the groups is fetched.
   */

  public async fetchGroups(owner: Address): Promise<FetchRoles[]> {
    try {
      const api = this._getApi();
      const groups = (await api.query?.['peaqRbac']?.['groupStore'](
        owner
      )) as unknown as Entity[];
      if (!groups) {
        throw new Error(`No group is found of owner: ${owner}`);
      }
      const responseData: FetchRoles[] = groups?.map((item) =>
        JSON.parse(JSON.stringify(item.toHuman()))
      );
      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while fetching groups: ${error}`);
    }
  }

  /**
   * Fetch permission.
   * @param option - The option for fetch permission.
   * @returns A promise that resolves when the permission is fetched.
   */

  public async fetchPermission(
    option: FetchPermission
  ): Promise<ResponseFetchGroup> {
    try {
      const { owner, permissionId } = option;
      this._validateInput(permissionId);
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
   * Fetch all permissions.
   * @param option - The option for fetch permissions.
   * @returns A promise that resolves when the permissions is fetched.
   */

  public async fetchPermissions(owner: Address): Promise<ResponseFetchGroup[]> {
    try {
      const api = await this._getApi();
      const permissions = (await api.query?.['peaqRbac']?.['permissionStore'](
        owner
      )) as unknown as Entity[];
      const responseData: FetchRoles[] = permissions?.map((item) =>
        JSON.parse(JSON.stringify(item.toHuman()))
      );
      if (!permissions) {
        throw new Error(`No permission is found of owner: ${owner}`);
      }
      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while fetching permissions: ${error}`);
    }
  }

  /**
   * Fetch role.
   * @param option - The option for fetch role.
   * @returns A promise that resolves when the role is fetched.
   */

  public async fetchRole(option: FetchRole): Promise<FetchRoles | undefined> {
    try {
      const { owner, roleId } = option;
      this._validateInput(roleId);
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
  ): Promise<ResponsePermission[]> {
    try {
      const { owner, roleId } = option;
      this._validateInput(roleId);
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
      const { owner, userId } = option;
      this._validateInput(userId);
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
  ): Promise<ResponseFetchGroup[]> {
    try {
      const { owner, userId } = option;
      this._validateInput(userId);
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

      const permissions: ResponseFetchGroup[] = [];
      const processed_roles = [];

      // Role2User
      const role2userData = (await api.query?.['peaqRbac']?.['role2UserStore'](
        Role2User_Key
      )) as unknown as Role2User[];
      const responseRole2User: ResponseRole2User[] = role2userData?.map(
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
  ): Promise<ResponseRole2User[]> {
    try {
      const { owner, userId } = option;
      this._validateInput(userId);
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
      const responseRole2User: ResponseRole2User[] = role2userData?.map(
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
  }> {
    try {
      const { permissionId, roleId, address = '', seed = '' } = option;
      this._validateInput(permissionId);
      this._validateInput(roleId);
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

  /**
   * Unassign role to group.
   * @param option - The option for unassign role to group.
   * @returns A promise that resolves when the role is unassign to group.
   */

  public async unassignRoleToGroup(option: UnassignRoleToGroup): Promise<{
    message: string;
  }> {
    try {
      const { roleId, groupId, address = '', seed = '' } = option;
      this._validateInput(roleId);
      this._validateInput(groupId);
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
  }> {
    try {
      const { userId, roleId, address = '', seed = '' } = option;
      this._validateInput(userId);
      this._validateInput(roleId);
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
   * Unassign user to group.
   * @param option - The option for unassign user to group.
   * @returns A promise that resolves when the user is unassign to group.
   */

  public async unassignUserToGroup(option: UnassignUserToGroup): Promise<{
    message: string;
  }> {
    try {
      const { userId, groupId, address = '', seed = '' } = option;
      this._validateInput(userId);
      this._validateInput(groupId);
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
  }> {
    try {
      const { name, groupId, address = '', seed = '' } = option;
      if (!name) throw new Error('Name is required');
      this._validateInput(groupId);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const updateGroupExtrinsics = api.tx?.['peaqRbac']?.['updateGroup'](
        stringToU8a(groupId),
        name
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
  }> {
    try {
      const { name, permissionId, address = '', seed = '' } = option;
      if (!name) throw new Error('Name is required');
      this._validateInput(permissionId);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const updatePermissionExtrinsics = api.tx?.['peaqRbac']?.[
        'updatePermission'
      ](stringToU8a(permissionId), name);
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
  }> {
    try {
      const { name, roleId, address = '', seed = '' } = option;
      if (!name) throw new Error('Name is required');
      this._validateInput(roleId);
      const api = this._getApi();
      const keyPair = this._metadata?.pair || this._getKeyPair(seed);
      const updateRoleExtrinsics = api.tx?.['peaqRbac']?.['updateRole'](
        stringToU8a(roleId),
        name
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
