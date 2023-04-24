// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/events';

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types';
import type { Bytes, Null, Option, Result, U256, U8aFixed, Vec, u128, u32, u64, u8 } from '@polkadot/types-codec';
import type { AccountId32, H160, H256, Permill, Perquintill, WeightV1 } from '@polkadot/types/interfaces/runtime';
import type { EthereumLog, EvmCoreErrorExitReason, FrameSupportTokensMiscBalanceStatus, FrameSupportWeightsDispatchInfo, PalletBlockRewardRewardDistributionConfig, PalletMultisigTimepoint, PeaqPalletDidStructsAttribute, PeaqPalletRbacStructsEntity, PeaqPalletRbacStructsPermission2Role, PeaqPalletRbacStructsRole2Group, PeaqPalletRbacStructsRole2User, PeaqPalletRbacStructsUser2Group, PeaqPalletTransactionStructsDeliveredInfo, PeaqPrimitivesXcmCurrencyCurrencyId, SpRuntimeDispatchError, XcmV1MultiAsset, XcmV1MultiLocation, XcmV1MultiassetMultiAssets, XcmV2Response, XcmV2TraitsError, XcmV2TraitsOutcome, XcmV2Xcm, XcmVersionedMultiAssets, XcmVersionedMultiLocation } from '@polkadot/types/lookup';

