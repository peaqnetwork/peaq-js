export default {
  rpc: {
      read_attribute: {
        description: "Read attribute",
        params: [
          {
            name: "did_account",
            type: "AccountId",
          },
          {
            name: "name",
            type: "Bytes",
          },
          {
            name: "at",
            type: "Option<BlockHash>",
          }
        ],
        type: "Attribute<BlockNumber, Moment>",
      }
  },
  types: {
    "Attribute": {
      name: "Vec<u8>",
      value: "Vec<u8>",
      validity: "BlockNumber",
      created: "Moment",
    },
  },
  typesAlias: {
    "Attribute<BlockNumber, Moment>": "DidAttribute",
  },
};
