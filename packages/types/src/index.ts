import { OverrideBundleDefinition } from "@polkadot/types/types";
import { ApiOptions } from "@polkadot/api/types";

import * as definitions from "./interfaces/definitions";

import "./interfaces/augment-api";
import "./interfaces/augment-api-consts";
import "./interfaces/augment-api-errors";
import "./interfaces/augment-api-events";
import "./interfaces/augment-api-query";
import "./interfaces/augment-api-rpc";
import "./interfaces/augment-api-tx";
import "./interfaces/augment-types";
import "./interfaces/augment-api-runtime";

export const mTypes = Object.values(definitions).reduce(
  (res: Record<string, any>, { types }): Record<string, any> => ({
    ...res,
    ...types
  }),
  {}
);

export const mRpc = {
  PeaqDID: {
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
        },
      ],
      type: "Attribute<BlockNumber, Moment>",
    },
  },
};

export const typesBundleForPolkadotApps: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: mTypes
    }
  ],
  rpc: mRpc
};

export const defaultOptions: ApiOptions = {
  types: mTypes,
  rpc: mRpc
};

export const options = ({
  types = {},
  rpc = {},
  ...otherOptions
}: ApiOptions = {}): ApiOptions => ({
  types: {
    ...mTypes,
    ...types
  },
  rpc: {
    ...mRpc,
    ...rpc
  },
  ...otherOptions
});