export type __AugmentedEvent<ApiType extends ApiTypes> = AugmentedEvent<ApiType>;

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    balances: {
      /**
       * A balance was set by root.
       **/
      BalanceSet: AugmentedEvent<ApiType, [who: AccountId32, free: u128, reserved: u128], { who: AccountId32, free: u128, reserved: u128 }>;
      /**
       * Some amount was deposited (e.g. for transaction fees).
       **/
      Deposit: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * An account was removed whose balance was non-zero but below ExistentialDeposit,
       * resulting in an outright loss.
       **/
      DustLost: AugmentedEvent<ApiType, [account: AccountId32, amount: u128], { account: AccountId32, amount: u128 }>;
      /**
       * An account was created with some free balance.
       **/
      Endowed: AugmentedEvent<ApiType, [account: AccountId32, freeBalance: u128], { account: AccountId32, freeBalance: u128 }>;
      /**
       * Some balance was reserved (moved from free to reserved).
       **/
      Reserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some balance was moved from the reserve of the first account to the second account.
       * Final argument indicates the destination balance type.
       **/
      ReserveRepatriated: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus], { from: AccountId32, to: AccountId32, amount: u128, destinationStatus: FrameSupportTokensMiscBalanceStatus }>;
      /**
       * Some amount was removed from the account (e.g. for misbehavior).
       **/
      Slashed: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Transfer succeeded.
       **/
      Transfer: AugmentedEvent<ApiType, [from: AccountId32, to: AccountId32, amount: u128], { from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * Some balance was unreserved (moved from reserved to free).
       **/
      Unreserved: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Some amount was withdrawn from the account (e.g. for transaction fees).
       **/
      Withdraw: AugmentedEvent<ApiType, [who: AccountId32, amount: u128], { who: AccountId32, amount: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    baseFee: {
      BaseFeeOverflow: AugmentedEvent<ApiType, []>;
      NewBaseFeePerGas: AugmentedEvent<ApiType, [fee: U256], { fee: U256 }>;
      NewElasticity: AugmentedEvent<ApiType, [elasticity: Permill], { elasticity: Permill }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    blockReward: {
      /**
       * Setup the block issue reward
       **/
      BlockIssueRewardChanged: AugmentedEvent<ApiType, [u128]>;
      /**
       * Distribution configuration has been updated.
       **/
      DistributionConfigurationChanged: AugmentedEvent<ApiType, [PalletBlockRewardRewardDistributionConfig]>;
      /**
       * Setup the hard cap
       **/
      HardCapChanged: AugmentedEvent<ApiType, [u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    contracts: {
      /**
       * A contract was called either by a plain account or another contract.
       * 
       * # Note
       * 
       * Please keep in mind that like all events this is only emitted for successful
       * calls. This is because on failure all storage changes including events are
       * rolled back.
       **/
      Called: AugmentedEvent<ApiType, [caller: AccountId32, contract: AccountId32], { caller: AccountId32, contract: AccountId32 }>;
      /**
       * A code with the specified hash was removed.
       **/
      CodeRemoved: AugmentedEvent<ApiType, [codeHash: H256], { codeHash: H256 }>;
      /**
       * Code with the specified hash has been stored.
       **/
      CodeStored: AugmentedEvent<ApiType, [codeHash: H256], { codeHash: H256 }>;
      /**
       * A contract's code was updated.
       **/
      ContractCodeUpdated: AugmentedEvent<ApiType, [contract: AccountId32, newCodeHash: H256, oldCodeHash: H256], { contract: AccountId32, newCodeHash: H256, oldCodeHash: H256 }>;
      /**
       * A custom event emitted by the contract.
       **/
      ContractEmitted: AugmentedEvent<ApiType, [contract: AccountId32, data: Bytes], { contract: AccountId32, data: Bytes }>;
      /**
       * A contract delegate called a code hash.
       * 
       * # Note
       * 
       * Please keep in mind that like all events this is only emitted for successful
       * calls. This is because on failure all storage changes including events are
       * rolled back.
       **/
      DelegateCalled: AugmentedEvent<ApiType, [contract: AccountId32, codeHash: H256], { contract: AccountId32, codeHash: H256 }>;
      /**
       * Contract deployed by address at the specified address.
       **/
      Instantiated: AugmentedEvent<ApiType, [deployer: AccountId32, contract: AccountId32], { deployer: AccountId32, contract: AccountId32 }>;
      /**
       * Contract has been removed.
       * 
       * # Note
       * 
       * The only way for a contract to be removed and emitting this event is by calling
       * `seal_terminate`.
       **/
      Terminated: AugmentedEvent<ApiType, [contract: AccountId32, beneficiary: AccountId32], { contract: AccountId32, beneficiary: AccountId32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    cumulusXcm: {
      /**
       * Downward message executed with the given outcome.
       * \[ id, outcome \]
       **/
      ExecutedDownward: AugmentedEvent<ApiType, [U8aFixed, XcmV2TraitsOutcome]>;
      /**
       * Downward message is invalid XCM.
       * \[ id \]
       **/
      InvalidFormat: AugmentedEvent<ApiType, [U8aFixed]>;
      /**
       * Downward message is unsupported version of XCM.
       * \[ id \]
       **/
      UnsupportedVersion: AugmentedEvent<ApiType, [U8aFixed]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    dmpQueue: {
      /**
       * Downward message executed with the given outcome.
       **/
      ExecutedDownward: AugmentedEvent<ApiType, [messageId: U8aFixed, outcome: XcmV2TraitsOutcome], { messageId: U8aFixed, outcome: XcmV2TraitsOutcome }>;
      /**
       * Downward message is invalid XCM.
       **/
      InvalidFormat: AugmentedEvent<ApiType, [messageId: U8aFixed], { messageId: U8aFixed }>;
      /**
       * Downward message is overweight and was placed in the overweight queue.
       **/
      OverweightEnqueued: AugmentedEvent<ApiType, [messageId: U8aFixed, overweightIndex: u64, requiredWeight: WeightV1], { messageId: U8aFixed, overweightIndex: u64, requiredWeight: WeightV1 }>;
      /**
       * Downward message from the overweight queue was executed.
       **/
      OverweightServiced: AugmentedEvent<ApiType, [overweightIndex: u64, weightUsed: WeightV1], { overweightIndex: u64, weightUsed: WeightV1 }>;
      /**
       * Downward message is unsupported version of XCM.
       **/
      UnsupportedVersion: AugmentedEvent<ApiType, [messageId: U8aFixed], { messageId: U8aFixed }>;
      /**
       * The weight limit for handling downward messages was reached.
       **/
      WeightExhausted: AugmentedEvent<ApiType, [messageId: U8aFixed, remainingWeight: WeightV1, requiredWeight: WeightV1], { messageId: U8aFixed, remainingWeight: WeightV1, requiredWeight: WeightV1 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    ethereum: {
      /**
       * An ethereum transaction was successfully executed.
       **/
      Executed: AugmentedEvent<ApiType, [from: H160, to: H160, transactionHash: H256, exitReason: EvmCoreErrorExitReason], { from: H160, to: H160, transactionHash: H256, exitReason: EvmCoreErrorExitReason }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    evm: {
      /**
       * A contract has been created at given address.
       **/
      Created: AugmentedEvent<ApiType, [address: H160], { address: H160 }>;
      /**
       * A contract was attempted to be created, but the execution failed.
       **/
      CreatedFailed: AugmentedEvent<ApiType, [address: H160], { address: H160 }>;
      /**
       * A contract has been executed successfully with states applied.
       **/
      Executed: AugmentedEvent<ApiType, [address: H160], { address: H160 }>;
      /**
       * A contract has been executed with errors. States are reverted with only gas fees applied.
       **/
      ExecutedFailed: AugmentedEvent<ApiType, [address: H160], { address: H160 }>;
      /**
       * Ethereum events from contracts.
       **/
      Log: AugmentedEvent<ApiType, [log: EthereumLog], { log: EthereumLog }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    multiSig: {
      /**
       * A multisig operation has been approved by someone.
       **/
      MultisigApproval: AugmentedEvent<ApiType, [approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed], { approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed }>;
      /**
       * A multisig operation has been cancelled.
       **/
      MultisigCancelled: AugmentedEvent<ApiType, [cancelling: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed], { cancelling: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed }>;
      /**
       * A multisig operation has been executed.
       **/
      MultisigExecuted: AugmentedEvent<ApiType, [approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed, result: Result<Null, SpRuntimeDispatchError>], { approving: AccountId32, timepoint: PalletMultisigTimepoint, multisig: AccountId32, callHash: U8aFixed, result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A new multisig operation has begun.
       **/
      NewMultisig: AugmentedEvent<ApiType, [approving: AccountId32, multisig: AccountId32, callHash: U8aFixed], { approving: AccountId32, multisig: AccountId32, callHash: U8aFixed }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    parachainStaking: {
      /**
       * The length in blocks for future validation rounds has changed.
       * \[round number, first block in the current round, old value, new
       * value\]
       **/
      BlocksPerRoundSet: AugmentedEvent<ApiType, [u32, u32, u32, u32]>;
      /**
       * An account has left the set of collator candidates.
       * \[account, amount of funds un-staked\]
       **/
      CandidateLeft: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * A collator candidate has canceled the process to leave the set of
       * candidates and was added back to the candidate pool. \[collator's
       * account\]
       **/
      CollatorCanceledExit: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * An account was forcedly removed from the  set of collator
       * candidates. \[account, amount of funds un-staked\]
       **/
      CollatorRemoved: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * A collator candidate has started the process to leave the set of
       * candidates. \[round number, collator's account, round number when
       * the collator will be effectively removed from the set of
       * candidates\]
       **/
      CollatorScheduledExit: AugmentedEvent<ApiType, [u32, AccountId32, u32]>;
      /**
       * A collator candidate has decreased the amount of funds at stake.
       * \[collator's account, previous stake, new stake\]
       **/
      CollatorStakedLess: AugmentedEvent<ApiType, [AccountId32, u128, u128]>;
      /**
       * A collator candidate has increased the amount of funds at stake.
       * \[collator's account, previous stake, new stake\]
       **/
      CollatorStakedMore: AugmentedEvent<ApiType, [AccountId32, u128, u128]>;
      /**
       * An account has delegated a new collator candidate.
       * \[account, amount of funds staked, total amount of delegators' funds
       * staked for the collator candidate\]
       **/
      Delegation: AugmentedEvent<ApiType, [AccountId32, u128, AccountId32, u128]>;
      /**
       * A new delegation has replaced an existing one in the set of ongoing
       * delegations for a collator candidate. \[new delegator's account,
       * amount of funds staked in the new delegation, replaced delegator's
       * account, amount of funds staked in the replace delegation, collator
       * candidate's account, new total amount of delegators' funds staked
       * for the collator candidate\]
       **/
      DelegationReplaced: AugmentedEvent<ApiType, [AccountId32, u128, AccountId32, u128, AccountId32, u128]>;
      /**
       * An account has left the set of delegators.
       * \[account, amount of funds un-staked\]
       **/
      DelegatorLeft: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * An account has stopped delegating a collator candidate.
       * \[account, collator candidate's account, old amount of delegators'
       * funds staked, new amount of delegators' funds staked\]
       **/
      DelegatorLeftCollator: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, u128]>;
      /**
       * A delegator has decreased the amount of funds at stake for a
       * collator. \[delegator's account, collator's account, previous
       * delegation stake, new delegation stake\]
       **/
      DelegatorStakedLess: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, u128]>;
      /**
       * A delegator has increased the amount of funds at stake for a
       * collator. \[delegator's account, collator's account, previous
       * delegation stake, new delegation stake\]
       **/
      DelegatorStakedMore: AugmentedEvent<ApiType, [AccountId32, AccountId32, u128, u128]>;
      /**
       * A new account has joined the set of top candidates.
       * \[account\]
       **/
      EnteredTopCandidates: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * A new account has joined the set of collator candidates.
       * \[account, amount staked by the new candidate\]
       **/
      JoinedCollatorCandidates: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * An account was removed from the set of top candidates.
       * \[account\]
       **/
      LeftTopCandidates: AugmentedEvent<ApiType, [AccountId32]>;
      /**
       * The maximum candidate stake has been changed.
       * \[new max amount\]
       **/
      MaxCandidateStakeChanged: AugmentedEvent<ApiType, [u128]>;
      /**
       * The maximum number of collator candidates selected in future
       * validation rounds has changed. \[old value, new value\]
       **/
      MaxSelectedCandidatesSet: AugmentedEvent<ApiType, [u32, u32]>;
      /**
       * A new staking round has started.
       * \[block number, round number\]
       **/
      NewRound: AugmentedEvent<ApiType, [u32, u32]>;
      /**
       * A collator or a delegator has received a reward.
       * \[account, amount of reward\]
       **/
      Rewarded: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Reware rate configuration for future validation rounds has changed.
       * \[collator's reward rate,delegator's reward rate\]
       **/
      RoundRewardRateSet: AugmentedEvent<ApiType, [Perquintill, Perquintill]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    parachainSystem: {
      /**
       * Downward messages were processed using the given weight.
       **/
      DownwardMessagesProcessed: AugmentedEvent<ApiType, [weightUsed: WeightV1, dmqHead: H256], { weightUsed: WeightV1, dmqHead: H256 }>;
      /**
       * Some downward messages have been received and will be processed.
       **/
      DownwardMessagesReceived: AugmentedEvent<ApiType, [count: u32], { count: u32 }>;
      /**
       * An upgrade has been authorized.
       **/
      UpgradeAuthorized: AugmentedEvent<ApiType, [codeHash: H256], { codeHash: H256 }>;
      /**
       * The validation function was applied as of the contained relay chain block number.
       **/
      ValidationFunctionApplied: AugmentedEvent<ApiType, [relayChainBlockNum: u32], { relayChainBlockNum: u32 }>;
      /**
       * The relay-chain aborted the upgrade process.
       **/
      ValidationFunctionDiscarded: AugmentedEvent<ApiType, []>;
      /**
       * The validation function has been scheduled to apply.
       **/
      ValidationFunctionStored: AugmentedEvent<ApiType, []>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    peaqDid: {
      /**
       * Event emitted when an attribute has been added. [who, did_account, name, value, validity]
       **/
      AttributeAdded: AugmentedEvent<ApiType, [AccountId32, AccountId32, Bytes, Bytes, Option<u32>]>;
      /**
       * Event emitted when an attribute is read successfully
       **/
      AttributeRead: AugmentedEvent<ApiType, [PeaqPalletDidStructsAttribute]>;
      /**
       * Event emitted when an attribute has been deleted. [who, did_acount name]
       **/
      AttributeRemoved: AugmentedEvent<ApiType, [AccountId32, AccountId32, Bytes]>;
      /**
       * Event emitted when an attribute has been updated. [who, did_account, name, validity]
       **/
      AttributeUpdated: AugmentedEvent<ApiType, [AccountId32, AccountId32, Bytes, Bytes, Option<u32>]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    peaqMor: {
      /**
       * Get balance-based information
       **/
      BalanceIs: AugmentedEvent<ApiType, [u128]>;
      /**
       * Machine has been rewarded
       **/
      MintedRewards: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Machine owner has been rewarded
       **/
      PayedFromPot: AugmentedEvent<ApiType, [AccountId32, u128]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    peaqRbac: {
      AllGroupsFetched: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsEntity>]>;
      AllPermissionsFetched: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsEntity>]>;
      AllRolesFetched: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsEntity>]>;
      FetchedGroupPermissions: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsEntity>]>;
      FetchedGroupRoles: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsRole2Group>]>;
      FetchedRolePermissions: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsPermission2Role>]>;
      FetchedUserGroups: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsUser2Group>]>;
      FetchedUserPermissions: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsEntity>]>;
      FetchedUserRoles: AugmentedEvent<ApiType, [Vec<PeaqPalletRbacStructsRole2User>]>;
      /**
       * Event emitted when a group has been added. [who, groupId, roleName]
       **/
      GroupAdded: AugmentedEvent<ApiType, [AccountId32, U8aFixed, Bytes]>;
      /**
       * Event emitted when a group has been disabled. [who, groupId]
       **/
      GroupDisabled: AugmentedEvent<ApiType, [AccountId32, U8aFixed]>;
      GroupFetched: AugmentedEvent<ApiType, [PeaqPalletRbacStructsEntity]>;
      /**
       * Event emitted when a group has been updated. [who, groupId, roleName]
       **/
      GroupUpdated: AugmentedEvent<ApiType, [AccountId32, U8aFixed, Bytes]>;
      /**
       * Event emitted when a permission has been added. [who, permissionId, permissionName]
       **/
      PermissionAdded: AugmentedEvent<ApiType, [AccountId32, U8aFixed, Bytes]>;
      /**
       * Event emitted when a permission has been assigned to role. [who, permissionId, roleId]
       **/
      PermissionAssigned: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Event emitted when a permission has been disabled. [who, permissionId]
       **/
      PermissionDisabled: AugmentedEvent<ApiType, [AccountId32, U8aFixed]>;
      PermissionFetched: AugmentedEvent<ApiType, [PeaqPalletRbacStructsEntity]>;
      /**
       * Event emitted when a permission has been unassigned to role. [who, permissionId, roleId]
       **/
      PermissionUnassignedToRole: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Event emitted when a permission has been updated. [who, permissionId, permissionName]
       **/
      PermissionUpdated: AugmentedEvent<ApiType, [AccountId32, U8aFixed, Bytes]>;
      /**
       * Event emitted when a role has been added. [who, roleId, roleName]
       **/
      RoleAdded: AugmentedEvent<ApiType, [AccountId32, U8aFixed, Bytes]>;
      /**
       * Event emitted when a role has been assigned to group. [who, roleId, groupId]
       **/
      RoleAssignedToGroup: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Event emitted when a role has been assigned to user. [who, roleId, userId]
       **/
      RoleAssignedToUser: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      RoleFetched: AugmentedEvent<ApiType, [PeaqPalletRbacStructsEntity]>;
      /**
       * Event emitted when a role has been added. [who, roleId]
       **/
      RoleRemoved: AugmentedEvent<ApiType, [AccountId32, U8aFixed]>;
      /**
       * Event emitted when a role has been unassigned from group. [who, roleId, groupId]
       **/
      RoleUnassignedToGroup: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Event emitted when a role has been unassigned to user. [who, roleId, userId]
       **/
      RoleUnassignedToUser: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Event emitted when a role has been updated. [who, roleId, roleName]
       **/
      RoleUpdated: AugmentedEvent<ApiType, [AccountId32, U8aFixed, Bytes]>;
      /**
       * Event emitted when a user to group relationship has been added. [who, userId, groupId]
       **/
      UserAssignedToGroup: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Event emitted when a user to group relationship has been removed. [who, userId, groupId]
       **/
      UserUnAssignedToGroup: AugmentedEvent<ApiType, [AccountId32, U8aFixed, U8aFixed]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    peaqStorage: {
      /**
       * Event emitted when an storage item has been added. [who, item_type, item]
       **/
      ItemAdded: AugmentedEvent<ApiType, [AccountId32, Bytes, Bytes]>;
      /**
       * Event emitted when an item is read successfully
       **/
      ItemRead: AugmentedEvent<ApiType, [Bytes]>;
      /**
       * Event emitted when an item has been updated. [who, item_type, item]
       **/
      ItemUpdated: AugmentedEvent<ApiType, [AccountId32, Bytes, Bytes]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    polkadotXcm: {
      /**
       * Some assets have been placed in an asset trap.
       * 
       * \[ hash, origin, assets \]
       **/
      AssetsTrapped: AugmentedEvent<ApiType, [H256, XcmV1MultiLocation, XcmVersionedMultiAssets]>;
      /**
       * Execution of an XCM message was attempted.
       * 
       * \[ outcome \]
       **/
      Attempted: AugmentedEvent<ApiType, [XcmV2TraitsOutcome]>;
      /**
       * Expected query response has been received but the origin location of the response does
       * not match that expected. The query remains registered for a later, valid, response to
       * be received and acted upon.
       * 
       * \[ origin location, id, expected location \]
       **/
      InvalidResponder: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64, Option<XcmV1MultiLocation>]>;
      /**
       * Expected query response has been received but the expected origin location placed in
       * storage by this runtime previously cannot be decoded. The query remains registered.
       * 
       * This is unexpected (since a location placed in storage in a previously executing
       * runtime should be readable prior to query timeout) and dangerous since the possibly
       * valid response will be dropped. Manual governance intervention is probably going to be
       * needed.
       * 
       * \[ origin location, id \]
       **/
      InvalidResponderVersion: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64]>;
      /**
       * Query response has been received and query is removed. The registered notification has
       * been dispatched and executed successfully.
       * 
       * \[ id, pallet index, call index \]
       **/
      Notified: AugmentedEvent<ApiType, [u64, u8, u8]>;
      /**
       * Query response has been received and query is removed. The dispatch was unable to be
       * decoded into a `Call`; this might be due to dispatch function having a signature which
       * is not `(origin, QueryId, Response)`.
       * 
       * \[ id, pallet index, call index \]
       **/
      NotifyDecodeFailed: AugmentedEvent<ApiType, [u64, u8, u8]>;
      /**
       * Query response has been received and query is removed. There was a general error with
       * dispatching the notification call.
       * 
       * \[ id, pallet index, call index \]
       **/
      NotifyDispatchError: AugmentedEvent<ApiType, [u64, u8, u8]>;
      /**
       * Query response has been received and query is removed. The registered notification could
       * not be dispatched because the dispatch weight is greater than the maximum weight
       * originally budgeted by this runtime for the query result.
       * 
       * \[ id, pallet index, call index, actual weight, max budgeted weight \]
       **/
      NotifyOverweight: AugmentedEvent<ApiType, [u64, u8, u8, WeightV1, WeightV1]>;
      /**
       * A given location which had a version change subscription was dropped owing to an error
       * migrating the location to our new XCM format.
       * 
       * \[ location, query ID \]
       **/
      NotifyTargetMigrationFail: AugmentedEvent<ApiType, [XcmVersionedMultiLocation, u64]>;
      /**
       * A given location which had a version change subscription was dropped owing to an error
       * sending the notification to it.
       * 
       * \[ location, query ID, error \]
       **/
      NotifyTargetSendFail: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64, XcmV2TraitsError]>;
      /**
       * Query response has been received and is ready for taking with `take_response`. There is
       * no registered notification call.
       * 
       * \[ id, response \]
       **/
      ResponseReady: AugmentedEvent<ApiType, [u64, XcmV2Response]>;
      /**
       * Received query response has been read and removed.
       * 
       * \[ id \]
       **/
      ResponseTaken: AugmentedEvent<ApiType, [u64]>;
      /**
       * A XCM message was sent.
       * 
       * \[ origin, destination, message \]
       **/
      Sent: AugmentedEvent<ApiType, [XcmV1MultiLocation, XcmV1MultiLocation, XcmV2Xcm]>;
      /**
       * The supported version of a location has been changed. This might be through an
       * automatic notification or a manual intervention.
       * 
       * \[ location, XCM version \]
       **/
      SupportedVersionChanged: AugmentedEvent<ApiType, [XcmV1MultiLocation, u32]>;
      /**
       * Query response received which does not match a registered query. This may be because a
       * matching query was never registered, it may be because it is a duplicate response, or
       * because the query timed out.
       * 
       * \[ origin location, id \]
       **/
      UnexpectedResponse: AugmentedEvent<ApiType, [XcmV1MultiLocation, u64]>;
      /**
       * An XCM version change notification message has been attempted to be sent.
       * 
       * \[ destination, result \]
       **/
      VersionChangeNotified: AugmentedEvent<ApiType, [XcmV1MultiLocation, u32]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    session: {
      /**
       * New session has happened. Note that the argument is the session index, not the
       * block number as the type might suggest.
       **/
      NewSession: AugmentedEvent<ApiType, [sessionIndex: u32], { sessionIndex: u32 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    sudo: {
      /**
       * The \[sudoer\] just switched identity; the old key is supplied if one existed.
       **/
      KeyChanged: AugmentedEvent<ApiType, [oldSudoer: Option<AccountId32>], { oldSudoer: Option<AccountId32> }>;
      /**
       * A sudo just took place. \[result\]
       **/
      Sudid: AugmentedEvent<ApiType, [sudoResult: Result<Null, SpRuntimeDispatchError>], { sudoResult: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A sudo just took place. \[result\]
       **/
      SudoAsDone: AugmentedEvent<ApiType, [sudoResult: Result<Null, SpRuntimeDispatchError>], { sudoResult: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>;
      /**
       * An extrinsic failed.
       **/
      ExtrinsicFailed: AugmentedEvent<ApiType, [dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportWeightsDispatchInfo], { dispatchError: SpRuntimeDispatchError, dispatchInfo: FrameSupportWeightsDispatchInfo }>;
      /**
       * An extrinsic completed successfully.
       **/
      ExtrinsicSuccess: AugmentedEvent<ApiType, [dispatchInfo: FrameSupportWeightsDispatchInfo], { dispatchInfo: FrameSupportWeightsDispatchInfo }>;
      /**
       * An account was reaped.
       **/
      KilledAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>;
      /**
       * A new account was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [account: AccountId32], { account: AccountId32 }>;
      /**
       * On on-chain remark happened.
       **/
      Remarked: AugmentedEvent<ApiType, [sender: AccountId32, hash_: H256], { sender: AccountId32, hash_: H256 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    tokens: {
      /**
       * A balance was set by root.
       **/
      BalanceSet: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, free: u128, reserved: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, free: u128, reserved: u128 }>;
      /**
       * Deposited some balance into an account
       **/
      Deposited: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * An account was removed whose balance was non-zero but below
       * ExistentialDeposit, resulting in an outright loss.
       **/
      DustLost: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * An account was created with some free balance.
       **/
      Endowed: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * Some locked funds were unlocked
       **/
      LockRemoved: AugmentedEvent<ApiType, [lockId: U8aFixed, currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32], { lockId: U8aFixed, currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32 }>;
      /**
       * Some funds are locked
       **/
      LockSet: AugmentedEvent<ApiType, [lockId: U8aFixed, currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { lockId: U8aFixed, currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * Some balance was reserved (moved from free to reserved).
       **/
      Reserved: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * Some reserved balance was repatriated (moved from reserved to
       * another account).
       **/
      ReserveRepatriated: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, from: AccountId32, to: AccountId32, amount: u128, status: FrameSupportTokensMiscBalanceStatus], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, from: AccountId32, to: AccountId32, amount: u128, status: FrameSupportTokensMiscBalanceStatus }>;
      /**
       * Some balances were slashed (e.g. due to mis-behavior)
       **/
      Slashed: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, freeAmount: u128, reservedAmount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, freeAmount: u128, reservedAmount: u128 }>;
      /**
       * The total issuance of an currency has been set
       **/
      TotalIssuanceSet: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, amount: u128 }>;
      /**
       * Transfer succeeded.
       **/
      Transfer: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, from: AccountId32, to: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, from: AccountId32, to: AccountId32, amount: u128 }>;
      /**
       * Some balance was unreserved (moved from reserved to free).
       **/
      Unreserved: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * Some balances were withdrawn (e.g. pay for transaction fee)
       **/
      Withdrawn: AugmentedEvent<ApiType, [currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128], { currencyId: PeaqPrimitivesXcmCurrencyCurrencyId, who: AccountId32, amount: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    transaction: {
      /**
       * The consumer asks for the service
       * parameters. [provider, consumer, tx hash, token num, tx hash, time point, call_hash]
       **/
      ServiceDelivered: AugmentedEvent<ApiType, [provider: AccountId32, consumer: AccountId32, refundInfo: PeaqPalletTransactionStructsDeliveredInfo, spentInfo: PeaqPalletTransactionStructsDeliveredInfo], { provider: AccountId32, consumer: AccountId32, refundInfo: PeaqPalletTransactionStructsDeliveredInfo, spentInfo: PeaqPalletTransactionStructsDeliveredInfo }>;
      /**
       * The consumer asks for the service
       * parameters. [consumer, provider, token_deposited]
       **/
      ServiceRequested: AugmentedEvent<ApiType, [consumer: AccountId32, provider: AccountId32, tokenDeposited: u128], { consumer: AccountId32, provider: AccountId32, tokenDeposited: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    transactionPayment: {
      /**
       * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
       * has been paid by `who`.
       **/
      TransactionFeePaid: AugmentedEvent<ApiType, [who: AccountId32, actualFee: u128, tip: u128], { who: AccountId32, actualFee: u128, tip: u128 }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    unknownTokens: {
      /**
       * Deposit success.
       **/
      Deposited: AugmentedEvent<ApiType, [asset: XcmV1MultiAsset, who: XcmV1MultiLocation], { asset: XcmV1MultiAsset, who: XcmV1MultiLocation }>;
      /**
       * Withdraw success.
       **/
      Withdrawn: AugmentedEvent<ApiType, [asset: XcmV1MultiAsset, who: XcmV1MultiLocation], { asset: XcmV1MultiAsset, who: XcmV1MultiLocation }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    utility: {
      /**
       * Batch of dispatches completed fully with no error.
       **/
      BatchCompleted: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches completed but has errors.
       **/
      BatchCompletedWithErrors: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
       * well as the error.
       **/
      BatchInterrupted: AugmentedEvent<ApiType, [index: u32, error: SpRuntimeDispatchError], { index: u32, error: SpRuntimeDispatchError }>;
      /**
       * A call was dispatched.
       **/
      DispatchedAs: AugmentedEvent<ApiType, [result: Result<Null, SpRuntimeDispatchError>], { result: Result<Null, SpRuntimeDispatchError> }>;
      /**
       * A single item within a Batch of dispatches has completed with no error.
       **/
      ItemCompleted: AugmentedEvent<ApiType, []>;
      /**
       * A single item within a Batch of dispatches has completed with error.
       **/
      ItemFailed: AugmentedEvent<ApiType, [error: SpRuntimeDispatchError], { error: SpRuntimeDispatchError }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    xcmpQueue: {
      /**
       * Bad XCM format used.
       **/
      BadFormat: AugmentedEvent<ApiType, [messageHash: Option<H256>], { messageHash: Option<H256> }>;
      /**
       * Bad XCM version used.
       **/
      BadVersion: AugmentedEvent<ApiType, [messageHash: Option<H256>], { messageHash: Option<H256> }>;
      /**
       * Some XCM failed.
       **/
      Fail: AugmentedEvent<ApiType, [messageHash: Option<H256>, error: XcmV2TraitsError, weight: WeightV1], { messageHash: Option<H256>, error: XcmV2TraitsError, weight: WeightV1 }>;
      /**
       * An XCM exceeded the individual message weight budget.
       **/
      OverweightEnqueued: AugmentedEvent<ApiType, [sender: u32, sentAt: u32, index: u64, required: WeightV1], { sender: u32, sentAt: u32, index: u64, required: WeightV1 }>;
      /**
       * An XCM from the overweight queue was executed with the given actual weight used.
       **/
      OverweightServiced: AugmentedEvent<ApiType, [index: u64, used: WeightV1], { index: u64, used: WeightV1 }>;
      /**
       * Some XCM was executed ok.
       **/
      Success: AugmentedEvent<ApiType, [messageHash: Option<H256>, weight: WeightV1], { messageHash: Option<H256>, weight: WeightV1 }>;
      /**
       * An upward message was sent to the relay chain.
       **/
      UpwardMessageSent: AugmentedEvent<ApiType, [messageHash: Option<H256>], { messageHash: Option<H256> }>;
      /**
       * An HRMP message was sent to a sibling parachain.
       **/
      XcmpMessageSent: AugmentedEvent<ApiType, [messageHash: Option<H256>], { messageHash: Option<H256> }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    xTokens: {
      /**
       * Transferred `MultiAsset` with fee.
       **/
      TransferredMultiAssets: AugmentedEvent<ApiType, [sender: AccountId32, assets: XcmV1MultiassetMultiAssets, fee: XcmV1MultiAsset, dest: XcmV1MultiLocation], { sender: AccountId32, assets: XcmV1MultiassetMultiAssets, fee: XcmV1MultiAsset, dest: XcmV1MultiLocation }>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
  } // AugmentedEvents
} // declare module
