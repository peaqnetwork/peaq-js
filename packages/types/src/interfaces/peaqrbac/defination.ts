export default {
  rpc: {
    fetch_roles: {
      description: 'Fetch Roles',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
      ],
      type: 'Entity<EntityId>',
    },
    fetch_role: {
      description: 'Fetch Role',
      params: [
        {
          name: 'account',
          type: 'AccountId',
        },
        {
          name: 'entity',
          type: 'EntityId',
        },
      ],
      type: 'Entity<EntityId>',
    },
    fetch_user_roles: {
      description: 'Fetch Role',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: 'user_id',
          type: 'EntityId',
        },
      ],
      type: 'Role2User<EntityId>',
    },

    fetch_permission: {
      description: 'Fetch Permission',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: ' permission_id',
          type: 'EntityId',
        },
      ],
      type: 'Entity<EntityId>',
    },

    fetch_permissions: {
      description: 'Fetch Permissions',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
      ],
      type: 'Entity<EntityId>',
    },

    fetch_role_permissions: {
      description: 'Fetch Role Permissions',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: ' role_id',
          type: 'EntityId',
        },
      ],
      type: 'Permission2Role<EntityId>',
    },

    fetch_group: {
      description: 'Fetch Group',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: 'group_id',
          type: 'EntityId',
        },
      ],
      type: 'Entity<EntityId>',
    },

    fetch_groups: {
      description: 'Fetch Groups',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
      ],
      type: 'Entity<EntityId>',
    },

    fetch_group_roles: {
      description: 'Fetch Group Roles',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: 'group_id',
          type: 'EntityId',
        },
      ],
      type: 'Role2Group<EntityId>',
    },

    fetch_user_groups: {
      description: 'Fetch User Groups',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: 'user_id',
          type: 'EntityId',
        },
      ],
      type: 'User2Group<EntityId>',
    },

    fetch_user_permissions: {
      description: 'Fetch User Permissions',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: 'user_id',
          type: 'EntityId',
        },
      ],
      type: 'Entity<EntityId>',
    },

    fetch_group_permissions: {
      description: 'Fetch Group Permissions',
      params: [
        {
          name: 'owner',
          type: 'AccountId',
        },
        {
          name: 'group_id',
          type: 'EntityId',
        },
      ],
      type: 'Entity<EntityId>',
    }
  },
  types: {
    EntityId: '[u8; 32]',
    Entity: {
      id: 'EntityId',
      name: 'Vec<u8>',
      enabled: 'bool',
    },
    Role2User: {
        role: "EntityId",
        user: "EntityId"
    },
    Permission2Role: {
      permission: "EntityId",
      role: "EntityId"
    },
    Role2Group: {
      role: "EntityId",
      group: "EntityId"
    },
    User2Group: {
      user: "EntityId",
      group: "EntityId"
    }
  },
};
