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
    }
  },
};
