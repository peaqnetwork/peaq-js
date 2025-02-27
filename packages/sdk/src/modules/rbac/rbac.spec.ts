import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { unsubscribeRuntimeVersion } from '../../utils';
import { RBAC } from './index';
import { ChainType } from '../../types';

import { Main as Sdk } from '../main';

// agung public urls
const RPC_AGNG_PUBLIC_BASE_URL = process.env['RPC_AGNG_PUBLIC_BASE_URL'] as string;
const WSS_AGNG_PUBLIC_BASE_URL = process.env['WSS_AGNG_PUBLIC_BASE_URL'] as string;

// agung on-finality private urls
const RPC_AGNG_ONFIN_PRIVATE_BASE_URL = process.env['RPC_AGNG_ONFIN_PRIVATE_BASE_URL'] as string;
const WSS_AGNG_ONFIN_PRIVATE_BASE_URL = process.env['WSS_AGNG_ONFIN_PRIVATE_BASE_URL'] as string;

// peaq public urls 
const RPC_PEAQ_PUBLIC_BASE_URL = process.env['RPC_PEAQ_PUBLIC_BASE_URL'] as string;
const WSS_PEAQ_PUBLIC_BASE_URL = process.env['WSS_PEAQ_PUBLIC_BASE_URL'] as string;

// peaq on-finality private urls
const RPC_PEAQ_ONFIN_PRIVATE_BASE_URL = process.env['RPC_PEAQ_ONFIN_PRIVATE_BASE_URL'] as string;
const WSS_PEAQ_ONFIN_PUBLIC_BASE_URL = process.env['WSS_PEAQ_ONFIN_PUBLIC_BASE_URL'] as string;

// peaq quick-node private urls
const RPC_PEAQ_QN_PRIVATE_BASE_URL = process.env['RPC_PEAQ_QN_PRIVATE_BASE_URL'] as string;
const WSS_PEAQ_QN_PRIVATE_BASE_URL = process.env['WSS_PEAQ_QN_PRIVATE_BASE_URL'] as string;


const BASE_URL_HTTPS = RPC_PEAQ_PUBLIC_BASE_URL;
const BASE_URL_WSS = WSS_PEAQ_PUBLIC_BASE_URL;

const EVM_ADDRESS = process.env['EVM_ADDRESS'] as string;
const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;

