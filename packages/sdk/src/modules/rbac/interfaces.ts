
import type { Address } from '../../types';

export interface EvmTransaction {
    to: string;
    data: string;
}

// Role interfaces
export interface CreateRole {
  roleName: string;
  roleId?: string;
  address?: Address;
  seed?: string;
}
export interface UpdateRole {
    roleName: string;
    roleId: string;
    address?: Address;
    seed?: string;
}
export interface DisableRole {
    roleId: string;
    address?: Address;
    seed?: string;
  }
export interface FetchRole {
    owner: Address;
    roleId: string;
    wssBaseUrl?: string;
}
export interface FetchRoles {
    owner: Address;
    wssBaseUrl?: string;
}
export interface FetchRolePermissions {
    owner: Address;
    roleId: string;
    wssBaseUrl?: string;
}
export interface AssignRoleToGroup {
    groupId: string;
    roleId: string;
    address?: Address;
    seed?: string;
  }
export interface UnassignRoleToGroup {
    roleId: string;
    groupId: string;
    address?: Address;
    seed?: string;
}
export interface AssignRoleToUser {
    userId: string;
    roleId: string;
    address?: Address;
    seed?: string;
}
export interface FetchUserRoles {
    owner: Address;
    userId: string;
    wssBaseUrl?: string;
}
export interface UnassignRoleToUser {
    roleId: string;
    userId: string;
    address?: Address;
    seed?: string;
}


// Group interfaces
export interface CreateGroup {
  groupName: string;
  groupId?: string;
  address?: Address;
  seed?: string;
}
export interface UpdateGroup {
    groupName: string;
    groupId: string;
    address?: Address;
    seed?: string;
}
export interface DisableGroup {
    groupId: string;
    address?: Address;
    seed?: string;
}
export interface FetchGroup {
    owner: Address;
    groupId: string;
    wssBaseUrl?: string;
}
export interface FetchGroups {
    owner: Address;
    wssBaseUrl?: string;
}



// Permission interfaces
export interface CreatePermission {
  permissionName: string;
  permissionId?: string;
  address?: Address;
  seed?: string;
}
export interface UpdatePermission {
    permissionName: string;
    permissionId: string;
    address?: Address;
    seed?: string;
}
export interface DisablePermission {
    permissionId: string;
    address?: Address;
    seed?: string;
  }
export interface FetchPermission {
    owner: Address;
    permissionId: string;
    wssBaseUrl?: string;
}
export interface FetchPermissions {
    owner: Address;
    wssBaseUrl?: string;
}
export interface AssignPermissionToRole {
    permissionId: string;
    roleId: string;
    address?: Address;
    seed?: string;
}
export interface UnassignPermissionToRole {
    permissionId: string;
    roleId: string;
    address?: Address;
    seed?: string;
}

// User Interfaces
export interface AssignUserToGroup {
    userId: string;
    groupId: string;
    address?: Address;
    seed?: string;
}
export interface FetchUserGroups {
    owner: Address;
    userId: string;
    wssBaseUrl?: string;
}
export interface UnassignUserToGroup {
    userId: string;
    groupId: string;
    address?: Address;
    seed?: string;
}
export interface FetchUserPermissions {
    owner: Address;
    userId: string;
    wssBaseUrl?: string;
}


// Response data
export interface FetchResponseData{
    id: string;
    name: string;
    enabled: boolean;
}

export interface FetchResponseRole2Permission{
    permission: string,
    role: string
}
export interface FetchResponseRole2Group{
    role: string,
    group: string
}
export interface FetchResponseRole2User{
    role: string,
    user: string
}
export interface ResponseFetchUserGroups{
    user: string,
    group: string
}