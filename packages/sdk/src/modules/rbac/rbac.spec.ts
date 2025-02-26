import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { unsubscribeRuntimeVersion } from '../../utils';
import { RBAC } from './index';
import { EvmTransaction } from './evm_interface_rbac';
import { ChainType } from '../../types';



import { Main as SDK } from '../main';

const BASE_URL_HTTPS = process.env['BASE_URL_HTTPS'] as string;
const BASE_URL_WSS = process.env['BASE_URL_WSS'] as string;

const EVM_ADDRESS = process.env['EVM_ADDRESS'] as string;
const ETH_PRIVATE = process.env['ETH_PRIVATE'] as string;


const BASE_URL = process.env['NX_NETWORK_BASE_URL'] as string;

describe.skip('RBAC', () => {
  describe('EVM Tests', () => {
    it.skip('createRole()', async () => {
      const roleName = "role-name-123";
      const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
      const tx = await sdk.rbac.createRole({roleName: roleName}) as EvmTransaction;
      const receipt = await SDK.sendEvmTx({tx: tx, baseUrl: BASE_URL_HTTPS, seed: ETH_PRIVATE});
      console.log(receipt);
    }, 50000);
    it('fetchRole()', async() => {
      const knownId = "b57e9905-7811-437e-9459-94a61e59";
      const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
      const response = await sdk.rbac.fetchRole({owner: EVM_ADDRESS, roleId: knownId, chain: 'agung'});
      console.log(response);
    });
    it('fetchRoles()', async() => {
      const sdk = await SDK.createInstance({chainType: ChainType.EVM, baseUrl: BASE_URL_HTTPS});
      const response = await sdk.rbac.fetchRoles({owner: EVM_ADDRESS, chain: 'agung'});
      console.log(response);
    });
  });




  describe.skip('Substrate Tests', () => {

  let api: ApiPromise;
  let keyring: Keyring;
  let alice: KeyringPair;
  let rbac: RBAC;
  let groupId: string;

  beforeAll(async () => {
    const provider = new WsProvider(BASE_URL);
    api = await ApiPromise.create({ provider, noInitWarn: true });
    keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    rbac = new RBAC(api, { pair: alice, baseUrl: BASE_URL });
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
      });
      console.log('==result==', result);
      expect(typeof result.message).toBe('string');
      expect(result.message).toContain('Successfully assign role');
    }, 30000);

    it('disable role', async () => {
      const result = await rbac.disableRole({
        roleId: '90cee651-c907-4fa9-8852-391533c0',
      });
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
        const result = await rbac.createNewGroup({
          groupName: name,
          address: alice.address,
        });
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
        });
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully assign role');
      }, 30000);
      it('assign user to group', async () => {
        const result = await rbac.assignUserToGroup({
          groupId: '5bff002a-926d-4e08-88d5-1e7304a2',
          userId: alice.address,
        });
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully assign user');
      }, 30000);

      it('disable group', async () => {
        const result = await rbac.disableGroup({
          groupId: 'aab917ba-5bc3-4694-8bc5-600522bd',
        });
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
        });
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
        });
        expect(typeof result.message).toBe('string');
        expect(result.message).toContain('Successfully assign permission');
      }, 30000);

      it('disable permission', async () => {
        const result = await rbac.disablePermission({
          permissionId: 'bcbnmcbhdjjsgjgyhhkhkhjhfgbypotr',
        });
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
          name: 'rohan-latest-again',
        });
        expect(result.message).toContain('Successfully update role');
      }, 30000);

      it('unassign role to user', async () => {
        const result = await rbac.unassignRoleToUser({
          roleId: 'a840f481-614a-4f37-bcd6-f7c93c39',
          userId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHp',
        });
        expect(result.message).toContain('Successfully unassign user');
      }, 30000);
    });
  });
});
});
