
import { ethers } from 'ethers';
import { Address, ReadDidResponse, CreateStorageKeysEnum } from '../../types';
import { defaultOptions } from '@peaq-network/types';

import { evmToAddress } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import { createStorageKeys } from '../../utils';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { stringToU8a } from '@polkadot/util';


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
    FetchUserRoles,
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
    AssignRoleToUser,
    FetchResponseRole2User,
    ResponseFetchUserGroups
} from './interfaces';

import {
    Entity,
    Permission2Role,
    Role2Group,
    Role2User,
    User2Group,
  } from '@peaq-network/types/interfaces';

enum FunctionSignatures {
    ADD_ROLE = "addRole(bytes32,bytes)",
    ADD_GROUP = "addGroup(bytes32,bytes)",
    ADD_PERMISSION = "addPermission(bytes32,bytes)",
    ASSIGN_PERMISSION_TO_ROLE = "assignPermissionToRole(bytes32,bytes32)",
    UNASSIGN_PERMISSION_TO_ROLE = "unassignPermissionToRole(bytes32,bytes32)",
    ASSIGN_ROLE_TO_GROUP = "assignRoleToGroup(bytes32,bytes32)",
    UNASSIGN_ROLE_TO_GROUP = "unassignRoleToGroup(bytes32,bytes32)",
    ASSIGN_ROLE_TO_USER = "assignRoleToUser(bytes32,bytes32)",
    UNASSIGN_ROLE_TO_USER = "unassignRoleToUser(bytes32,bytes32)",
    ASSIGN_USER_TO_GROUP = "assignUserToGroup(bytes32,bytes32)",
    UNASSIGN_USER_TO_GROUP = "unassignUserToGroup(bytes32,bytes32)",
    DISABLE_GROUP = "disableGroup(bytes32)",
    DISABLE_PERMISSION = "disablePermission(bytes32)",
    DISABLE_ROLE = "disableRole(bytes32)",
    UPDATE_GROUP = "updateGroup(bytes32,bytes)",
    UPDATE_PERMISSION = "updatePermission(bytes32,bytes)",
    UPDATE_ROLE = "updateRole(bytes32,bytes)",
}

enum PrecompileAddresses {
    DID = "0x0000000000000000000000000000000000000802"
}

export class RbacClassEvm {
    private abiCoder = new ethers.AbiCoder();

    constructor() {
    }

