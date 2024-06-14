import { v4 as v4 } from 'uuid';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { unsubscribeRuntimeVersion } from '../../utils';
import { RBAC } from './index';

const BASE_URL = process.env['NX_NETWORK_BASE_URL'] as string;


/**
 * Tests functionality in the sdk for RBAC operations. Before all tests, creates a new instance of
 * Alice Keyring to execute the operations. Executes all RBAC functions by calling
 * the peaq pallets to perform the operation as defined in rbac/index.tx and base/index.ts.
 * Provides clarity by error checking to ensure proper logic.
 */
describe.skip('RBAC', () => {
  let api: ApiPromise;
  let keyring: Keyring;
  let alice: KeyringPair;
  let rbac: RBAC;

  beforeAll(async () => {
    const provider = new WsProvider(BASE_URL);
    api = await ApiPromise.create({ provider, noInitWarn: true });
    keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    rbac = new RBAC(api, { pair: alice });
  }, 40000);

  afterAll(async () => {
    await unsubscribeRuntimeVersion(api);
    await api?.disconnect();
  });

  /**
   * Tests the RBAC Role pallet functionalities using the sdk.
   */
  describe('Role', () => {
    it('create Role invalid name error', async () => {
      await expect(rbac.createRole({roleName: ''}))
        .rejects.toThrow('Create Role Error: Name is required');
    });

    it('create Role invalid role id length error', async () => {
      const role_name = 'rbac-role-test-1';
      const role_id_small = '1234';
      await expect(rbac.createRole({roleName: role_name, roleId: role_id_small}))
        .rejects.toThrow('Create Role Error: Role Id length should be 32 char only');

      const role_id_large = '123456789123456789123456789123456';
      await expect(rbac.createRole({roleName: role_name, roleId: role_id_large}))
        .rejects.toThrow('Create Role Error: Role Id length should be 32 char only');
    });

    it('create new role generic', async () => {
      const role_name = 'rbac-role-test-1';
      await createFetchRemoveRole(role_name, null);
    }, 70000); 

    it('create new role custom roleId', async () => {
      const role_name = 'rbac-role-test-1';
      const role_id = v4().slice(0, 32); // generate random role id of like-format
      await createFetchRemoveRole(role_name, role_id);
    }, 70000);

    it('create role of same name & role id error', async () => {
      const old_role_name = 'rbac-test-101';
      const old_role_id = '78709119-cf06-4224-8632-c4fe8512';
      await expect(rbac.createRole({roleName: old_role_name, roleId: old_role_id}))
        .rejects.toThrow('Create Role Error: EntityAlreadyExist for peaqRbac.');
    }, 50000);

    it('assign role to a invalid user size error', async () => {
      // use previously stored role for Alice
      const role_id = '78709119-cf06-4224-8632-c4fe8512';

      const userIdSmall = '1234';
      const userIdLarge = 'd3198b56-7c20-45df-bb59-8d6179acaaa'
      await expect(rbac.assignRoleToUser({userId: userIdSmall, roleId: role_id }))
        .rejects.toThrow('Assign role to user Error: Input should be 32 length');
      await expect(rbac.assignRoleToUser({userId: userIdLarge, roleId: role_id }))
        .rejects.toThrow('Assign role to user Error: Input should be 32 length');
    });

    it('assign role to user', async () => {
      // also tests the unassignRoleToUser function
      const role_name = 'rbac-role-test-3';
      const role_id = '55999119-cf06-4224-8632-c4fe8555';
      const user_id = '9c2f4e8e-8a9f-4bd1-b6c1-147f6d23';

      const result = await rbac.assignRoleToUser({userId: user_id, roleId: role_id});
      expect(result).toBeDefined();
      expect(result.message).toBe(`Successfully assign role ${role_id} to user ${user_id}`);

      // remove the user's role for cleanup
      const result2 = await rbac.unassignRoleToUser({userId: user_id, roleId: role_id});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully unassign user: ${user_id} from role: ${role_id}`);
    }, 100000);

    it('assign role to a invalid group size', async () => {
      // use previously stored role for Alice
      const role_id = '78709119-cf06-4224-8632-c4fe8512';

      const group_id_small = '1234';
      const group_id_large = 'd3198b56-7c20-45df-bb59-8d6179acaaa'
      await expect(rbac.assignRoleToGroup({groupId: group_id_small, roleId: role_id }))
        .rejects.toThrow('Assign role to group Error: Input should be 32 length');
      await expect(rbac.assignRoleToGroup({groupId: group_id_large, roleId: role_id }))
        .rejects.toThrow('Assign role to group Error: Input should be 32 length');
    });

    it('assign role to group', async () => {
      // creates a new group, assigns a role to that group, then removes the role from the group and the group itself for cleanup
      // also tests the unassignRoleToGroup
      const role_id = '78709119-cf06-4224-8632-c4fe8512';
      const group_name = 'group-test-1';

      const result = await rbac.createNewGroup({groupName: group_name});
      const result2 = await rbac.assignRoleToGroup({groupId: result.groupId, roleId: role_id});

      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully assign role ${role_id} to group ${result.groupId}`);

      // remove the user's role for cleanup
      const result3 = await rbac.unassignRoleToGroup({groupId: result.groupId, roleId: role_id});
      expect(result3).toBeDefined();
      expect(result3.message).toBe(`Successfully unassign role: ${role_id} from group: ${result.groupId}`);

      // remove the group from the user
      const result4 = await rbac.deleteGroup({groupName: group_name, groupId: result.groupId});
      expect(result4).toBeDefined();
      expect(result4.log).toBe(`Group Id of ${result.groupId} removed with name ${group_name}`);
    }, 120000);

    it('fetch a previously created Role', async () => {
      const role_name = 'rbac-test-101';
      const role_id = '78709119-cf06-4224-8632-c4fe8512';
      await fetchRoleTest(role_name, role_id);
    }, 30000);

    it('fetch a role that does not exist', async () => {
      const role_id = '11111111-1111-1111-1111-11111111';
      expect(rbac.fetchRole({owner: alice.address, roleId: role_id}))
      .rejects.toThrow(`Fetch Role Error: Role does not exist with the owner address = ${alice.address}`);
    })

    it('fetch all Roles', async () => {
      const result = await rbac.fetchRoles({owner: alice.address});
      result.forEach(function(role) {
        expect(role?.id).toBeDefined();
        expect(role?.id).toHaveLength(32);
        expect(role?.name).toBeDefined();
        expect(role?.name).toEqual(expect.any(String));
        expect(role?.enabled).toEqual(expect.any(Boolean));
      });
    });

    it('fetch role permissions', async () => {
      const role_name = 'rbac-role-test-4';
      const role_id = '99999119-cf06-4224-8632-c4f99999';
      // expect empty list back for no permission set
      const result = await rbac.fetchRolePermissions({owner: alice.address, roleId: role_id});
      expect(result).toBeDefined();
      expect(result).toEqual([]);

      // create a permission for the role
      const permission = 'permission-test-1';
      const result2 = await rbac.createPermission({permissionName: permission});
      expect(result2).toBeDefined();
      expect(result2?.permissionId).toHaveLength(32);
      
      // assign the permission to the role
      const result3 = await rbac.assignPermissionToRole({permissionId: result2.permissionId, roleId: role_id});
      expect(result3).toBeDefined();
      expect(result3?.message).toBe(`Successfully assign permission ${result2.permissionId} to role ${role_id}`);

      const result4 = await rbac.fetchRolePermissions({owner: alice.address, roleId: role_id});
      result4.forEach(function(item){
        expect(item).toBeDefined();
        expect(item.permission).toBe(result2.permissionId);
        expect(item.role).toBe(role_id);
      })

      // remove role<->permission for cleanup
      const result5 = await rbac.unassignPermissionToRole({permissionId: result2.permissionId, roleId: role_id});
      expect(result5).toBeDefined();
      expect(result5?.message).toBe(`Successfully unassign permission: ${result2.permissionId} from role: ${role_id}`);

      // remove the permission
      const result6 = await rbac.deletePermission({permissionName: permission, permissionId: result2.permissionId});
      expect(result6).toBeDefined();
      expect(result6.log).toBe(`Permission Id of ${result2.permissionId} removed with name ${permission}`);
    }, 170000);

    it('fetch User roles', async () => {
      // create new role, assign user to it, fetch user roles, then unassign user and role, then remove the role
      const role_name = 'rbac-role-test-1';
      const user_id = '18b74c6f-9c5d-4d6b-b8a2-7d0f1b34';

      const result = await createRoleTest(role_name, null);

      const result2 = await rbac.assignRoleToUser({roleId: result.roleId, userId: user_id});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully assign role ${result.roleId} to user ${user_id}`);
      
      const result3 = await rbac.fetchUserRoles({owner: alice.address, userId: user_id});
      expect(result3).toBeDefined();
      result3.forEach(function(item){
        expect(item).toBeDefined();
        expect(item.role).toBe(result.roleId);
        expect(item.user).toBe(user_id);
      })

      // remove role from user 
      const result4 = await rbac.unassignRoleToUser({roleId: result?.roleId, userId: user_id});
      expect(result4).toBeDefined();
      expect(result4.message).toBe(`Successfully unassign user: ${user_id} from role: ${result?.roleId}`);

      // delete role
      await deleteRoleTest(role_name, result?.roleId);

    }, 150000);

    it('update role', async () => {
      // create role, update the name, fetch to check for change, then remove role
      const role_name = 'rbac-role-test-1';
      const role_name2 = 'my-new-role';

      const result = await createRoleTest(role_name, null);

      const result2 = await rbac.updateRole({name: role_name2, roleId: result.roleId});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully update role ${result.roleId} with new name: ${role_name2}`);

      // fetch role to see name change
      await fetchRoleTest(role_name2, result.roleId);

      // delete role
      await deleteRoleTest(role_name2, result?.roleId);

    }, 120000);

    it('disable role', async () => {
      // creates new role, fetch, disable, fetch, remove
      const role_name = 'rbac-role-test-1';
      const result = await createRoleTest(role_name, null);

      await fetchRoleTest(role_name, result.roleId);

      const result3 = await rbac.disableRole({roleId: result.roleId});
      expect(result3).toBeDefined();
      expect(result3.message).toBe(`Successfully disable role ${result.roleId}`);

      const result4 = await rbac.fetchRole({owner: alice.address, roleId: result.roleId});
      expect(result4).toBeDefined();
      expect(result4?.id).toBe(result.roleId);
      expect(result4?.name).toBe(role_name);
      expect(result4?.enabled).toBe(false); // check for enabled property to be false

      // delete role
      await deleteRoleTest(role_name, result?.roleId);
    }, 140000);

    it('delete role', async () => {
      const role_name = 'rbac-role-test-1';
      const role_id = '97709123-ae81-4334-8632-d4fe8515';
      
      // create and delete role
      await rbac.createRole({roleName: role_name, roleId: role_id});

      // delete role test
      await deleteRoleTest(role_name, role_id);
    }, 70000);

  });

    /**
   * Tests the RBAC Group pallet functionalities using the sdk.
   */
  describe('Group', () => {
    it('create group invalid name', async () => {
      await expect(rbac.createNewGroup({groupName: ''}))
        .rejects.toThrow('Name is required');
    });
    it('create group invalid group id length', async () => {
      const group_name = 'rbac-group-test-1';
      const group_id_small = '1234';
      await expect(rbac.createNewGroup({groupName: group_name, groupId: group_id_small}))
        .rejects.toThrow('Group Id length should be 32 char only');
      
      const group_id_large = 'a38b27f2-5f8d-41da-9418-8cbd3e561';
      await expect(rbac.createNewGroup({groupName: group_name, groupId: group_id_small}))
        .rejects.toThrow('Group Id length should be 32 char only');
    });
    it('create new group generic', async () => {
      const group_name = 'rbac-group-test-1';
      await createFetchRemoveGroup(group_name, null);
    }, 70000);
    it('create new group custom group', async () => {
      const group_name = 'rbac-group-test-1';
      const role_id = v4().slice(0, 32); // generate random role id of like-format
      await createFetchRemoveGroup(group_name, role_id);
    }, 70000);

    it('create group of same name & group id error', async () => {
      const old_role_name = 'rbac-group-test-100';
      const old_role_id = '90ff3c35-e479-4a9e-a390-c36ca58f';
      await expect(rbac.createNewGroup({groupName: old_role_name, groupId: old_role_id}))
        .rejects.toThrow('Create Group Error: EntityAlreadyExist for peaqRbac.');
    }, 50000);

    it('assign group to a invalid user size error', async () => {
      // use previously stored group for Alice
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';

      const userIdSmall = '1234';
      const userIdLarge = 'd3198b56-7c20-45df-bb59-8d6179acaaa'
      await expect(rbac.assignUserToGroup({userId: userIdSmall, groupId: group_id }))
        .rejects.toThrow('Assign group to user Error: Input should be 32 length');
      await expect(rbac.assignUserToGroup({userId: userIdLarge, groupId: group_id }))
        .rejects.toThrow('Assign group to user Error: Input should be 32 length');
    });

    it('assign group to user', async () => {
      // also tests the unassignGroupToUser function
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';
      const user_id = '1c2f4e8e-8a9f-4bd1-b6c1-147f6d21';

      const result = await rbac.assignUserToGroup({userId: user_id, groupId: group_id});
      expect(result).toBeDefined();
      expect(result.message).toBe(`Successfully assign user ${user_id} to group ${group_id}`);

      // remove the user's group for cleanup
      const result2 = await rbac.unassignUserToGroup({userId: user_id, groupId: group_id});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully unassign user: ${user_id} from group: ${group_id}`);
    }, 70000);

    it('fetch a previously created group', async () => {
      const group_name = 'rbac-group-test-100';
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';
      await fetchGroupTest(group_name, group_id);
    }, 30000);

    it('fetch a group that does not exist', async () => {
      const group_id = '11111111-1111-1111-1111-11111111';
      expect(rbac.fetchGroup({owner: alice.address, groupId: group_id}))
      .rejects.toThrow(`Fetch Group Error: Group does not exist with the owner address = ${alice.address}`);
    });

    it('fetch all Groups', async () => {
      const result = await rbac.fetchGroups({owner: alice.address});
      result.forEach(function(group) {
        expect(group?.id).toBeDefined();
        expect(group?.id).toHaveLength(32);
        expect(group?.name).toBeDefined();
        expect(group?.name).toEqual(expect.any(String));
        expect(group?.enabled).toEqual(expect.any(Boolean));
      });
    });

    it('fetch group roles', async () => {
      // assigns 2 roles to a group_id, fetches & checks the roles, then removes the roles
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';
      const role_id = '99999119-cf06-4224-8632-c4fe8511';
      const role_id2 = '99709228-fe12-4224-1331-d5ef8211';


      // add a roles to the group
      await rbac.assignRoleToGroup({groupId: group_id, roleId: role_id});
      await rbac.assignRoleToGroup({groupId: group_id, roleId: role_id2});

      // fetch group roles to check expected
      const result = await rbac.fetchGroupRoles({owner: alice.address, groupId: group_id});

      result.forEach(function(response) {
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role).toHaveLength(32);
        expect(response.group).toBeDefined();
        expect(response.group).toHaveLength(32);
      });

      // remove the roles from the group
      const result2 = await rbac.unassignRoleToGroup({groupId: group_id, roleId: role_id});
      const result3 = await rbac.unassignRoleToGroup({groupId: group_id, roleId: role_id2});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully unassign role: ${role_id} from group: ${group_id}`);
      expect(result3).toBeDefined();
      expect(result3.message).toBe(`Successfully unassign role: ${role_id2} from group: ${group_id}`);
    }, 140000);

    it('fetch group permission', async() => {
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';
      const role_id = '99999119-cf06-4224-8632-c4fe8511';
      const permission_id = '1121d8c1-2e36-46f8-8b1a-5f6e7a11';
      const permission_id2 = '118e3c12-6a1b-40da-94e9-3e2a8f11';

      // create permissions
      await rbac.createPermission({permissionName: 'rbac-permission-test-10', permissionId: permission_id});
      await rbac.createPermission({permissionName: 'rbac-permission-test-20', permissionId: permission_id2});

      // add permission to the role
      await rbac.assignPermissionToRole({permissionId: permission_id, roleId: role_id});
      await rbac.assignPermissionToRole({permissionId: permission_id2, roleId: role_id});

      // assign role with the permissions to the group
      await rbac.assignRoleToGroup({roleId: role_id, groupId: group_id});

      const result = await rbac.fetchGroupPermissions({owner: alice.address, groupId: group_id});
      result.forEach(function(permission){
        expect(permission).toBeDefined();
        expect(permission.id).toBeDefined();
        expect(permission.id).toHaveLength(32);
        expect(permission.name).toBeDefined();
        expect(permission.name).toEqual(expect.any(String));
        expect(permission.enabled).toBeDefined();
        expect(permission.enabled).toEqual(expect.any(Boolean));
      });

      // unassign role the the group
      await rbac.unassignRoleToGroup({roleId: role_id, groupId: group_id});

      // unassign permission from role
      const result2 = await rbac.unassignPermissionToRole({permissionId: permission_id, roleId: role_id});
      const result3 = await rbac.unassignPermissionToRole({permissionId: permission_id2, roleId: role_id});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully unassign permission: ${permission_id} from role: ${role_id}`);
      expect(result3).toBeDefined();
      expect(result3.message).toBe(`Successfully unassign permission: ${permission_id2} from role: ${role_id}`);

      // remove permissions from role
      await deletePermissionTest('rbac-permission-test-10', permission_id);
      await deletePermissionTest('rbac-permission-test-20', permission_id2);

    }, 300000);

    it('fetch user groups and unassign', async () => {
      const user_id = '9c2f4e8e-8a9f-4bd1-b6c1-147f6d23';
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';

      // assign user to group, fetch user groups, remove user from group, fetch to make sure it was removed
      await rbac.assignUserToGroup({groupId: group_id, userId: user_id}); 

      // fetch user groups from previously defined group_id
      const result = await rbac.fetchUserGroups({owner: alice.address, userId: user_id});
      expect(result).toBeDefined();
      result.forEach(function(response){
        expect(response.group).toBeDefined();
        expect(response.group).toHaveLength(32);
        expect(response.group).toBe(group_id);
        expect(response.user).toBeDefined();
        expect(response.user).toHaveLength(32);
        expect(response.user).toBe(user_id);
      })

      // remove user from group
      const result2 = await rbac.unassignUserToGroup({userId: user_id, groupId: group_id});
      expect(result2.message).toBe(`Successfully unassign user: ${user_id} from group: ${group_id}`)

      // fetch to make sure it was removed
      const result3 = await rbac.fetchUserGroups({owner: alice.address, userId: user_id});
      expect(result3).toBeDefined();
      expect(result3).toEqual([]);
    }, 150000);

    it('update group', async () => {
      const group_name = 'my-new-group';
      const group_id = '90ff3c35-e479-4a9e-a390-c36ca58f';

      const result = await rbac.updateGroup({name: group_name, groupId: group_id });
      expect(result).toBeDefined();
      expect(result.message).toBe(`Successfully update group ${group_id} with new name: ${group_name}`);

      // set back to old name
      const old_group_name = 'rbac-group-test-100';
      const result2 = await rbac.updateGroup({name: old_group_name, groupId: group_id });
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully update group ${group_id} with new name: ${old_group_name}`);

    }, 70000);

    it('disable group', async () => {
      // create new group, disable, then remove newly created group
      const group_name = 'rbac-group-test-1';
      const result = await createGroupTest(group_name, null);

      const result2 = await rbac.disableGroup({groupId: result.groupId});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully disable group ${result.groupId}`);

      const result3 = await rbac.fetchGroup({owner: alice.address, groupId: result.groupId})
      expect(result3).toBeDefined();
      expect(result3.id).toBe(result.groupId);
      expect(result3.name).toBe(group_name);
      expect(result3.enabled).toBe(false);

      // remove the group
      await deleteGroupTest(group_name, result.groupId);

    }, 100000);

    it('remove group', async () => {
      // creates then removes a group
      const group_name = 'group-test-1';
      const result = await rbac.createNewGroup({groupName: group_name});
      expect(result).toBeDefined();
      expect(result.groupId).toBeDefined();
      expect(result.groupId).toHaveLength(32);

      // remove the previously created group
      const result2 = await rbac.deleteGroup({groupName: group_name, groupId: result.groupId});
      expect(result2).toBeDefined();
      expect(result2.log).toBe(`Group Id of ${result.groupId} removed with name ${group_name}`);
    }, 70000);
  });

    /**
   * Tests the RBAC Permission pallet functionalities using the sdk.
   */
  describe('Permission', () => {
    it('create permission invalid name error', async () => {
      await expect(rbac.createPermission({permissionName: ''}))
        .rejects.toThrow('Create Permission Error: Name is required');
    });

    it('create permission invalid permission id length error', async () => {
      const permission_name = 'rbac-permission-test-1';
      const permission_id_small = '1234';
      await expect(rbac.createPermission({permissionName: permission_name, permissionId: permission_id_small}))
        .rejects.toThrow('Create Permission Error: Permission Id length should be 32 char only');

      const role_id_large = '123456789123456789123456789123456';
      await expect(rbac.createPermission({permissionName: permission_name, permissionId: permission_id_small}))
        .rejects.toThrow('Create Permission Error: Permission Id length should be 32 char only');
    });

    it('create new role generic', async () => {
      const role_name = 'rbac-permission-test-1';
      await createFetchRemovePermission(role_name, null);
    }, 70000);

    it('assign permission to role', async () =>{
      // create new permission, assign to role
      const role_id = '78709119-cf06-4224-8632-c4fe8512'; // previously set role
      const permission_name = 'rbac-permission-test-1';

      const result = await rbac.createPermission({permissionName: permission_name});

      const result2 = await rbac.assignPermissionToRole({permissionId: result.permissionId, roleId: role_id});
      expect(result2.message).toBe(`Successfully assign permission ${result.permissionId} to role ${role_id}`);

      const result3 = await rbac.fetchRolePermissions({owner: alice.address, roleId: role_id});
      expect(result3).toBeDefined();
      result3.forEach(function(response){
        const idPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{8}$/;
        expect(response.permission).toBeDefined();
        expect(response.permission).toHaveLength(32);
        expect(idPattern.test(response.permission as string)).toBe(true);
        expect(response.role).toBeDefined();
        expect(response.role).toHaveLength(32);
        expect(idPattern.test(response.role as string)).toBe(true);
        expect(response.role).toBe(role_id);
      });

      // remove the permisison from the roel
      await rbac.unassignPermissionToRole({roleId: role_id, permissionId: result.permissionId});
    
      // remove permission
      await deletePermissionTest(permission_name, result.permissionId);
    }, 150000);

    it('fetch a previously created permission', async () => {
      const permission_id = 'ed0f35a4-5d68-474e-b37e-d6a2ff7c';
      await fetchPermissionTest('rbac-permission-test-1', permission_id);
    }, 50000);

    it('fetch a permission that does not exist', async () => {
      const permission_id = '11111111-1111-1111-1111-11111111';
      expect(rbac.fetchPermission({owner: alice.address, permissionId: permission_id}))
      .rejects.toThrow(`Fetch Permission Error: Permission does not exist with the owner address = ${alice.address}`);
    });

    it('fetch all permissions', async () => {
      // fetch group roles to check expected
      const result = await rbac.fetchPermissions({owner: alice.address});
      result.forEach(function(permission) {
        expect(permission?.id).toBeDefined();
        expect(permission?.id).toHaveLength(32);
        expect(permission?.name).toBeDefined();
        expect(permission?.name).toEqual(expect.any(String));
        expect(permission?.enabled).toEqual(expect.any(Boolean));
      });
    }, 50000);

    it('fetch User Permissions', async () => {
      const user_id = '9c2f4e8e-8a9f-4bd1-b6c1-147f6d23';

      // create a user and assign to role
      const result = await createRoleTest('rbac-role-test-5', null);
      await rbac.assignRoleToUser({roleId: result.roleId, userId: user_id});

      // create permission
      const result2 = await createPermissionTest('rbac-permission-test-5', null);
      const result3 = await rbac.assignPermissionToRole({permissionId: result2.permissionId, roleId: result.roleId});

      // fetch permissions based on that user_id
      const result4 = await rbac.fetchUserPermissions({owner: alice.address, userId: user_id});
      result4.forEach(function(permission) {
        expect(permission?.id).toBeDefined();
        expect(permission?.id).toHaveLength(32);
        expect(permission?.name).toBeDefined();
        expect(permission?.name).toEqual(expect.any(String));
        expect(permission?.enabled).toEqual(expect.any(Boolean));
      });

      // unassign role<->permission, remove permission, and remove role
      await rbac.unassignPermissionToRole({permissionId: result2.permissionId, roleId: result.roleId});
      await deletePermissionTest('rbac-permission-test-5', result2.permissionId);
      await deleteRoleTest('rbac-role-test-5', result.roleId);

    }, 200000);

    it('update permission', async () => {
      const permission_name = 'my-new-permission';
      const permission_id = 'ed0f35a4-5d68-474e-b37e-d6a2ff7c';

      const result = await rbac.updatePermission({name: permission_name, permissionId: permission_id });
      expect(result).toBeDefined();
      expect(result.message).toBe(`Successfully update permission ${permission_id} with new name: ${permission_name}`);

      // set back to old name
      const old_group_name = 'rbac-permission-test-1';
      const result2 = await rbac.updatePermission({name: old_group_name, permissionId: permission_id });
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully update permission ${permission_id} with new name: ${old_group_name}`);

    }, 70000);

    it('disable permission', async () => {
      // create new group, disable, then remove newly created group
      const permission_name = 'rbac-permission-test-2';
      const result = await createPermissionTest(permission_name, null);

      const result2 = await rbac.disablePermission({permissionId: result.permissionId});
      expect(result2).toBeDefined();
      expect(result2.message).toBe(`Successfully disable permission ${result.permissionId}`);

      const result3 = await rbac.fetchPermission({owner: alice.address, permissionId: result.permissionId})
      expect(result3).toBeDefined();
      expect(result3.id).toBe(result.permissionId);
      expect(result3.name).toBe(permission_name);
      expect(result3.enabled).toBe(false);

      // remove the group
      await deletePermissionTest(permission_name, result.permissionId);

    }, 100000);

    it('remove permission', async() => {
      // create then remove a permission
      const permission = 'permission-test-1';
      const result = await rbac.createPermission({permissionName: permission});
      expect(result).toBeDefined();
      expect(result.permissionId).toBeDefined();
      expect(result.permissionId).toHaveLength(32);

      // remove the previously created group
      const result2 = await rbac.deletePermission({permissionName: permission, permissionId: result.permissionId});
      expect(result2).toBeDefined();
      expect(result2.log).toBe(`Permission Id of ${result.permissionId} removed with name ${permission}`);
    }, 70000);
  });

  /**
   * Generalized flow that creates, fetches, then removes a role. Ensures that rbac role function
   * contains the proper regex format of dynamic values. Checks for creation, fetch, and deletion of the
   * role.
   * 
   * @param role_name - Name of the role to be created
   * @param role_id - Identifier for the role, or null if to be created
   * @returns - None
   */
  async function createFetchRemoveRole(role_name: string, role_id: string | null) {
    const result = await createRoleTest(role_name, role_id);
    const result2 = await fetchRoleTest(role_name, result.roleId); // read role to check for proper name
    const result3 = await deleteRoleTest(result2?.name as string, result2?.id as string);
  }

  // create role and test
  async function createRoleTest(role_name: string, role_id: string | null){
    const result = await rbac.createRole({
      roleName: role_name,
      ...(role_id ? { roleId: role_id } : {}),
    });

    // check response object
    const roleIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{8}$/;
    expect(result.roleId).toBeDefined();
    expect(roleIdPattern.test(result.roleId as string)).toBe(true);
    expect(result.roleId).toHaveLength(32);
    return result;
  }

  // fetch role and test returned object
  async function fetchRoleTest(role_name: string, role_id: string) {
    const result = await rbac.fetchRole({owner: alice.address, roleId: role_id});
    expect(result).toBeDefined();
    expect(result?.id).toBe(role_id);
    expect(result?.name).toBe(role_name);
    expect(result?.enabled).toBe(true);
    return result
  }

  // remove role and expect failure after calling fetch
  
  async function deleteRoleTest(role_name: string, role_id: string) {
    // remove the role to prevent clutter
    const result = await rbac.deleteRole({roleName: role_name, roleId: role_id});
    expect(result).toBeDefined();
    expect(result.log).toBe(`Role Id of ${role_id} removed with name ${role_name}`);

    // ensure the role cannot be fetched anymore
    await expect(rbac.fetchRole({owner: alice.address, roleId: role_id}))
      .rejects.toThrow(`Fetch Role Error: Role does not exist with the owner address = ${alice.address}`);

    return result;
  }

  /**
   * Generalized flow that creates, fetches, then removes a group. Ensures that rbac group function
   * contains the proper regex format of dynamic values. Checks for creation, fetch, and deletion of the
   * role.
   * 
   * @param group_name - Name of the group to be created
   * @param group_id - Identifier for the group, or null if to be created
   * @returns - None
   */
  async function createFetchRemoveGroup(group_name: string, group_id: string | null) {
    const result = await createGroupTest(group_name, group_id as string);
    const result2 = await fetchGroupTest(group_name, result.groupId);
    const result3 = await deleteGroupTest(result2.name as string, result.groupId as string);
  }

    // create group and test
  async function createGroupTest(group_name: string, group_id: string | null){
    const result = await rbac.createNewGroup({
      groupName: group_name,
      ...(group_id ? { groupId: group_id } : {}),
    });

    // check response object
    const groupIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{8}$/;
    expect(groupIdPattern.test(result.groupId as string)).toBe(true);
    expect(result.groupId).toHaveLength(32);
    return result;
  }

  async function fetchGroupTest(group_name: string, group_id: string) {
    const result = await rbac.fetchGroup({owner: alice.address, groupId: group_id});
    expect(result).toBeDefined();
    expect(result?.id).toBe(group_id);
    expect(result?.name).toBe(group_name);
    expect(result?.enabled).toBe(true);
    return result;
  }

  async function deleteGroupTest(group_name: string, group_id: string){
    const result = await rbac.deleteGroup({groupName: group_name, groupId: group_id});
    expect(result).toBeDefined();
    expect(result.log).toBe(`Group Id of ${group_id} removed with name ${group_name}`);

    // ensure the role cannot be fetched anymore
    expect(rbac.fetchGroup({owner: alice.address, groupId: group_id}))
      .rejects.toThrow(`Fetch Group Error: Group does not exist with the owner address = ${alice.address}`);

    return result;
  }

  /**
   * Generalized flow that creates, fetches, then removes a permission. Ensures that rbac permission function
   * contains the proper regex format of dynamic values. Checks for creation, fetch, and deletion of the
   * role.
   * 
   * @param permission_name - Name of the permission to be created
   * @param permission_id - Identifier for the permission, or null if to be created
   * @returns - None
   */
  async function createFetchRemovePermission(permission_name: string, permission_id: string | null) {
    const result = await createPermissionTest(permission_name, permission_id as string);
    const result2 = await fetchPermissionTest(permission_name, result?.permissionId);
    const result3 = await deletePermissionTest(result2.name as string, result.permissionId as string);
  }

  // create permission and test
  async function createPermissionTest(permission_name: string, permission_id: string | null){
    const result = await rbac.createPermission({
      permissionName: permission_name,
      ...(permission_id ? { permissionId: permission_id } : {}),
    });
    // check response object
    const groupIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{8}$/;
    expect(groupIdPattern.test(result.permissionId as string)).toBe(true);
    expect(result.permissionId).toHaveLength(32);
    return result;
  }

  async function fetchPermissionTest(permission_name: string, permission_id: string) {
    const result = await rbac.fetchPermission({owner: alice.address, permissionId: permission_id});
    expect(result).toBeDefined();
    expect(result?.id).toBe(permission_id);
    expect(result?.name).toBe(permission_name);
    expect(result?.enabled).toBe(true);
    return result;
  }

  async function deletePermissionTest(permission_name: string, permission_id: string){
    const result = await rbac.deletePermission({permissionName: permission_name, permissionId: permission_id});
    expect(result).toBeDefined();
    expect(result.log).toBe(`Permission Id of ${permission_id} removed with name ${permission_name}`);

    // ensure the role cannot be fetched anymore
    await expect(rbac.fetchPermission({owner: alice.address, permissionId: permission_id}))
      .rejects.toThrow(`Fetch Permission Error: Permission does not exist with the owner address = ${alice.address}`);
    return;
  }

});


