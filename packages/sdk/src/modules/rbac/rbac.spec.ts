import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { unsubscribeRuntimeVersion } from '../../utils';
import { RBAC } from './index';

const BASE_URL = process.env['NX_NETWORK_BASE_URL'] as string;

describe('RBAC', () => {
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
    rbac = new RBAC(api, { pair: alice });
  });

  // afterAll(async () => {
  //   await unsubscribeRuntimeVersion(api);
  //   await api?.disconnect();
  // });

  describe('createRole()', () => {
    //   it('should create a new role with auto generated ID', async () => {
    //     const name = 'test-1-create-new-role-rohan-ye';
    //     const result = await rbac.createRole({ name, address: alice.address });
    //     expect(result.hash).toBeDefined();
    //     expect(typeof result.id).toBe('string');
    //   });

    //   it('should create a new role with coustom id ID', async () => {
    //     const name = 'test-1-create-coustom-roleID-rohan-ye';
    //     const result = await rbac.createRole({
    //       name,
    //       address: alice.address,
    //       id: 'bcmnxbncvbnxvcnbvxnbcvnxbvchvchvxchgvchgvxcnbv',
    //     });
    //     expect(result.hash).toBeDefined();
    //     expect(typeof result.id).toBe('string');
    //   });

    //   it('should throw an error if name is not provided', async () => {
    //     await expect(
    //       rbac.createRole({ address: alice.address, name: '' })
    //     ).rejects.toThrow('Name is required');
    //   });
    // });

    // describe('fetchRoles()', () => {
    //   it('should throw an error when owner address is not provided', async () => {
    //     await expect(rbac.fetchRoles('')).rejects.toThrow(
    //       'Invalid owner address'
    //     );
    //   });

    //   it('should fetch roles', async () => {
    //     const response = await rbac.fetchRoles(alice.address);
    //     expect(typeof response).toBe('object');
    //     if (response.length > 0) {
    //       expect(typeof response[0].id).toBe('string');
    //       expect(typeof response[0].name).toBe('string');
    //       expect(typeof response[0].enabled).toBe('boolean');
    //     }
    //   });
    describe('createNewGroup()', () => {
      it('create new group', async () => {
        const name = 'test-2-create-new-group-ye-roh';
        const result = await rbac.createNewGroup({ groupName: name, address: alice.address});
        groupId = result.groupId
        expect(result.hash).toBeDefined();
        expect(typeof result.groupId).toBe('string');
      }, 30000);

      it('fetch group()', async () => {
        const response = await rbac.fetchGroup({groupId: groupId, owner: alice.address})
        expect(typeof response.id).toBe("string")
        expect(typeof response.name).toBe("string")
        expect(typeof response.enabled).toBe("boolean")
      });

      it('fetch group permission()', async () => {
        const response = await rbac.fetchGroupPermissions({groupId: groupId, owner: alice.address})
      });

      it('fetch group roles()', async () => {
        const response = await rbac.fetchGroupRoles({groupId: groupId, owner: alice.address})
      });
    }, )
  });
});