    /**
     * Creates a new role of the given name at the role id.
     *
     * @param CreateRole - The parameters this function is expecting:
     *      @param roleName - Name of the role that is created
     *      @param roleId - Generate/user created role ID that acts as the key 
     * @returns tx - The transaction object for add item that a user can send manually.
     */
    public async createRole(options: CreateRole): Promise<EvmTransaction> {
        const { roleName, roleId } = options;
        const convertedRoleId = stringToU8a(roleId);
        
        const createRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_ROLE)).substring(0, 10);

        const roleNameBytes = ethers.hexlify(ethers.toUtf8Bytes(roleName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [convertedRoleId, roleNameBytes]
        );

        let payload = params.replace("0x", createRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async updateRole(options: UpdateRole): Promise<EvmTransaction> {
        const { roleName, roleId } = options;
        const convertedRoleId = stringToU8a(roleId);
        
        const updateRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UPDATE_ROLE)).substring(0, 10);

        const roleNameBytes = ethers.hexlify(ethers.toUtf8Bytes(roleName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [convertedRoleId, roleNameBytes]
        );

        let payload = params.replace("0x", updateRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async disableRole(options: DisableRole): Promise<EvmTransaction> {
        const { roleId } = options;
        const convertedRoleId = stringToU8a(roleId);
        
        const disableRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.DISABLE_ROLE)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32"],
            [convertedRoleId]
        );

        let payload = params.replace("0x", disableRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async assignRoleToGroup(options: AssignRoleToGroup): Promise<EvmTransaction> {
        const { groupId, roleId } = options;
        const convertedGroupId = stringToU8a(groupId);
        const convertedRoleId = stringToU8a(roleId);

        const assignRoleToGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ASSIGN_ROLE_TO_GROUP)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedRoleId, convertedGroupId]
        );

        let payload = params.replace("0x", assignRoleToGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async unassignRoleToGroup(options: UnassignRoleToGroup): Promise<EvmTransaction> {
        const { groupId, roleId } = options;
        const convertedGroupId = stringToU8a(groupId);
        const convertedRoleId = stringToU8a(roleId);

        const unassignPermissionToRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UNASSIGN_ROLE_TO_GROUP)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedRoleId, convertedGroupId]
        );

        let payload = params.replace("0x", unassignPermissionToRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }    

    // TODO
    public async assignRoleToUser(options: AssignRoleToUser): Promise<EvmTransaction> {
        const { userId, roleId } = options;
        const convertedUserId = stringToU8a(userId);
        const convertedRoleId = stringToU8a(roleId);

        const assignRoleToGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ASSIGN_ROLE_TO_USER)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedRoleId, convertedUserId]
        );

        let payload = params.replace("0x", assignRoleToGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async unassignRoleToUser(options: AssignRoleToUser): Promise<EvmTransaction> {
        const { userId, roleId } = options;
        const convertedUserId = stringToU8a(userId);
        const convertedRoleId = stringToU8a(roleId);

        const unassignRoleToGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UNASSIGN_ROLE_TO_USER)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedRoleId, convertedUserId]
        );

        let payload = params.replace("0x", unassignRoleToGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    /**
     * Creates a new group within the RBAC system.
     *
     * @param CreateGroup - The parameters this function is expecting:
     *      @param groupName - Name of the group that is created
     *      @param groupId - Generate/user created group ID that acts as the key 
     * @returns tx - The transaction object for add item that a user can send manually.
     */
    public async createGroup(options: CreateGroup): Promise<EvmTransaction> {
        const { groupName, groupId } = options;
        const convertedGroupId = stringToU8a(groupId);

        const createGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_GROUP)).substring(0, 10);

        const groupNameBytes = ethers.hexlify(ethers.toUtf8Bytes(groupName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [convertedGroupId, groupNameBytes]
        );

        let payload = params.replace("0x", createGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async updateGroup(options: UpdateGroup): Promise<EvmTransaction> {
        const { groupName, groupId } = options;
        const convertedGroupId = stringToU8a(groupId);

        const updateGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UPDATE_GROUP)).substring(0, 10);

        const groupNameBytes = ethers.hexlify(ethers.toUtf8Bytes(groupName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [convertedGroupId, groupNameBytes]
        );

        let payload = params.replace("0x", updateGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async disableGroup(options: DisableGroup): Promise<EvmTransaction> {
        const { groupId } = options;
        const convertedGroupId = stringToU8a(groupId);

        const disableGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.DISABLE_GROUP)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32"],
            [convertedGroupId]
        );

        let payload = params.replace("0x", disableGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    /**
     * Creates a new permission within the RBAC system.
     *
     * @param CreatePermission - The parameters this function is expecting:
     *      @param permissionName - Name of the permission that is created
     *      @param permissionId - Generate/user created group ID that acts as the key 
     * @returns tx - The transaction object for add item that a user can send manually.
     */
    public async createPermission(options: CreatePermission): Promise<EvmTransaction> {
        const { permissionName, permissionId } = options;
        const convertedPermissionId = stringToU8a(permissionId);

        const createPermissionFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ADD_PERMISSION)).substring(0, 10);

        const permissionNameBytes = ethers.hexlify(ethers.toUtf8Bytes(permissionName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [convertedPermissionId, permissionNameBytes]
        );

        let payload = params.replace("0x", createPermissionFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async updatePermission(options: UpdatePermission): Promise<EvmTransaction> {
        const { permissionName, permissionId } = options;
        const convertedPermissionId = stringToU8a(permissionId);

        const updatePermissionFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UPDATE_PERMISSION)).substring(0, 10);

        const permissionNameBytes = ethers.hexlify(ethers.toUtf8Bytes(permissionName));

        const params = this.abiCoder.encode(
            ["bytes32", "bytes"],
            [convertedPermissionId, permissionNameBytes]
        );

        let payload = params.replace("0x", updatePermissionFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async disablePermission(options: DisablePermission): Promise<EvmTransaction> {
        const { permissionId } = options;
        const convertedPermissionId = stringToU8a(permissionId);

        const disablePermissionFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.DISABLE_PERMISSION)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32"],
            [convertedPermissionId]
        );

        let payload = params.replace("0x", disablePermissionFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }


    // TODO
    public async assignPermissionToRole(options: AssignPermissionToRole): Promise<EvmTransaction> {
        const { permissionId, roleId } = options;
        const convertedPermissionId = stringToU8a(permissionId);
        const convertedRoleId = stringToU8a(roleId);

        const assignPermissionToRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ASSIGN_PERMISSION_TO_ROLE)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedPermissionId, convertedRoleId]
        );

        let payload = params.replace("0x", assignPermissionToRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async unassignPermissionToRole(options: UnassignPermissionToRole): Promise<EvmTransaction> {
        const { permissionId, roleId } = options;
        const convertedPermissionId = stringToU8a(permissionId);
        const convertedRoleId = stringToU8a(roleId);

        const unassignPermissionToRoleFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UNASSIGN_PERMISSION_TO_ROLE)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedPermissionId, convertedRoleId]
        );

        let payload = params.replace("0x", unassignPermissionToRoleFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }


    // TODO
    public async assignUserToGroup(options: AssignUserToGroup): Promise<EvmTransaction> {
        const { userId, groupId } = options;
        const convertedUserId = stringToU8a(userId);
        const convertedGroupId = stringToU8a(groupId);

        const assignUserToGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.ASSIGN_USER_TO_GROUP)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedUserId, convertedGroupId]
        );

        let payload = params.replace("0x", assignUserToGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    // TODO
    public async unassignUserToGroup(options: UnassignUserToGroup): Promise<EvmTransaction> {
        const { userId, groupId } = options;
        const convertedUserId = stringToU8a(userId);
        const convertedGroupId = stringToU8a(groupId);

        const unassignUserToGroupFunctionSelector = ethers.keccak256(ethers.toUtf8Bytes(FunctionSignatures.UNASSIGN_USER_TO_GROUP)).substring(0, 10);

        const params = this.abiCoder.encode(
            ["bytes32", "bytes32"],
            [convertedUserId, convertedGroupId]
        );

        let payload = params.replace("0x", unassignUserToGroupFunctionSelector);

        const tx: EvmTransaction = {
            to: PrecompileAddresses.DID,
            data: payload
        };
        return tx;
    }

    /**
     * Fetches the Role for the owner at the roleId.
     *
     * @param FetchRole - The parameters this function is expecting:
     *      @param owner - Address that owns this particular role.
     *      @param roleId - Specific role identifier that will be fetched.
     *      @param wssBaseUrl - Endpoint url that connects to the blockchain to read from.
     * @returns FetchResponseData - Object with the response.
     */
    public async fetchRole(options: FetchRole): Promise<FetchResponseData> {
        const { owner, roleId, wssBaseUrl } = options;
        const rbacType = "Role";
        const storeQuery = 'keysLookUpStore';
        const hashedKey = await this._storageDecoder(owner, roleId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const value = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as Entity;

        const { id, name, enabled } = JSON.parse(JSON.stringify(value.toHuman()));

        if (!name) {
            throw new Error(`${rbacType} not exits with this owner address = ${owner}`);
          }
        return { id, name, enabled } as FetchResponseData;
    };

    /**
     * Fetches all of the roles this user address has.
     *
     * @param FetchRoles - The parameters this function is expecting:
     *      @param owner - Address that owns all of the roles.
     *      @param wssBaseUrl - Endpoint url that connects to the blockchain to read from.
     * @returns FetchResponseData[] - Array of object with the responses.
     */
    public async fetchRoles(options: FetchRoles): Promise<FetchResponseData[]> {
        const { owner, wssBaseUrl } = options;
        const substrateAddress = evmToAddress(owner);
        const api = await this._getApiProvider(wssBaseUrl);
        const roles = (await api.query?.['peaqRbac']?.['roleStore'](
            substrateAddress
        )) as unknown as Entity[];
        if (!roles) {
            throw new Error(
                `Roles not exits with this owner address = ${owner}`
            );
        }
        const responseData: FetchResponseData[] = roles?.map(
            (role) => JSON.parse(JSON.stringify(role.toHuman()))
        );
        return responseData;
    };

    // TODO
    public async fetchRolePermissions(options: FetchRolePermissions): Promise<FetchResponseRole2Permission[]> {
        const { owner, roleId, wssBaseUrl } = options;
        const rbacType = "P2R";
        const storeQuery = 'permission2RoleStore';
        const hashedKey = await this._storageDecoder(owner, roleId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const rolePermissions = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as Permission2Role[];

        if (!rolePermissions){
            throw new Error(`Permission not exits with this roleId = ${roleId}`);
        }
        const responeRolePermission: FetchResponseRole2Permission[] = rolePermissions?.map(
            (item) => JSON.parse(JSON.stringify(item.toHuman()))
        );
        return responeRolePermission;
    };

    /**
     * Fetches the Group for the owner at the groupId.
     *
     * @param FetchGroup - The parameters this function is expecting:
     *      @param owner - Address that owns this particular group.
     *      @param groupId - Specific group identifier that will be fetched.
     *      @param wssBaseUrl - Endpoint url that connects to the blockchain to read from.
     * @returns FetchResponseData - Object with the response.
     */
    public async fetchGroup(options: FetchGroup): Promise<FetchResponseData> {
        const { owner, groupId, wssBaseUrl } = options;
        const rbacType = "Group";
        const storeQuery = 'keysLookUpStore';
        const hashedKey = await this._storageDecoder(owner, groupId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const value = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as Entity;

        const { id, name, enabled } = JSON.parse(JSON.stringify(value.toHuman()));

        if (!name) {
            throw new Error(`${rbacType} not exits with this owner address = ${owner}`);
          }
        return { id, name, enabled } as FetchResponseData;
    };

    /**
     * Fetches all of the groups this user address has
     *
     * @param FetchGroups - The parameters this function is expecting:
     *      @param owner - Address that owns all of the groups.
     *      @param wssBaseUrl - Endpoint url that connects to the blockchain to read from.
     * @returns FetchResponseData[] - Array of object with the responses.
     */
    public async fetchGroups(options: FetchGroups): Promise<FetchResponseData[]> {
        const { owner, wssBaseUrl } = options;
        const substrateAddress = evmToAddress(owner);
        const api = await this._getApiProvider(wssBaseUrl);
        const groups = (await api.query?.['peaqRbac']?.['groupStore'](
            substrateAddress
        )) as unknown as Entity[];
        if (!groups) {
            throw new Error(
                `Groups do not exits with this owner address = ${owner}`
            );
        }
        const responseData: FetchResponseData[] = groups?.map(
            (group) => JSON.parse(JSON.stringify(group.toHuman()))
        );
        return responseData;
    };

        // TODO
    public async fetchGroupRoles(options: FetchGroup): Promise<FetchResponseRole2Group[]> {
        const { owner, groupId, wssBaseUrl } = options;
        const rbacType = 'R2G';
        const storeQuery = 'role2GroupStore';
        const hashedKey = await this._storageDecoder(owner, groupId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const role2GroupData = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as Role2Group[];

        if (!role2GroupData){
            throw new Error(`Permission not exits with this groupId = ${groupId}`);
        }
        const responseRole2Group: FetchResponseRole2Group[] = role2GroupData?.map(
            (item) => JSON.parse(JSON.stringify(item.toHuman()))
        );
        return responseRole2Group;
    };

  /**
   * Fetches the permission for the owner at the permissionId.
   *
   * @param FetchPermission - The parameters this function is expecting:
   *      @param owner - Address that owns this particular permission.
   *      @param permissionId? - Specific permission identifier that will be fetched.
   *      @param wssBaseUrl? - Endpoint url that connects to the blockchain to read from.
   * @returns FetchResponseData - Object with the response.
   */
    public async fetchPermission(options: FetchPermission): Promise<FetchResponseData> {
        const { owner, permissionId, wssBaseUrl } = options;
        const rbacType = "Permission";
        const storeQuery = 'keysLookUpStore';
        const hashedKey = await this._storageDecoder(owner, permissionId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const value = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as Entity;

        const { id, name, enabled } = JSON.parse(JSON.stringify(value.toHuman()));

        if (!name) {
            throw new Error(`${rbacType} not exits with this owner address = ${owner}`);
          }
        return { id, name, enabled } as FetchResponseData;
    };


    /**
     * Fetches all of the permissions this user address has.
     *
     * @param FetchPermissions - The parameters this function is expecting:
     *      @param owner - Address that owns all of the permissions.
     *      @param wssBaseUrl - Endpoint url that connects to the blockchain to read from.
     * @returns FetchResponseData[] - Array of object with the responses.
     */
    public async fetchPermissions(options: FetchPermissions): Promise<FetchResponseData[]> {
        const { owner, wssBaseUrl } = options;
        const substrateAddress = evmToAddress(owner);
        const api = await this._getApiProvider(wssBaseUrl);
        const permissions = (await api.query?.['peaqRbac']?.['permissionStore'](
            substrateAddress
        )) as unknown as Entity[];
        if (!permissions) {
            throw new Error(
                `Permission not exits with this owner address = ${owner}`
            );
        }

        const responseData: FetchResponseData[] = permissions?.map(
            (permission) => JSON.parse(JSON.stringify(permission.toHuman()))
        );
        return responseData;
    };

    // TODO
    public async fetchUserRoles(options: FetchUserRoles): Promise<FetchResponseRole2User[]> {
        const { owner, userId, wssBaseUrl } = options;
        const rbacType = "R2U";
        const storeQuery = 'role2UserStore';
        const hashedKey = await this._storageDecoder(owner, userId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const role2userData = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as Role2User[];

        const responseRole2User: FetchResponseRole2User[] = role2userData?.map(
            (item) => JSON.parse(JSON.stringify(item.toHuman()))
        );
        if (responseRole2User.length === 0) {
        throw new Error(`No role is assigned to this userId: ${userId}`);
        } else {
        return responseRole2User;
        }
    };

    // TODO
    public async fetchUserGroups(options: FetchUserGroups): Promise<ResponseFetchUserGroups[]> {
        const { owner, userId, wssBaseUrl } = options;
        const rbacType = "U2G";
        const storeQuery = 'user2GroupStore';
        const hashedKey = await this._storageDecoder(owner, userId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);
        // read did from store
        const userGroups = (await api.query?.['peaqRbac']?.[storeQuery](
            hashedKey.hashed_key
        )) as unknown as User2Group[];

        if (!userGroups) {
            throw new Error(`No group is assigned to this user`);
        }
        const response: ResponseFetchUserGroups[] = userGroups?.map((item) =>
            JSON.parse(JSON.stringify(item.toHuman()))
        );
        return response;
    };

    // TODO
    public async fetchUserPermissions(options: FetchUserPermissions): Promise<FetchResponseData[]> {
        const { owner, userId, wssBaseUrl } = options;

        const rbacType = "R2U";
        const Role2User_Key = await this._storageDecoder(owner, userId, rbacType);
        const rbacType2 = "U2G";
        const User2Group_Key = await this._storageDecoder(owner, rbacType2, rbacType);

        const permissions: FetchResponseData[] = [];
        const processed_roles = [];

        const api = await this._getApiProvider(wssBaseUrl);


        // Role2User
        const role2userData = (await api.query?.['peaqRbac']?.['role2UserStore'](
            Role2User_Key.hashed_key
        )) as unknown as Role2User[];
        const responseRole2User: FetchResponseRole2User[] = role2userData?.map(
            (item) => JSON.parse(JSON.stringify(item.toHuman()))
        );
        for (const resRole2User1 of responseRole2User) {
            processed_roles.push(resRole2User1.role);
            const responseFetchPermission = await this.fetchRolePermissions({
            owner,
            roleId: resRole2User1.role,
            wssBaseUrl: wssBaseUrl
            });
            for (const resRole2User2 of responseFetchPermission) {
            const responseFetchPermission = await this.fetchPermission({
                owner,
                permissionId: resRole2User2.permission,
                wssBaseUrl: wssBaseUrl
            });
            permissions.push(responseFetchPermission);
            }
        }


        // User2Group
        const user2GroupData = (await api.query?.['peaqRbac']?.[
            'user2GroupStore'
        ](User2Group_Key.hashed_key)) as unknown as User2Group[];
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
            wssBaseUrl: wssBaseUrl
            });
            for (const resUser2Group2 of responseFetchGroupRoles) {
            if (processed_roles.indexOf(resUser2Group2.role) === -1) {
                const responseFetchPermission = await this.fetchRolePermissions({
                    owner,
                    roleId: resUser2Group2.role,
                    wssBaseUrl: wssBaseUrl
                });
                for (const resUser2Group3 of responseFetchPermission) {
                const responseFetchPermission = await this.fetchPermission({
                    owner,
                    permissionId: resUser2Group3.permission,
                    wssBaseUrl: wssBaseUrl
                });
                permissions.push(responseFetchPermission);
                }
            }
            }
        }
        return permissions;
    };

    // TODO
    public async fetchGroupPermissions(options: FetchGroup): Promise<FetchResponseData[]> {
        const { owner, groupId, wssBaseUrl } = options;
        const rbacType = "R2G";
        const hashedKey = await this._storageDecoder(owner, groupId, rbacType);

        const api = await this._getApiProvider(wssBaseUrl);

        let permissions: FetchResponseData[] = [];
        const role2GroupData = (await api.query?.['peaqRbac']?.[
          'role2GroupStore'
        ](hashedKey.hashed_key)) as unknown as Role2Group[];
        const responseRole2UserGroup: FetchResponseRole2Group[] = role2GroupData?.map(
          (item) => JSON.parse(JSON.stringify(item.toHuman()))
        );
        if (responseRole2UserGroup.length > 0) {
          for (const resRole2Group1 of responseRole2UserGroup) {
            const responeFetchRolePermission = await this.fetchRolePermissions({
              owner,
              roleId: resRole2Group1.role,
              wssBaseUrl: wssBaseUrl
            });
            for (const resRole2Group2 of responeFetchRolePermission) {
              const responseFetchPermission = await this.fetchPermission({
                owner,
                permissionId: resRole2Group2.permission,
                wssBaseUrl: wssBaseUrl
              });
              permissions.push(responseFetchPermission);
            }
          }
        return permissions;
        } else {
            throw new Error(`No permission is found with this groupId: ${groupId}`);
          }
    };


    private async _storageDecoder(address: Address, rbacId: string, rbacType: string) {
        // Convert EVM to Substrate address
        const substrateAddress = evmToAddress(address);

        return createStorageKeys([
            {
                value: substrateAddress,
                type: CreateStorageKeysEnum.ADDRESS,
            },
            {
                value: rbacId,
                type: CreateStorageKeysEnum.STANDARD,
            },
            {
                value: rbacType,
                type: CreateStorageKeysEnum.STANDARD,
            },
        ]);
    }

    private async _getApiProvider(wssBaseUrl: string | undefined): Promise<ApiPromise> {
        try {
            if (!wssBaseUrl) throw new Error("Need to provide a wss url for the chain you plan to read from.");
            const wsp = new WsProvider(wssBaseUrl);
            var api = await (await ApiPromise.create({ provider: wsp, noInitWarn: true, ...defaultOptions })).isReady;
            return api;
        }
        catch(error) {
            throw new Error(`WSS base url of ${wssBaseUrl}, is not valid with error message: ${error}`)
        }
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