describe('RBAC', () => {
  // Known IDs for current EVM_ADDRESS:
  // peaqKnownRole = "e09fe342-f8ee-46d1-82e2-a60a5b6e";
  // peaqKnownGroup = "eda650fa-ec62-4d09-849b-b66c7771";
  // peaqKnownPermission = "88dec9d0-354e-4ab6-9856-7a7eb45c";

  // TO TEST:
  // - Role to Group -> WORKS
  // - User to Group -> WORKS
  // - disableGroup() -> WORKS
  // - disablePermission() -> WORKS
  // - disableRole() -> WORKS
  // - updateGroup() -> WORKS
  // - updatePermission() -> WORKS
  // - updateRole() -> WORKS
  // - Fetch user permissions -> WORKS
  // - Fetch group permissions -> WORKS

  // TODO: Update to all use 'class' and interfaces

  // no delete functions. What about enable in precompiles???
  describe('EVM Tests', () => {
    describe('Role Tests', () => {
      it.skip('createRole()', async () => {
        const roleName = "role-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.rbac.createRole({roleName: roleName});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
      }, 50000);
      it.skip('Role to Group', async () => {
        const peaqKnownRole = "e09fe342-f8ee-46d1-82e2-a60a5b6e";
        const peaqKnownGroup = "eda650fa-ec62-4d09-849b-b66c7771";

        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        // assign role to group
        const tx = await sdk.rbac.assignRoleToGroup({groupId: peaqKnownGroup, roleId: peaqKnownRole});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // fetch group roles
        const response = await sdk.rbac.fetchGroupRoles({owner: EVM_ADDRESS, groupId: peaqKnownGroup, wssBaseUrl: BASE_URL_WSS});
        console.log(response);

        // unassign role to group
        const tx2 = await sdk.rbac.unassignRoleToGroup({groupId: peaqKnownGroup, roleId: peaqKnownRole});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        
        // fetch role groups & make sure it is not present
        const response2 = await sdk.rbac.fetchGroupRoles({owner: EVM_ADDRESS, groupId: peaqKnownGroup, wssBaseUrl: BASE_URL_WSS});
        console.log(response2);

        // console.log(receipt);
      }, 50000);

      // todo something weird happening here
      it.skip('Role to User', async () => {
        const peaqKnownRole = "e09fe342-f8ee-46d1-82e2-a60a5b6e";
        const userId = "ada650fa-ec62-4d09-849b-b66c1111";

        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        // assign role to user
        const tx = await sdk.rbac.assignRoleToUser({userId: userId, roleId: peaqKnownRole});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // fetch group roles
        const response = await sdk.rbac.fetchUserRoles({owner: EVM_ADDRESS, userId: userId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);

        // unassign user roles
        const tx2 = await sdk.rbac.unassignRoleToUser({userId: userId, roleId: peaqKnownRole});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        
        // fetch user roles & make sure it is not present
        const response2 = await sdk.rbac.fetchUserRoles({owner: EVM_ADDRESS, userId: userId, wssBaseUrl: BASE_URL_WSS});
        console.log(response2);

        // console.log(receipt);
      }, 50000);
      it.skip('fetchRole()', async() => {
        const peaqKnownRole = "e09fe342-f8ee-46d1-82e2-a60a5b6e";
        // const agungKnownRole = "5459bbdb-0179-4b28-8432-83c5ed39";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const response = await sdk.rbac.fetchRole({owner: EVM_ADDRESS, roleId: peaqKnownRole, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      });
      it.skip('fetchRoles()', async() => {
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const response = await sdk.rbac.fetchRoles({owner: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      });
      it.skip('create then disableRole()', async () => {
        const roleName = "role-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const txRole = await sdk.rbac.createRole({roleName: roleName});
        const receipt = await Sdk.sendEvmTx({tx: txRole.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        const tx2 = await sdk.rbac.disableRole({roleId: txRole.roleId});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        const response = await sdk.rbac.fetchRole({owner: EVM_ADDRESS, roleId: txRole.roleId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      }, 50000);
      it.skip('create role then updateRole()', async () => {
        const roleName = "role-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        const txRole = await sdk.rbac.createRole({roleName: roleName});
        const receipt = await Sdk.sendEvmTx({tx: txRole.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        const response = await sdk.rbac.fetchRole({owner: EVM_ADDRESS, roleId: txRole.roleId, wssBaseUrl: BASE_URL_WSS});
        console.log('old role', response);

        const name = "My New Role Name"
        const tx = await sdk.rbac.updateRole({roleName: name, roleId: txRole.roleId});
        const receipt2 = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // read to make sure it was updated
        const response2 = await sdk.rbac.fetchRole({owner: EVM_ADDRESS, roleId: txRole.roleId, wssBaseUrl: BASE_URL_WSS});
        console.log('role permission', response2);
      }, 50000);
    });
    describe('Group Tests', () => {
      it.skip('createGroup()', async () => {
        const groupName = "group-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.rbac.createGroup({groupName: groupName});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        console.log(receipt);
      }, 50000);
      it.skip('fetchGroup()', async() => {
        const peaqKnownGroup = "eda650fa-ec62-4d09-849b-b66c7771";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const response = await sdk.rbac.fetchGroup({owner: EVM_ADDRESS, groupId: peaqKnownGroup, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      });
      it.skip('fetchGroups()', async() => {
        console.log(BASE_URL_WSS);
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const response = await sdk.rbac.fetchGroups({owner: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      });
      it.skip('create then disableGroup()', async () => {
        const groupName = "group-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const txGroup = await sdk.rbac.createGroup({groupName: groupName});
        const receipt = await Sdk.sendEvmTx({tx: txGroup.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        const tx2 = await sdk.rbac.disableGroup({groupId: txGroup.groupId});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // read to make sure disabled
        const response = await sdk.rbac.fetchGroup({owner: EVM_ADDRESS, groupId: txGroup.groupId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      }, 50000);
      it.skip('create group then updateGroup()', async () => {
        const groupName = "group-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        const txGroup = await sdk.rbac.createGroup({groupName: groupName});
        const receipt = await Sdk.sendEvmTx({tx: txGroup.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        const response = await sdk.rbac.fetchGroup({owner: EVM_ADDRESS, groupId: txGroup.groupId, wssBaseUrl: BASE_URL_WSS});
        console.log('old group', response);

        const name = "My New Group Name"
        const tx = await sdk.rbac.updateGroup({groupName: name, groupId: txGroup.groupId});
        const receipt2 = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // read to make sure it was updated
        const response2 = await sdk.rbac.fetchGroup({owner: EVM_ADDRESS, groupId: txGroup.groupId, wssBaseUrl: BASE_URL_WSS});
        console.log('updated group', response2);
      }, 50000);
      it('Fetch group permissions', async() => {
  // - Fetch user permissions -> assign permission to role, then role to user, then can fetch
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        // create permission
        const permissionName = "permission-name-1234";
        const txPermission = await sdk.rbac.createPermission({permissionName: permissionName});
        await Sdk.sendEvmTx({tx: txPermission.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // create role
        const roleName = "role-name-1234";
        const txRole = await sdk.rbac.createRole({roleName: roleName});
        await Sdk.sendEvmTx({tx: txRole.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // assign permission to role
        const tx = await sdk.rbac.assignPermissionToRole({permissionId: txPermission.permissionId, roleId: txRole.roleId});
        await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // create group
        const groupName = "group-name-1234";
        const txGroup = await sdk.rbac.createGroup({groupName: groupName});
        await Sdk.sendEvmTx({tx: txGroup.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // assign role to group
        const tx2 = await sdk.rbac.assignRoleToGroup({groupId: txGroup.groupId, roleId: txRole.roleId});
        await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // now fetch
        const response = await sdk.rbac.fetchGroupPermissions({owner: EVM_ADDRESS, groupId: txGroup.groupId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      }, 100000);
    });

    describe('Permission Tests', () => {
      it.skip('createPermission()', async () => {
        const permissionName = "Permission-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const tx = await sdk.rbac.createPermission({permissionName: permissionName});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        console.log(receipt);
      }, 50000);
      it.skip('Permission to role', async () => {
        const peaqKnownRole = "e09fe342-f8ee-46d1-82e2-a60a5b6e";
        const peaqKnownPermission = "88dec9d0-354e-4ab6-9856-7a7eb45c";

        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        // assign permissions to role 
        const tx = await sdk.rbac.assignPermissionToRole({permissionId: peaqKnownPermission, roleId: peaqKnownRole});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // fetch role permissions
        const response = await sdk.rbac.fetchRolePermissions({owner: EVM_ADDRESS, roleId: peaqKnownRole, wssBaseUrl: BASE_URL_WSS});
        console.log(response);

        // unassign role permissions
        const tx2 = await sdk.rbac.unassignPermissionToRole({permissionId: peaqKnownPermission, roleId: peaqKnownRole});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        
        // fetch role permissions & make sure it is not present
        const response2 = await sdk.rbac.fetchRolePermissions({owner: EVM_ADDRESS, roleId: peaqKnownRole, wssBaseUrl: BASE_URL_WSS});
        console.log(response2);

        // console.log(receipt);
      }, 50000);
      it.skip('fetchPermission()', async() => {
        const peaqKnownPermission = "88dec9d0-354e-4ab6-9856-7a7eb45c";
        // const agungKnownPermission = "88dec9d0-354e-4ab6-9856-7a7eb45c";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const response = await sdk.rbac.fetchPermission({owner: EVM_ADDRESS, permissionId: peaqKnownPermission, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      });
      it.skip('fetchPermissions()', async() => {
        console.log(BASE_URL_WSS);
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const response = await sdk.rbac.fetchPermissions({owner: EVM_ADDRESS, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      });
      it.skip('create then disablePermission()', async () => {
        const permissionName = "permission-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
        const txPermission = await sdk.rbac.createPermission({permissionName: permissionName});
        const receipt = await Sdk.sendEvmTx({tx: txPermission.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        const tx2 = await sdk.rbac.disablePermission({permissionId: txPermission.permissionId});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        const response = await sdk.rbac.fetchPermission({owner: EVM_ADDRESS, permissionId: txPermission.permissionId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      }, 50000);
      it.skip('create permission then updatePermission()', async () => {
        const permissionName = "permission-name-123";
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        const txPermission = await sdk.rbac.createPermission({permissionName: permissionName});
        const receipt = await Sdk.sendEvmTx({tx: txPermission.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
        const response = await sdk.rbac.fetchPermission({owner: EVM_ADDRESS, permissionId: txPermission.permissionId, wssBaseUrl: BASE_URL_WSS});
        console.log('old permission', response);

        const name = "My New Permission Name"
        const tx = await sdk.rbac.updatePermission({permissionName: name, permissionId: txPermission.permissionId});
        const receipt2 = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // read to make sure it was updated
        const response2 = await sdk.rbac.fetchPermission({owner: EVM_ADDRESS, permissionId: txPermission.permissionId, wssBaseUrl: BASE_URL_WSS});
        console.log('updated permission', response2);
      }, 50000);
    });
    describe('User Tests', () => {
      it.skip('User to Group', async() => {
        // TODO TEST
        const userId = "ada650fa-ec62-4d09-849b-b66c1111";
        const peaqKnownGroup = "eda650fa-ec62-4d09-849b-b66c7771";

        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        // assign user to group 
        const tx = await sdk.rbac.assignUserToGroup({userId: userId, groupId: peaqKnownGroup});
        const receipt = await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // fetch user groups
        const response = await sdk.rbac.fetchUserGroups({owner: EVM_ADDRESS, userId: userId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);

        // unassign user groups
        const tx2 = await sdk.rbac.unassignUserToGroup({userId: userId, groupId: peaqKnownGroup});
        const receipt2 = await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // fetch user group & make sure it is not present
        const response2 = await sdk.rbac.fetchUserGroups({owner: EVM_ADDRESS, userId: userId, wssBaseUrl: BASE_URL_WSS});
        console.log(response2);
      }, 50000);
      it.skip('Fetch user permissions', async() => {
  // - Fetch user permissions -> assign permission to role, then role to user, then can fetch
        const sdk = await Sdk.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});

        // create permission
        const permissionName = "permission-name-1234";
        const txPermission = await sdk.rbac.createPermission({permissionName: permissionName});
        await Sdk.sendEvmTx({tx: txPermission.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // create role
        const roleName = "role-name-1234";
        const txRole = await sdk.rbac.createRole({roleName: roleName});
        await Sdk.sendEvmTx({tx: txRole.tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // assign permission to role
        const tx = await sdk.rbac.assignPermissionToRole({permissionId: txPermission.permissionId, roleId: txRole.roleId});
        await Sdk.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // // assign role to user
        const userId = "ada650fa-ec62-4d09-849b-b66c1111";
        const tx2 = await sdk.rbac.assignRoleToUser({userId: userId, roleId: txRole.roleId});
        await Sdk.sendEvmTx({tx: tx2, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});

        // now fetch
        const response = await sdk.rbac.fetchUserPermissions({owner: EVM_ADDRESS, userId: userId, wssBaseUrl: BASE_URL_WSS});
        console.log(response);
      }, 80000);
    });
  });




  describe.skip('Substrate Tests', () => {

  let api: ApiPromise;
  let keyring: Keyring;
  let alice: KeyringPair;
  let rbac: RBAC;
  let groupId: string;

  beforeAll(async () => {
    const provider = new WsProvider(BASE_URL_WSS);
    api = await ApiPromise.create({ provider, noInitWarn: true });
    keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    rbac = new RBAC(api, { pair: alice, baseUrl: BASE_URL_WSS });
  });

  afterAll(async () => {
    await unsubscribeRuntimeVersion(api);
    await api?.disconnect();
  });

  describe(' Role ', () => {
    it('should create a new role with auto generated ID', async () => {
      const name = 'test-1-create-new-role-rohan-ye';
      const result = await rbac.createRole({
        roleName: name,
        address: alice.address,
      });
      // expect(typeof result.roleId).toBe('string');
    });

    it('should create a new role with coustom id ID', async () => {
      const name = 'test-1-create-coustom-roleID-rohan-ye';
      const result = await rbac.createRole({
        roleName: name,
        address: alice.address,
        roleId: 'bcmnxbncvbnxvcnbvxnbcvnxbvchvchvxchgvchgvxcnbv',
      });
      // expect(typeof result.roleId).toBe('string');
    });

    it('should throw an error if name is not provided', async () => {
      await expect(
        rbac.createRole({ address: alice.address, roleName: '' })
      ).rejects.toThrow('Name is required');
    });

    it('assign role to user', async () => {
      const result = await rbac.assignRoleToUser({
        roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
        userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
      }) as {
        message: string;
      };
      console.log('==result==', result);
      expect(typeof result.message).toBe('string');
      expect(result.message).toContain('Successfully assign role');
    }, 30000);

    it('disable role', async () => {
      const result = await rbac.disableRole({
        roleId: '90cee651-c907-4fa9-8852-391533c0',
      }) as { message: string };
      expect(typeof result.message).toBe('string');
      expect(result.message).toContain('Successfully disable role');
    }, 30000);
  });

  describe('fetchRoles()', () => {
    // it('should throw an error when owner address is not provided', async () => {
    //   await expect(rbac.fetchRoles('')).rejects.toThrow(
    //     'Invalid owner address'
    //   );
    // });

    // it('should fetch roles', async () => {
    //   const response = await rbac.fetchRoles(alice.address);
    //   expect(typeof response).toBe('object');
    //   if (response.length > 0) {
    //     expect(typeof response[0].id).toBe('string');
    //     expect(typeof response[0].name).toBe('string');
    //     expect(typeof response[0].enabled).toBe('boolean');
    //   }
    // });
    describe(' Group ', () => {
      it('create new group', async () => {
        const name = 'rohan-group';
        const result = await rbac.createGroup({
          groupName: name,
          address: alice.address,
        }) as {
          groupId: string;
        };
        groupId = result.groupId;
        expect(typeof result.groupId).toBe('string');
      }, 30000);

      it('fetch group()', async () => {
        const response = await rbac.fetchGroup({
          groupId: groupId,
          owner: alice.address,
        });
        expect(typeof response.id).toBe('string');
        expect(typeof response.name).toBe('string');
        expect(typeof response.enabled).toBe('boolean');
      });

      it('fetch group permission()', async () => {
        const response = await rbac.fetchGroupPermissions({
          groupId: groupId,
          owner: alice.address,
        });
      });

      it('fetch group roles()', async () => {
        const response = await rbac.fetchGroupRoles({
          groupId: groupId,
          owner: alice.address,
        });
      });

      it('assign role to group', async () => {
        const result = await rbac.assignRoleToGroup({
          groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
          roleId: '0db8f02b-cbc3-44ed-b97b-9eb932d1',
        }) as { message: string};
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully assign role');
      }, 30000);
      it('assign user to group', async () => {
        const result = await rbac.assignUserToGroup({
          groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
          userId: alice.address,
        }) as {
          message: string;
        };
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully assign user');
      }, 30000);

      it('disable group', async () => {
        const result = await rbac.disableGroup({
          groupId: 'aab917ba-5bc3-4694-8bc5-600522bd',
        }) as { message: string };
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully disable group');
      }, 30000);
    });

    describe(' Permissions ', () => {
      let permissionId: string;
      it('create new permission', async () => {
        const permissionName = 'rohan';
        const result = await rbac.createPermission({
          permissionName: permissionName,
        })as {
          permissionId: string;
        };
        permissionId = result.permissionId;
        expect(typeof result.permissionId).toBe('string');
      }, 30000);

      it('fetch permission', async () => {
        const result = await rbac.fetchPermission({
          permissionId: permissionId,
          owner: alice.address,
        });
        expect(typeof result.id).toBe('string');
        expect(typeof result.enabled).toBe('boolean');
        expect(typeof result.name).toBe('string');
      });

      it('assign permission to role', async () => {
        const result = await rbac.assignPermissionToRole({
          permissionId: '13a4b3c9-6317-4f3f-869a-409669fd',
          roleId: '0db8f02b-cbc3-44ed-b97b-9eb932d1',
        })as {
          message: string;
        };
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully assign permission');
      }, 30000);

      it('disable permission', async () => {
        const result = await rbac.disablePermission({
          permissionId: 'bcbnmcbhdjjsgjgyhhkhkhjhfgbypotr',
        }) as { message: string };
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully disable permission');
      }, 30000);

      it('fetch group permission', async () => {
        const result = await rbac.fetchGroupPermissions({
          groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
          owner: alice.address,
        });
        if (result.length > 0) {
          expect(typeof result[0].id).toBe('string');
          expect(typeof result[0].name).toBe('string');
          expect(typeof result[0].enabled).toBe('boolean');
        }
      });

      it('fetch user permission', async () => {
        const result = await rbac.fetchUserPermissions({
          userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
          owner: alice.address,
        });
        if (result.length > 0) {
          expect(typeof result[0].id).toBe('string');
          expect(typeof result[0].name).toBe('string');
          expect(typeof result[0].enabled).toBe('boolean');
        }
      });

      it('fetch user roles', async () => {
        const result = await rbac.fetchUserRoles({
          userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
          owner: alice.address,
        });
        if (result.length > 0) {
          expect(typeof result[0].role).toBe('string');
          expect(typeof result[0].user).toBe('string');
        }
      });

      it('update role name', async () => {
        const result = await rbac.updateRole({
          roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
          roleName: 'rohan-latest-again',
        }) as { message: string };
        expect(result.message).toContain('Successfully update role');
      }, 30000);

      it('unassign role to user', async () => {
        const result = await rbac.unassignRoleToUser({
          roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
          userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
        }) as {
          message: string;
        };
        expect(result.message).toContain('Successfully unassign user');
      }, 30000);
    });
  });
});
});