// old tests 

  // describe.skip(' Role ', () => {
  //   it('should create a new role with auto generated ID', async () => {
  //     const name = 'test-1-create-new-role-rohan-ye';
  //     const result = await rbac.createRole({
  //       roleName: name,
  //       address: alice.address,
  //     });
  //     expect(typeof result.roleId).toBe('string');
  //   }, 30000);

  //   it('should create a new role with custom id ID', async () => {
  //     const name = 'test-1-create-coustom-roleID-rohan-ye';
  //     const result = await rbac.createRole({
  //       roleName: name,
  //       address: alice.address,
  //       roleId: 'bcmnxbncvbnxvcnbvxnbcvnxbvchvchv',
  //     });
  //     expect(result.roleId).toBe('bcmnxbncvbnxvcnbvxnbcvnxbvchvchv');
  //     expect(typeof result.roleId).toBe('string');
  //   }, 30000);

  //   it('should throw an error if name is not provided', async () => {
  //     await expect(
  //       rbac.createRole({ address: alice.address, roleName: '' })
  //     ).rejects.toThrow('Name is required');
  //   });

  //   it('assign role to user', async () => {
  //     const result = await rbac.assignRoleToUser({
  //       roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
  //       userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
  //     });
  //     console.log('==result==', result);
  //     expect(typeof result.message).toBe('string');
  //     expect(result.message).toContain('Successfully assign role');
  //   }, 30000);

  //   it('disable role', async () => {
  //     const result = await rbac.disableRole({
  //       roleId: '90cee651-c907-4fa9-8852-391533c0',
  //     });
  //     expect(typeof result.message).toBe('string');
  //     expect(result.message).toContain('Successfully disable role');
  //   }, 50000);
  // });

  // describe.skip('fetch Roles, groups, and permissions', () => {
  //   it('should throw an error when owner address is not provided', async () => {
  //     await expect(rbac.fetchRoles({owner: ''})).rejects.toThrow(
  //       'Invalid owner address'
  //     );
  //   });

  //   it('should fetch roles', async () => {
  //       const response = await rbac.fetchRoles({owner: alice.address});
        
  //       expect(typeof response).toBe('object');
  //       expect(typeof response[0].id).toBe('string');
  //       expect(typeof response[0].name).toBe('string');
  //       expect(typeof response[0].enabled).toBe('boolean');
  //   });
  //   it('should fetch groups', async () => {
  //     const response = await rbac.fetchGroups({owner: alice.address});
  //     expect(typeof response).toBe('object');
  //     if (response.length > 0) {
  //       expect(typeof response[0].id).toBe('string');
  //       expect(typeof response[0].name).toBe('string');
  //       expect(typeof response[0].enabled).toBe('boolean');
  //     }
  //   });
  //   it('should fetch permissions', async () => {
  //     const response = await rbac.fetchPermissions({owner: alice.address});
  //     expect(typeof response).toBe('object');
  //     if (response.length > 0) {
  //       expect(typeof response[0].id).toBe('string');
  //       expect(typeof response[0].name).toBe('string');
  //       expect(typeof response[0].enabled).toBe('boolean');
  //     }
  //   });
  // });
  //   describe.skip(' Group ', () => {
  //     it('create new group', async () => {
  //       const name = 'rohan-group';
  //       const result = await rbac.createNewGroup({
  //         groupName: name,
  //         address: alice.address,
  //       });
  //       groupId = result.groupId;
  //       expect(typeof result.groupId).toBe('string');
  //     }, 30000);

  //     it('fetch group()', async () => {
  //       const response = await rbac.fetchGroup({
  //         groupId: groupId,
  //         owner: alice.address,
  //       });
  //       expect(typeof response.id).toBe('string');
  //       expect(typeof response.name).toBe('string');
  //       expect(typeof response.enabled).toBe('boolean');
  //     });

  //     it('fetch group permission()', async () => {
  //       const response = await rbac.fetchGroupPermissions({
  //         owner: alice.address,
  //         groupId: '5bff002a-926d-4e08-88d5-1e7304a2'          
  //       });
  //       expect(typeof response).toBe('object');
  //       expect(typeof response[0].id).toBe('string');
  //       expect(typeof response[0].name).toBe('string');
  //       expect(typeof response[0].enabled).toBe('boolean');
  //     });
  //     it('fetch group roles()', async () => {
  //       const response = await rbac.fetchGroupRoles({
  //         groupId: groupId,
  //         owner: alice.address,
  //       });
  //     });

  //     it('assign role to group', async () => {
  //       const result = await rbac.assignRoleToGroup({
  //         groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
  //         roleId: '0db8f02b-cbc3-44ed-b97b-9eb932d1',
  //       });
  //       expect(typeof result.message).toBe('string');
  //       expect(result.message).toContain('Successfully assign role');
  //     }, 30000);
  //     it('assign user to group', async () => {

  //       const result = await rbac.assignUserToGroup({
  //         groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
  //         userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
  //       });
  //       expect(typeof result.message).toBe('string');
  //       expect(result.message).toContain('Successfully assign user');
  //     }, 30500);

  //     it('disable group', async () => {
  //       const result = await rbac.disableGroup({
  //         groupId: 'aab917ba-5bc3-4694-8bc5-600522bd',
  //       });
  //       expect(typeof result.message).toBe('string');
  //       expect(result.message).toContain('Successfully disable group');
  //     }, 30000);
  //   });

  //   describe.skip(' Permissions ', () => {
  //     let permissionId: string;
  //     it('create new permission', async () => {
  //       const permissionName = 'rohan';
  //       const result = await rbac.createPermission({
  //         permissionName: permissionName,
  //       });
  //       permissionId = result.permissionId;
  //       expect(typeof result.permissionId).toBe('string');
  //     }, 30000);

  //     it('fetch permission', async () => {
  //       const result = await rbac.fetchPermission({
  //         permissionId: permissionId,
  //         owner: alice.address,
  //       });
  //       expect(typeof result.id).toBe('string');
  //       expect(typeof result.enabled).toBe('boolean');
  //       expect(typeof result.name).toBe('string');
  //     });

  //     it('assign permission to role', async () => {
  //       const result = await rbac.assignPermissionToRole({
  //         permissionId: '13a4b3c9-6317-4f3f-869a-409669fd',
  //         roleId: '0db8f02b-cbc3-44ed-b97b-9eb932d1',
  //       });
  //       expect(typeof result.message).toBe('string');
  //       expect(result.message).toContain('Successfully assign permission');
  //     }, 30000);

  //     it('disable permission', async () => {
  //       const result = await rbac.disablePermission({
  //         permissionId: 'bcbnmcbhdjjsgjgyhhkhkhjhfgbypotr',
  //       });
  //       expect(typeof result.message).toBe('string');
  //       expect(result.message).toContain('Successfully disable permission');
  //     }, 30000);

  //     it('fetch group permission', async () => {
  //       const result = await rbac.fetchGroupPermissions({
  //         groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
  //         owner: alice.address,
  //       });
  //       if (result.length > 0) {
  //         expect(typeof result[0].id).toBe('string');
  //         expect(typeof result[0].name).toBe('string');
  //         expect(typeof result[0].enabled).toBe('boolean');
  //       }
  //     });

  //     it('fetch user permission', async () => {
  //       const result = await rbac.fetchUserPermissions({
  //         userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
  //         owner: alice.address,
  //       });
  //       if (result.length > 0) {
  //         expect(typeof result[0].id).toBe('string');
  //         expect(typeof result[0].name).toBe('string');
  //         expect(typeof result[0].enabled).toBe('boolean');
  //       }
  //     });

  //     it('fetch user roles', async () => {
  //       const result = await rbac.fetchUserRoles({
  //         userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
  //         owner: alice.address,
  //       });
  //       if (result.length > 0) {
  //         expect(typeof result[0].role).toBe('string');
  //         expect(typeof result[0].user).toBe('string');
  //       }
  //     });

  //     it('update role name', async () => {
  //       const result = await rbac.updateRole({
  //         roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
  //         name: 'rohan-latest-again',
  //       });
  //       expect(result.message).toContain('Successfully update role');
  //     }, 30000);

  //     it('unassign role to user', async () => {
  //       const result = await rbac.unassignRoleToUser({
  //         roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
  //         userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
  //       });
  //       expect(result.message).toContain('Successfully unassign user');
  //     }, 30000);
  //   });
  // });