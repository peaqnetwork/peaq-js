// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/consts';

import type { ApiTypes, AugmentedConst } from '@polkadot/api-base/types';
import type { u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { Codec } from '@polkadot/types-codec/types';
import type { WeightV1 } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportPalletId, FrameSupportWeightsRuntimeDbWeight, FrameSystemLimitsBlockLength, FrameSystemLimitsBlockWeights, PalletContractsSchedule, PeaqPrimitivesXcmCurrencyCurrencyId, SpVersionRuntimeVersion, XcmV1MultiLocation } from '@polkadot/types/lookup';

export type __AugmentedConst<ApiType extends ApiTypes> = AugmentedConst<ApiType>;

declare module '@polkadot/api-base/types/consts' {
  interface AugmentedConsts<ApiType extends ApiTypes> {
    authorship: {
      /**
       * The number of blocks back we should accept uncles.
       * This means that we will deal with uncle-parents that are
       * `UncleGenerations + 1` before `now`.
       **/
      uncleGenerations: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    balances: {
      /**
       * The minimum amount required to keep an account open.
       **/
      existentialDeposit: u128 & AugmentedConst<ApiType>;
      /**
       * The maximum number of locks that should exist on an account.
       * Not strictly enforced, but used for weight estimation.
       **/
      maxLocks: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of named reserves that can exist on an account.
       **/
      maxReserves: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    contracts: {
      /**
       * The weight per byte of code that is charged when loading a contract from storage.
       * 
       * Currently, FRAME only charges fees for computation incurred but not for PoV
       * consumption caused for storage access. This is usually not exploitable because
       * accessing storage carries some substantial weight costs, too. However in case
       * of contract code very much PoV consumption can be caused while consuming very little
       * computation. This could be used to keep the chain busy without paying the
       * proper fee for it. Until this is resolved we charge from the weight meter for
       * contract access.
       * 
       * For more information check out: <https://github.com/paritytech/substrate/issues/10301>
       * 
       * [`DefaultContractAccessWeight`] is a safe default to be used for Polkadot or Kusama
       * parachains.
       * 
       * # Note
       * 
       * This is only relevant for parachains. Set to zero in case of a standalone chain.
       **/
      contractAccessWeight: WeightV1 & AugmentedConst<ApiType>;
      /**
       * The maximum number of contracts that can be pending for deletion.
       * 
       * When a contract is deleted by calling `seal_terminate` it becomes inaccessible
       * immediately, but the deletion of the storage items it has accumulated is performed
       * later. The contract is put into the deletion queue. This defines how many
       * contracts can be queued up at the same time. If that limit is reached `seal_terminate`
       * will fail. The action must be retried in a later block in that case.
       * 
       * The reasons for limiting the queue depth are:
       * 
       * 1. The queue is in storage in order to be persistent between blocks. We want to limit
       * the amount of storage that can be consumed.
       * 2. The queue is stored in a vector and needs to be decoded as a whole when reading
       * it at the end of each block. Longer queues take more weight to decode and hence
       * limit the amount of items that can be deleted per block.
       **/
      deletionQueueDepth: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum amount of weight that can be consumed per block for lazy trie removal.
       * 
       * The amount of weight that is dedicated per block to work on the deletion queue. Larger
       * values allow more trie keys to be deleted in each block but reduce the amount of
       * weight that is left for transactions. See [`Self::DeletionQueueDepth`] for more
       * information about the deletion queue.
       **/
      deletionWeightLimit: WeightV1 & AugmentedConst<ApiType>;
      /**
       * The amount of balance a caller has to pay for each byte of storage.
       * 
       * # Note
       * 
       * Changing this value for an existing chain might need a storage migration.
       **/
      depositPerByte: u128 & AugmentedConst<ApiType>;
      /**
       * The amount of balance a caller has to pay for each storage item.
       * 
       * # Note
       * 
       * Changing this value for an existing chain might need a storage migration.
       **/
      depositPerItem: u128 & AugmentedConst<ApiType>;
      /**
       * Cost schedule and limits.
       **/
      schedule: PalletContractsSchedule & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    currencies: {
      getNativeCurrencyId: PeaqPrimitivesXcmCurrencyCurrencyId & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    multiSig: {
      /**
       * The base amount of currency needed to reserve for creating a multisig execution or to
       * store a dispatch call for later.
       * 
       * This is held for an additional storage item whose value size is
       * `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is
       * `32 + sizeof(AccountId)` bytes.
       **/
      depositBase: u128 & AugmentedConst<ApiType>;
      /**
       * The amount of currency needed per unit threshold when creating a multisig execution.
       * 
       * This is held for adding 32 bytes more into a pre-existing storage value.
       **/
      depositFactor: u128 & AugmentedConst<ApiType>;
      /**
       * The maximum amount of signatories allowed in the multisig.
       **/
      maxSignatories: u16 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    parachainStaking: {
      /**
       * Default number of blocks validation rounds last, as set in the
       * genesis configuration.
       **/
      defaultBlocksPerRound: u32 & AugmentedConst<ApiType>;
      /**
       * Number of rounds a collator has to stay active after submitting a
       * request to leave the set of collator candidates.
       **/
      exitQueueDelay: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum number of collators a single delegator can delegate.
       **/
      maxCollatorsPerDelegator: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum number of delegations which can be made within the same
       * round.
       * 
       * NOTE: To prevent re-delegation-reward attacks, we should keep this
       * to be one.
       **/
      maxDelegationsPerRound: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum number of delegators a single collator can have.
       **/
      maxDelegatorsPerCollator: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum size of the top candidates set.
       **/
      maxTopCandidates: u32 & AugmentedConst<ApiType>;
      /**
       * Max number of concurrent active unstaking requests before
       * unlocking.
       * 
       * NOTE: To protect against irremovability of a candidate or delegator,
       * we only allow for MaxUnstakeRequests - 1 many manual unstake
       * requests. The last one serves as a placeholder for the cases of
       * calling either `kick_delegator`, force_remove_candidate` or
       * `execute_leave_candidates`. Otherwise, a user could max out their
       * unstake requests and prevent themselves from being kicked from the
       * set of candidates/delegators until they unlock their funds.
       **/
      maxUnstakeRequests: u32 & AugmentedConst<ApiType>;
      /**
       * Minimum number of blocks validation rounds can last.
       **/
      minBlocksPerRound: u32 & AugmentedConst<ApiType>;
      /**
       * Minimum stake required for any account to be added to the set of
       * candidates.
       **/
      minCollatorCandidateStake: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum number of collators selected from the set of candidates at
       * every validation round.
       **/
      minCollators: u32 & AugmentedConst<ApiType>;
      /**
       * Minimum stake required for any account to be elected as validator
       * for a round.
       **/
      minCollatorStake: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum stake required for any account to be able to delegate.
       **/
      minDelegation: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum stake required for any account to become a delegator.
       **/
      minDelegatorStake: u128 & AugmentedConst<ApiType>;
      /**
       * Minimum number of collators which cannot leave the network if there
       * are no others.
       **/
      minRequiredCollators: u32 & AugmentedConst<ApiType>;
      /**
       * Account Identifier from which the internal Pot is generated.
       **/
      potId: FrameSupportPalletId & AugmentedConst<ApiType>;
      /**
       * Number of blocks for which unstaked balance will still be locked
       * before it can be unlocked by actively calling the extrinsic
       * `unlock_unstaked`.
       **/
      stakeDuration: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    peaqMor: {
      /**
       * Account Identifier from which the internal Pot is generated.
       **/
      potId: FrameSupportPalletId & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    system: {
      /**
       * Maximum number of block number to block hash mappings to keep (oldest pruned first).
       **/
      blockHashCount: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum length of a block (in bytes).
       **/
      blockLength: FrameSystemLimitsBlockLength & AugmentedConst<ApiType>;
      /**
       * Block & extrinsics weights: base values and limits.
       **/
      blockWeights: FrameSystemLimitsBlockWeights & AugmentedConst<ApiType>;
      /**
       * The weight of runtime database operations the runtime can invoke.
       **/
      dbWeight: FrameSupportWeightsRuntimeDbWeight & AugmentedConst<ApiType>;
      /**
       * The designated SS58 prefix of this chain.
       * 
       * This replaces the "ss58Format" property declared in the chain spec. Reason is
       * that the runtime should know about the prefix in order to make use of it as
       * an identifier of the chain.
       **/
      ss58Prefix: u16 & AugmentedConst<ApiType>;
      /**
       * Get the chain's current version.
       **/
      version: SpVersionRuntimeVersion & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    timestamp: {
      /**
       * The minimum period between blocks. Beware that this is different to the *expected*
       * period that the block production apparatus provides. Your chosen consensus system will
       * generally work with this to determine a sensible block time. e.g. For Aura, it will be
       * double this period on default settings.
       **/
      minimumPeriod: u64 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    tokens: {
      maxLocks: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of named reserves that can exist on an account.
       **/
      maxReserves: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    transactionPayment: {
      /**
       * A fee mulitplier for `Operational` extrinsics to compute "virtual tip" to boost their
       * `priority`
       * 
       * This value is multipled by the `final_fee` to obtain a "virtual tip" that is later
       * added to a tip component in regular `priority` calculations.
       * It means that a `Normal` transaction can front-run a similarly-sized `Operational`
       * extrinsic (with no tip), by including a tip value greater than the virtual tip.
       * 
       * ```rust,ignore
       * // For `Normal`
       * let priority = priority_calc(tip);
       * 
       * // For `Operational`
       * let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
       * let priority = priority_calc(tip + virtual_tip);
       * ```
       * 
       * Note that since we use `final_fee` the multiplier applies also to the regular `tip`
       * sent with the transaction. So, not only does the transaction get a priority bump based
       * on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
       * transactions.
       **/
      operationalFeeMultiplier: u8 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    utility: {
      /**
       * The limit on the number of batched calls.
       **/
      batchedCallsLimit: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    xTokens: {
      /**
       * Base XCM weight.
       * 
       * The actually weight for an XCM message is `T::BaseXcmWeight +
       * T::Weigher::weight(&msg)`.
       **/
      baseXcmWeight: u64 & AugmentedConst<ApiType>;
      /**
       * Self chain location.
       **/
      selfLocation: XcmV1MultiLocation & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
  } // AugmentedConsts
} // declare module
