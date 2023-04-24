// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/submittable';

import type { ApiTypes, AugmentedSubmittable, SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import type { Bytes, Compact, Option, U256, U8aFixed, Vec, WrapperKeepOpaque, bool, i128, u128, u16, u32, u64 } from '@polkadot/types-codec';
import type { AnyNumber, IMethod, ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, Call, H160, H256, MultiAddress, Perbill, Permill, Perquintill, WeightV1 } from '@polkadot/types/interfaces/runtime';
import type { CumulusPrimitivesParachainInherentParachainInherentData, EthereumTransactionTransactionV2, PalletBlockRewardRewardDistributionConfig, PalletMultisigTimepoint, PeaqDevRuntimeOpaqueSessionKeys, PeaqDevRuntimeOriginCaller, PeaqPalletTransactionStructsDeliveredInfo, PeaqPrimitivesXcmCurrencyCurrencyId, SpRuntimeHeader, XcmV1MultiLocation, XcmV2WeightLimit, XcmVersionedMultiAsset, XcmVersionedMultiAssets, XcmVersionedMultiLocation, XcmVersionedXcm } from '@polkadot/types/lookup';

export type __AugmentedSubmittable = AugmentedSubmittable<() => unknown>;
export type __SubmittableExtrinsic<ApiType extends ApiTypes> = SubmittableExtrinsic<ApiType>;
export type __SubmittableExtrinsicFunction<ApiType extends ApiTypes> = SubmittableExtrinsicFunction<ApiType>;

declare module '@polkadot/api-base/types/submittable' {
  interface AugmentedSubmittables<ApiType extends ApiTypes> {
    authorship: {
      /**
       * Provide a set of uncles.
       **/
      setUncles: AugmentedSubmittable<(newUncles: Vec<SpRuntimeHeader> | (SpRuntimeHeader | { parentHash?: any; number?: any; stateRoot?: any; extrinsicsRoot?: any; digest?: any } | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<SpRuntimeHeader>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    balances: {
      /**
       * Exactly as `transfer`, except the origin must be root and the source account may be
       * specified.
       * # <weight>
       * - Same as transfer, but additional read and write because the source account is not
       * assumed to be in the overlay.
       * # </weight>
       **/
      forceTransfer: AugmentedSubmittable<(source: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, MultiAddress, Compact<u128>]>;
      /**
       * Unreserve some balance from a user by force.
       * 
       * Can only be called by ROOT.
       **/
      forceUnreserve: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * Set the balances of a given account.
       * 
       * This will alter `FreeBalance` and `ReservedBalance` in storage. it will
       * also alter the total issuance of the system (`TotalIssuance`) appropriately.
       * If the new free or reserved balance is below the existential deposit,
       * it will reset the account nonce (`frame_system::AccountNonce`).
       * 
       * The dispatch origin for this call is `root`.
       **/
      setBalance: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, newFree: Compact<u128> | AnyNumber | Uint8Array, newReserved: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>, Compact<u128>]>;
      /**
       * Transfer some liquid free balance to another account.
       * 
       * `transfer` will set the `FreeBalance` of the sender and receiver.
       * If the sender's account is below the existential deposit as a result
       * of the transfer, the account will be reaped.
       * 
       * The dispatch origin for this call must be `Signed` by the transactor.
       * 
       * # <weight>
       * - Dependent on arguments but not critical, given proper implementations for input config
       * types. See related functions below.
       * - It contains a limited number of reads and writes internally and no complex
       * computation.
       * 
       * Related functions:
       * 
       * - `ensure_can_withdraw` is always called internally but has a bounded complexity.
       * - Transferring balances to accounts that did not exist before will cause
       * `T::OnNewAccount::on_new_account` to be called.
       * - Removing enough funds from an account will trigger `T::DustRemoval::on_unbalanced`.
       * - `transfer_keep_alive` works the same way as `transfer`, but has an additional check
       * that the transfer will not kill the origin account.
       * ---------------------------------
       * - Origin account is already in memory, so no DB operations for them.
       * # </weight>
       **/
      transfer: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * Transfer the entire transferable balance from the caller account.
       * 
       * NOTE: This function only attempts to transfer _transferable_ balances. This means that
       * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
       * transferred by this function. To ensure that this function results in a killed account,
       * you might need to prepare the account by removing any reference counters, storage
       * deposits, etc...
       * 
       * The dispatch origin of this call must be Signed.
       * 
       * - `dest`: The recipient of the transfer.
       * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
       * of the funds the account has, causing the sender account to be killed (false), or
       * transfer everything except at least the existential deposit, which will guarantee to
       * keep the sender account alive (true). # <weight>
       * - O(1). Just like transfer, but reading the user's transferable balance first.
       * #</weight>
       **/
      transferAll: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, keepAlive: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, bool]>;
      /**
       * Same as the [`transfer`] call, but with a check that the transfer will not kill the
       * origin account.
       * 
       * 99% of the time you want [`transfer`] instead.
       * 
       * [`transfer`]: struct.Pallet.html#method.transfer
       **/
      transferKeepAlive: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    baseFee: {
      setBaseFeePerGas: AugmentedSubmittable<(fee: U256 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [U256]>;
      setElasticity: AugmentedSubmittable<(elasticity: Permill | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Permill]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    blockReward: {
      /**
       * Sets the block issue reward parameters which will be used from next block reward
       * distribution.
       * 
       * - `block_reward` - block reward param
       * 
       * Emits `BlockIssueRewardChanged` with config embeded into event itself.
       **/
      setBlockIssueReward: AugmentedSubmittable<(blockReward: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Sets the reward distribution configuration parameters which will be used from next block
       * reward distribution.
       * 
       * It is mandatory that all components of configuration sum up to one whole (**100%**),
       * otherwise an error `InvalidDistributionConfiguration` will be raised.
       * 
       * - `reward_distro_params` - reward distribution params
       * 
       * Emits `DistributionConfigurationChanged` with config embeded into event itself.
       **/
      setConfiguration: AugmentedSubmittable<(rewardDistroParams: PalletBlockRewardRewardDistributionConfig | { treasuryPercent?: any; dappsPercent?: any; collatorsPercent?: any; lpPercent?: any; machinesPercent?: any; machinesSubsidizationPercent?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PalletBlockRewardRewardDistributionConfig]>;
      /**
       * Sets the hard cap parameter which will be used from limit the block reward.
       * 
       * - `limit` - hardcap limit param
       * 
       * Emits `HardCapChanged` with config embeded into event itself.
       **/
      setHardCap: AugmentedSubmittable<(limit: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    contracts: {
      /**
       * Makes a call to an account, optionally transferring some balance.
       * 
       * # Parameters
       * 
       * * `dest`: Address of the contract to call.
       * * `value`: The balance to transfer from the `origin` to `dest`.
       * * `gas_limit`: The gas limit enforced when executing the constructor.
       * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
       * caller to pay for the storage consumed.
       * * `data`: The input data to pass to the contract.
       * 
       * * If the account is a smart-contract account, the associated code will be
       * executed and any value will be transferred.
       * * If the account is a regular account, any value will be transferred.
       * * If no account exists and the call value is not less than `existential_deposit`,
       * a regular account will be created and any value will be transferred.
       **/
      call: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: Compact<WeightV1> | AnyNumber | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, data: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>, Compact<WeightV1>, Option<Compact<u128>>, Bytes]>;
      /**
       * Instantiates a contract from a previously deployed wasm binary.
       * 
       * This function is identical to [`Self::instantiate_with_code`] but without the
       * code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary
       * must be supplied.
       **/
      instantiate: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: Compact<WeightV1> | AnyNumber | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, codeHash: H256 | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, Compact<WeightV1>, Option<Compact<u128>>, H256, Bytes, Bytes]>;
      /**
       * Instantiates a new contract from the supplied `code` optionally transferring
       * some balance.
       * 
       * This dispatchable has the same effect as calling [`Self::upload_code`] +
       * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
       * also check the documentation of [`Self::upload_code`].
       * 
       * # Parameters
       * 
       * * `value`: The balance to transfer from the `origin` to the newly created contract.
       * * `gas_limit`: The gas limit enforced when executing the constructor.
       * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
       * from the caller to pay for the storage consumed.
       * * `code`: The contract code to deploy in raw bytes.
       * * `data`: The input data to pass to the contract constructor.
       * * `salt`: Used for the address derivation. See [`Pallet::contract_address`].
       * 
       * Instantiation is executed as follows:
       * 
       * - The supplied `code` is instrumented, deployed, and a `code_hash` is created for that
       * code.
       * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
       * - The destination address is computed based on the sender, code_hash and the salt.
       * - The smart-contract account is created at the computed address.
       * - The `value` is transferred to the new account.
       * - The `deploy` function is executed in the context of the newly-created account.
       **/
      instantiateWithCode: AugmentedSubmittable<(value: Compact<u128> | AnyNumber | Uint8Array, gasLimit: Compact<WeightV1> | AnyNumber | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber, code: Bytes | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u128>, Compact<WeightV1>, Option<Compact<u128>>, Bytes, Bytes, Bytes]>;
      /**
       * Remove the code stored under `code_hash` and refund the deposit to its owner.
       * 
       * A code can only be removed by its original uploader (its owner) and only if it is
       * not used by any contract.
       **/
      removeCode: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      /**
       * Privileged function that changes the code of an existing contract.
       * 
       * This takes care of updating refcounts and all other necessary operations. Returns
       * an error if either the `code_hash` or `dest` do not exist.
       * 
       * # Note
       * 
       * This does **not** change the address of the contract in question. This means
       * that the contract address is no longer derived from its code hash after calling
       * this dispatchable.
       **/
      setCode: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, H256]>;
      /**
       * Upload new `code` without instantiating a contract from it.
       * 
       * If the code does not already exist a deposit is reserved from the caller
       * and unreserved only when [`Self::remove_code`] is called. The size of the reserve
       * depends on the instrumented size of the the supplied `code`.
       * 
       * If the code already exists in storage it will still return `Ok` and upgrades
       * the in storage version to the current
       * [`InstructionWeights::version`](InstructionWeights).
       * 
       * # Note
       * 
       * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
       * To avoid this situation a constructor could employ access control so that it can
       * only be instantiated by permissioned entities. The same is true when uploading
       * through [`Self::instantiate_with_code`].
       **/
      uploadCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array, storageDepositLimit: Option<Compact<u128>> | null | Uint8Array | Compact<u128> | AnyNumber) => SubmittableExtrinsic<ApiType>, [Bytes, Option<Compact<u128>>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    currencies: {
      /**
       * Transfer some balance to another account under `currency_id`.
       * 
       * The dispatch origin for this call must be `Signed` by the
       * transactor.
       **/
      transfer: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, currencyId: PeaqPrimitivesXcmCurrencyCurrencyId | { Token: any } | { Erc20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, PeaqPrimitivesXcmCurrencyCurrencyId, Compact<u128>]>;
      /**
       * Transfer some native currency to another account.
       * 
       * The dispatch origin for this call must be `Signed` by the
       * transactor.
       **/
      transferNativeCurrency: AugmentedSubmittable<(dest: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: Compact<u128> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Compact<u128>]>;
      /**
       * update amount of account `who` under `currency_id`.
       * 
       * The dispatch origin of this call must be _Root_.
       **/
      updateBalance: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, currencyId: PeaqPrimitivesXcmCurrencyCurrencyId | { Token: any } | { Erc20: any } | string | Uint8Array, amount: i128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, PeaqPrimitivesXcmCurrencyCurrencyId, i128]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    dmpQueue: {
      /**
       * Service a single overweight message.
       * 
       * - `origin`: Must pass `ExecuteOverweightOrigin`.
       * - `index`: The index of the overweight message to service.
       * - `weight_limit`: The amount of weight that message execution may take.
       * 
       * Errors:
       * - `Unknown`: Message of `index` is unknown.
       * - `OverLimit`: Message execution may use greater than `weight_limit`.
       * 
       * Events:
       * - `OverweightServiced`: On success.
       **/
      serviceOverweight: AugmentedSubmittable<(index: u64 | AnyNumber | Uint8Array, weightLimit: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64, WeightV1]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    dynamicFee: {
      noteMinGasPriceTarget: AugmentedSubmittable<(target: U256 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [U256]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    ethereum: {
      /**
       * Transact an Ethereum transaction.
       **/
      transact: AugmentedSubmittable<(transaction: EthereumTransactionTransactionV2 | { Legacy: any } | { EIP2930: any } | { EIP1559: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [EthereumTransactionTransactionV2]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    evm: {
      /**
       * Issue an EVM call operation. This is similar to a message call transaction in Ethereum.
       **/
      call: AugmentedSubmittable<(source: H160 | string | Uint8Array, target: H160 | string | Uint8Array, input: Bytes | string | Uint8Array, value: U256 | AnyNumber | Uint8Array, gasLimit: u64 | AnyNumber | Uint8Array, maxFeePerGas: U256 | AnyNumber | Uint8Array, maxPriorityFeePerGas: Option<U256> | null | Uint8Array | U256 | AnyNumber, nonce: Option<U256> | null | Uint8Array | U256 | AnyNumber, accessList: Vec<ITuple<[H160, Vec<H256>]>> | ([H160 | string | Uint8Array, Vec<H256> | (H256 | string | Uint8Array)[]])[]) => SubmittableExtrinsic<ApiType>, [H160, H160, Bytes, U256, u64, U256, Option<U256>, Option<U256>, Vec<ITuple<[H160, Vec<H256>]>>]>;
      /**
       * Issue an EVM create operation. This is similar to a contract creation transaction in
       * Ethereum.
       **/
      create: AugmentedSubmittable<(source: H160 | string | Uint8Array, init: Bytes | string | Uint8Array, value: U256 | AnyNumber | Uint8Array, gasLimit: u64 | AnyNumber | Uint8Array, maxFeePerGas: U256 | AnyNumber | Uint8Array, maxPriorityFeePerGas: Option<U256> | null | Uint8Array | U256 | AnyNumber, nonce: Option<U256> | null | Uint8Array | U256 | AnyNumber, accessList: Vec<ITuple<[H160, Vec<H256>]>> | ([H160 | string | Uint8Array, Vec<H256> | (H256 | string | Uint8Array)[]])[]) => SubmittableExtrinsic<ApiType>, [H160, Bytes, U256, u64, U256, Option<U256>, Option<U256>, Vec<ITuple<[H160, Vec<H256>]>>]>;
      /**
       * Issue an EVM create2 operation.
       **/
      create2: AugmentedSubmittable<(source: H160 | string | Uint8Array, init: Bytes | string | Uint8Array, salt: H256 | string | Uint8Array, value: U256 | AnyNumber | Uint8Array, gasLimit: u64 | AnyNumber | Uint8Array, maxFeePerGas: U256 | AnyNumber | Uint8Array, maxPriorityFeePerGas: Option<U256> | null | Uint8Array | U256 | AnyNumber, nonce: Option<U256> | null | Uint8Array | U256 | AnyNumber, accessList: Vec<ITuple<[H160, Vec<H256>]>> | ([H160 | string | Uint8Array, Vec<H256> | (H256 | string | Uint8Array)[]])[]) => SubmittableExtrinsic<ApiType>, [H160, Bytes, H256, U256, u64, U256, Option<U256>, Option<U256>, Vec<ITuple<[H160, Vec<H256>]>>]>;
      /**
       * Withdraw balance from EVM into currency/balances pallet.
       **/
      withdraw: AugmentedSubmittable<(address: H160 | string | Uint8Array, value: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [H160, u128]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    multiSig: {
      /**
       * Register approval for a dispatch to be made from a deterministic composite account if
       * approved by a total of `threshold - 1` of `other_signatories`.
       * 
       * Payment: `DepositBase` will be reserved if this is the first approval, plus
       * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
       * is cancelled.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
       * not the first approval, then it must be `Some`, with the timepoint (block number and
       * transaction index) of the first approval transaction.
       * - `call_hash`: The hash of the call to be executed.
       * 
       * NOTE: If this is the final approval, you will want to use `as_multi` instead.
       * 
       * # <weight>
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
       * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
       * ----------------------------------
       * - DB Weight:
       * - Read: Multisig Storage, [Caller Account]
       * - Write: Multisig Storage, [Caller Account]
       * # </weight>
       **/
      approveAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], maybeTimepoint: Option<PalletMultisigTimepoint> | null | Uint8Array | PalletMultisigTimepoint | { height?: any; index?: any } | string, callHash: U8aFixed | string | Uint8Array, maxWeight: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, U8aFixed, WeightV1]>;
      /**
       * Register approval for a dispatch to be made from a deterministic composite account if
       * approved by a total of `threshold - 1` of `other_signatories`.
       * 
       * If there are enough, then dispatch the call.
       * 
       * Payment: `DepositBase` will be reserved if this is the first approval, plus
       * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
       * is cancelled.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
       * not the first approval, then it must be `Some`, with the timepoint (block number and
       * transaction index) of the first approval transaction.
       * - `call`: The call to be executed.
       * 
       * NOTE: Unless this is the final approval, you will generally want to use
       * `approve_as_multi` instead, since it only requires a hash of the call.
       * 
       * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
       * on success, result is `Ok` and the result from the interior call, if it was executed,
       * may be found in the deposited `MultisigExecuted` event.
       * 
       * # <weight>
       * - `O(S + Z + Call)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - The weight of the `call`.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
       * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
       * -------------------------------
       * - DB Weight:
       * - Reads: Multisig Storage, [Caller Account], Calls (if `store_call`)
       * - Writes: Multisig Storage, [Caller Account], Calls (if `store_call`)
       * - Plus Call Weight
       * # </weight>
       **/
      asMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], maybeTimepoint: Option<PalletMultisigTimepoint> | null | Uint8Array | PalletMultisigTimepoint | { height?: any; index?: any } | string, call: WrapperKeepOpaque<Call> | object | string | Uint8Array, storeCall: bool | boolean | Uint8Array, maxWeight: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, WrapperKeepOpaque<Call>, bool, WeightV1]>;
      /**
       * Immediately dispatch a multi-signature call using a single approval from the caller.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `other_signatories`: The accounts (other than the sender) who are part of the
       * multi-signature, but do not participate in the approval process.
       * - `call`: The call to be executed.
       * 
       * Result is equivalent to the dispatched result.
       * 
       * # <weight>
       * O(Z + C) where Z is the length of the call and C its execution weight.
       * -------------------------------
       * - DB Weight: None
       * - Plus Call Weight
       * # </weight>
       **/
      asMultiThreshold1: AugmentedSubmittable<(otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<AccountId32>, Call]>;
      /**
       * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
       * for this operation will be unreserved on success.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `timepoint`: The timepoint (block number and transaction index) of the first approval
       * transaction for this dispatch.
       * - `call_hash`: The hash of the call to be executed.
       * 
       * # <weight>
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - One event.
       * - I/O: 1 read `O(S)`, one remove.
       * - Storage: removes one item.
       * ----------------------------------
       * - DB Weight:
       * - Read: Multisig Storage, [Caller Account], Refund Account, Calls
       * - Write: Multisig Storage, [Caller Account], Refund Account, Calls
       * # </weight>
       **/
      cancelAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[], timepoint: PalletMultisigTimepoint | { height?: any; index?: any } | string | Uint8Array, callHash: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Vec<AccountId32>, PalletMultisigTimepoint, U8aFixed]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    parachainStaking: {
      /**
       * Revert the previously requested exit of the network of a collator
       * candidate. On success, adds back the candidate to the TopCandidates
       * and updates the collators.
       * 
       * Requires the candidate to previously have called
       * `init_leave_candidates`.
       * 
       * Emits `CollatorCanceledExit`.
       * 
       * # <weight>
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators for this
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: [Origin Account], TotalCollatorStake, TopCandidates, CandidatePool
       * - Writes: TotalCollatorStake, CandidatePool, TopCandidates
       * # </weight>
       **/
      cancelLeaveCandidates: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Stake less funds for a collator candidate.
       * 
       * If the new amount of staked fund is not large enough, the account
       * could be removed from the set of collator candidates and not be
       * considered for authoring the next blocks.
       * 
       * This operation affects the pallet's total stake amount.
       * 
       * The unstaked funds are not released immediately to the account, but
       * they will be available after `StakeDuration` blocks.
       * 
       * The resulting total amount of funds staked must be within the
       * allowed range as set in the pallet's configuration.
       * 
       * Emits `CollatorStakedLess`.
       * 
       * # <weight>
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators for this
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: [Origin Account], Unstaking, TopCandidates, MaxSelectedCandidates,
       * CandidatePool
       * - Writes: Unstaking, CandidatePool, TotalCollatorStake
       * # </weight>
       **/
      candidateStakeLess: AugmentedSubmittable<(less: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Stake more funds for a collator candidate.
       * 
       * If not in the set of candidates, staking enough funds allows the
       * account to be added to it. The larger amount of funds, the higher
       * chances to be selected as the author of the next block.
       * 
       * This operation affects the pallet's total stake amount.
       * 
       * The resulting total amount of funds staked must be within the
       * allowed range as set in the pallet's configuration.
       * 
       * Emits `CollatorStakedMore`.
       * 
       * # <weight>
       * Weight: O(N + D + U) where  where N is `MaxSelectedCandidates`
       * bounded by `MaxTopCandidates`, D is the number of delegators for
       * this candidate bounded by `MaxDelegatorsPerCollator` and U is the
       * number of locked unstaking requests bounded by `MaxUnstakeRequests`.
       * - Reads: [Origin Account], Locks, TotalCollatorStake, MaxCollatorCandidateStake,
       * TopCandidates, CandidatePool
       * - Writes: Locks, TotalCollatorStake, CandidatePool, TopCandidates
       * # </weight>
       **/
      candidateStakeMore: AugmentedSubmittable<(more: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Delegate another collator's candidate by staking some funds and
       * increasing the pallet's as well as the collator's total stake.
       * 
       * The account that wants to delegate cannot be part of the collator
       * candidates set as well.
       * 
       * The caller _must_ have delegated before. Otherwise,
       * `join_delegators` should be called.
       * 
       * If the delegator has already delegated the maximum number of
       * collator candidates, this operation will fail.
       * 
       * The amount staked must be larger than the minimum required to become
       * a delegator as set in the pallet's configuration.
       * 
       * As only `MaxDelegatorsPerCollator` are allowed to delegate a given
       * collator, the amount staked must be larger than the lowest one in
       * the current set of delegator for the operation to be meaningful.
       * 
       * The collator's total stake as well as the pallet's total stake are
       * increased accordingly.
       * 
       * NOTE: This transaction is expected to throw until we increase
       * `MaxCollatorsPerDelegator` by at least one, since it is currently
       * set to one.
       * 
       * Emits `Delegation`.
       * Emits `DelegationReplaced` if the candidate has
       * `MaxDelegatorsPerCollator` many delegations but this delegator
       * staked more than one of the other delegators of this candidate.
       * 
       * # <weight>
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators for this
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: [Origin Account], DelegatorState, TopCandidates, MaxSelectedCandidates,
       * CandidatePool, LastDelegation, Round
       * - Writes: Locks, CandidatePool, DelegatorState, TotalCollatorStake, LastDelegation
       * # </weight>
       **/
      delegateAnotherCandidate: AugmentedSubmittable<(collator: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * Reduce the stake for delegating a collator candidate.
       * 
       * If the new amount of staked fund is not large enough, the collator
       * could be removed from the set of collator candidates and not be
       * considered for authoring the next blocks.
       * 
       * The unstaked funds are not release immediately to the account, but
       * they will be available after `StakeDuration` blocks.
       * 
       * The remaining staked funds must still be larger than the minimum
       * required by this pallet to maintain the status of delegator.
       * 
       * The resulting total amount of funds staked must be within the
       * allowed range as set in the pallet's configuration.
       * 
       * Emits `DelegatorStakedLess`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], DelegatorState, BlockNumber, Unstaking, TopCandidates,
       * CandidatePool, MaxSelectedCandidates
       * - Writes: Unstaking, DelegatorState, CandidatePool, TotalCollatorStake
       * # </weight>
       **/
      delegatorStakeLess: AugmentedSubmittable<(candidate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, less: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * Increase the stake for delegating a collator candidate.
       * 
       * If not in the set of candidates, staking enough funds allows the
       * collator candidate to be added to it.
       * 
       * Emits `DelegatorStakedMore`.
       * 
       * # <weight>
       * Weight: O(N) + O(D) where N is `MaxSelectedCandidates` bounded
       * by `MaxTopCandidates` and D the number of total delegators for
       * this collator bounded by `MaxCollatorsPerDelegator`.
       * bounded by `MaxUnstakeRequests`.
       * - Reads: [Origin Account], DelegatorState, BlockNumber, Unstaking, Locks, TopCandidates,
       * CandidatePool, MaxSelectedCandidates
       * - Writes: Unstaking, Locks, DelegatorState, CandidatePool, TotalCollatorStake
       * # </weight>
       **/
      delegatorStakeMore: AugmentedSubmittable<(candidate: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, more: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * Execute the network exit of a candidate who requested to leave at
       * least `ExitQueueDelay` rounds ago. Prepares unstaking of the
       * candidates and their delegators stake which can be unlocked via
       * `unlock_unstaked` after waiting at least `StakeDuration` many
       * blocks.
       * 
       * Requires the candidate to previously have called
       * `init_leave_candidates`.
       * 
       * The exit request can be reversed by calling
       * `cancel_leave_candidates`.
       * 
       * Emits `CollatorLeft`.
       * 
       * # <weight>
       * Weight: O(N + D + U) where  where N is `MaxSelectedCandidates`
       * bounded by `MaxTopCandidates`, D is the number of delegators for
       * this candidate bounded by `MaxDelegatorsPerCollator` and U is the
       * number of locked unstaking requests bounded by `MaxUnstakeRequests`.
       * - Reads: CandidatePool, Round, D * DelegatorState, D
       * * BlockNumber, D * Unstaking
       * - Writes: D * Unstaking, D * DelegatorState, Total
       * - Kills: CandidatePool, DelegatorState
       * # </weight>
       **/
      executeLeaveCandidates: AugmentedSubmittable<(collator: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Forces the start of the new round in the next block.
       * 
       * The new round will be enforced via <T as
       * ShouldEndSession<_>>::should_end_session.
       * 
       * The dispatch origin must be Root.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account]
       * - Writes: ForceNewRound
       * # </weight>
       **/
      forceNewRound: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Forcedly removes a collator candidate from the TopCandidates and
       * clears all associated storage for the candidate and their
       * delegators.
       * 
       * Prepares unstaking of the candidates and their delegators stake
       * which can be unlocked via `unlock_unstaked` after waiting at
       * least `StakeDuration` many blocks.
       * 
       * Emits `CandidateRemoved`.
       * 
       * # <weight>
       * - The transaction's complexity is mainly dependent on updating the `SelectedCandidates`
       * storage in `select_top_candidates` which in return depends on the number of
       * `MaxSelectedCandidates` (N).
       * - For each N, we read `CandidatePool` from the storage.
       * ---------
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators of the
       * collator candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: MaxCollatorCandidateStake, 2 * N * CandidatePool, TopCandidates, BlockNumber, D
       * * DelegatorState, D * Unstaking
       * - Writes: MaxCollatorCandidateStake, N * CandidatePool, D * DelegatorState, (D + 1) *
       * Unstaking
       * - Kills: CandidatePool, DelegatorState for all delegators which only delegated to the
       * candidate
       * # </weight>
       **/
      forceRemoveCandidate: AugmentedSubmittable<(collator: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Request to leave the set of collator candidates.
       * 
       * On success, the account is immediately removed from the candidate
       * pool to prevent selection as a collator in future validation rounds,
       * but unstaking of the funds is executed with a delay of
       * `StakeDuration` blocks.
       * 
       * The exit request can be reversed by calling
       * `cancel_leave_candidates`.
       * 
       * This operation affects the pallet's total stake amount. It is
       * updated even though the funds of the candidate who signaled to leave
       * are still locked for `ExitDelay` + `StakeDuration` more blocks.
       * 
       * NOTE: Upon starting a new session_i in `new_session`, the current
       * top candidates are selected to be block authors for session_i+1. Any
       * changes to the top candidates afterwards do not effect the set of
       * authors for session_i+1.
       * Thus, we have to make sure none of these collators can
       * leave before session_i+1 ends by delaying their
       * exit for `ExitDelay` many blocks.
       * 
       * Emits `CollatorScheduledExit`.
       * 
       * # <weight>
       * - The transaction's complexity is mainly dependent on updating the `SelectedCandidates`
       * storage in `select_top_candidates` which in return depends on the number of
       * `MaxSelectedCandidates` (N).
       * - For each N, we read `CandidatePool` from the storage.
       * ---------
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators for this
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: [Origin Account], TopCandidates, (N + 1) * CandidatePool, TotalCollatorStake
       * - Writes: CandidatePool, TopCandidates, TotalCollatorStake
       * # </weight>
       **/
      initLeaveCandidates: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Join the set of collator candidates.
       * 
       * In the next blocks, if the collator candidate has enough funds
       * staked to be included in any of the top `MaxSelectedCandidates`
       * positions, it will be included in the set of potential authors that
       * will be selected by the stake-weighted random selection function.
       * 
       * The staked funds of the new collator candidate are added to the
       * total stake of the system.
       * 
       * The total amount of funds staked must be within the allowed range as
       * set in the pallet's configuration.
       * 
       * The dispatch origin must not be already part of the collator
       * candidates nor of the delegators set.
       * 
       * Emits `JoinedCollatorCandidates`.
       * 
       * # <weight>
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators for this
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: [Origin Account], DelegatorState, MaxCollatorCandidateStake, Locks,
       * TotalCollatorStake, TopCandidates, MaxSelectedCandidates, CandidatePool,
       * - Writes: Locks, TotalCollatorStake, CandidatePool, TopCandidates,
       * # </weight>
       **/
      joinCandidates: AugmentedSubmittable<(stake: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Join the set of delegators by delegating to a collator candidate.
       * 
       * The account that wants to delegate cannot be part of the collator
       * candidates set as well.
       * 
       * The caller must _not_ have delegated before. Otherwise,
       * `delegate_another_candidate` should be called.
       * 
       * The amount staked must be larger than the minimum required to become
       * a delegator as set in the pallet's configuration.
       * 
       * As only `MaxDelegatorsPerCollator` are allowed to delegate a given
       * collator, the amount staked must be larger than the lowest one in
       * the current set of delegator for the operation to be meaningful.
       * 
       * The collator's total stake as well as the pallet's total stake are
       * increased accordingly.
       * 
       * Emits `Delegation`.
       * Emits `DelegationReplaced` if the candidate has
       * `MaxDelegatorsPerCollator` many delegations but this delegator
       * staked more than one of the other delegators of this candidate.
       * 
       * # <weight>
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators for this
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: [Origin Account], DelegatorState, TopCandidates, MaxSelectedCandidates,
       * CandidatePool, LastDelegation, Round
       * - Writes: Locks, CandidatePool, DelegatorState, TotalCollatorStake, LastDelegation
       * # </weight>
       **/
      joinDelegators: AugmentedSubmittable<(collator: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, u128]>;
      /**
       * Leave the set of delegators and, by implication, revoke all ongoing
       * delegations.
       * 
       * All staked funds are not unlocked immediately, but they are added to
       * the queue of pending unstaking, and will effectively be released
       * after `StakeDuration` blocks from the moment the delegator leaves.
       * 
       * This operation reduces the total stake of the pallet as well as the
       * stakes of all collators that were delegated, potentially affecting
       * their chances to be included in the set of candidates in the next
       * rounds.
       * 
       * Emits `DelegatorLeft`.
       * 
       * # <weight>
       * Weight: O(C) where C is the number of delegations for this delegator
       * which is bounded by by `MaxCollatorsPerDelegator`.
       * - Reads: [Origin Account], DelegatorState, BlockNumber, Unstaking, TopCandidates,
       * MaxSelectedCandidates, C * CandidatePool,
       * - Writes: Unstaking, CandidatePool, TotalCollatorStake,
       * - Kills: DelegatorState
       * # </weight>
       **/
      leaveDelegators: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Terminates an ongoing delegation for a given collator candidate.
       * 
       * The staked funds are not unlocked immediately, but they are added to
       * the queue of pending unstaking, and will effectively be released
       * after `StakeDuration` blocks from the moment the delegation is
       * terminated.
       * 
       * This operation reduces the total stake of the pallet as well as the
       * stakes of the collator involved, potentially affecting its chances
       * to be included in the set of candidates in the next rounds.
       * 
       * Emits `DelegatorLeft`.
       * 
       * # <weight>
       * Weight: O(C) where C is the number of delegations for this delegator
       * which is bounded by by `MaxCollatorsPerDelegator`.
       * - Reads: [Origin Account], DelegatorState, BlockNumber, Unstaking, Locks, TopCandidates,
       * CandidatePool, MaxSelectedCandidates
       * - Writes: Unstaking, Locks, DelegatorState, CandidatePool, TotalCollatorStake
       * - Kills: DelegatorState if the delegator has not delegated to another collator
       * # </weight>
       **/
      revokeDelegation: AugmentedSubmittable<(collator: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Set the number of blocks each validation round lasts.
       * 
       * If the new value is less than the length of the current round, the
       * system will immediately move to the next round in the next block.
       * 
       * The new value must be higher than the minimum allowed as set in the
       * pallet's configuration.
       * 
       * The dispatch origin must be Root.
       * 
       * Emits `BlocksPerRoundSet`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], Round
       * - Writes: Round
       * # </weight>
       **/
      setBlocksPerRound: AugmentedSubmittable<(updated: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Set the maximal amount a collator can stake. Existing stakes are not
       * changed.
       * 
       * The dispatch origin must be Root.
       * 
       * Emits `MaxCandidateStakeChanged`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account], MaxCollatorCandidateStake
       * - Writes: Round
       * # </weight>
       **/
      setMaxCandidateStake: AugmentedSubmittable<(updated: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Set the maximum number of collator candidates that can be selected
       * at the beginning of each validation round.
       * 
       * Changes are not applied until the start of the next round.
       * 
       * The new value must be higher than the minimum allowed as set in the
       * pallet's configuration.
       * 
       * The dispatch origin must be Root.
       * 
       * Emits `MaxSelectedCandidatesSet`.
       * 
       * 
       * # <weight>
       * - The transaction's complexity is mainly dependent on updating the `SelectedCandidates`
       * storage in `select_top_candidates` which in return depends on the number of
       * `MaxSelectedCandidates` (N).
       * - For each N, we read `CandidatePool` from the storage.
       * ---------
       * Weight: O(N + D) where N is `MaxSelectedCandidates` bounded by
       * `MaxTopCandidates` and D is the number of delegators of a
       * candidate bounded by `MaxDelegatorsPerCollator`.
       * - Reads: MaxSelectedCandidates, TopCandidates, N * CandidatePool
       * - Writes: MaxSelectedCandidates
       * # </weight>
       **/
      setMaxSelectedCandidates: AugmentedSubmittable<(updated: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Set the reward_rate rate.
       * 
       * The estimated average block time is twelve seconds.
       * 
       * The dispatch origin must be Root.
       * 
       * Emits `RoundRewardRateSet`.
       * 
       * # <weight>
       * Weight: O(1)
       * - Reads: [Origin Account]
       * - Writes: RewardRateConfig
       * # </weight>
       **/
      setRewardRate: AugmentedSubmittable<(collatorRate: Perquintill | AnyNumber | Uint8Array, delegatorRate: Perquintill | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Perquintill, Perquintill]>;
      /**
       * Unlock all previously staked funds that are now available for
       * unlocking by the origin account after `StakeDuration` blocks have
       * elapsed.
       * 
       * Weight: O(U) where U is the number of locked unstaking requests
       * bounded by `MaxUnstakeRequests`.
       * - Reads: [Origin Account], Unstaking, Locks
       * - Writes: Unstaking, Locks
       * - Kills: Unstaking & Locks if no balance is locked anymore
       * # </weight>
       **/
      unlockUnstaked: AugmentedSubmittable<(target: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    parachainSystem: {
      authorizeUpgrade: AugmentedSubmittable<(codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [H256]>;
      enactAuthorizedUpgrade: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the current validation data.
       * 
       * This should be invoked exactly once per block. It will panic at the finalization
       * phase if the call was not invoked.
       * 
       * The dispatch origin for this call must be `Inherent`
       * 
       * As a side effect, this function upgrades the current validation function
       * if the appropriate time has come.
       **/
      setValidationData: AugmentedSubmittable<(data: CumulusPrimitivesParachainInherentParachainInherentData | { validationData?: any; relayChainState?: any; downwardMessages?: any; horizontalMessages?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [CumulusPrimitivesParachainInherentParachainInherentData]>;
      sudoSendUpwardMessage: AugmentedSubmittable<(message: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    peaqDid: {
      /**
       * Creates a new attribute as part of a DID
       * with optional validity
       **/
      addAttribute: AugmentedSubmittable<(didAccount: AccountId32 | string | Uint8Array, name: Bytes | string | Uint8Array, value: Bytes | string | Uint8Array, validFor: Option<u32> | null | Uint8Array | u32 | AnyNumber) => SubmittableExtrinsic<ApiType>, [AccountId32, Bytes, Bytes, Option<u32>]>;
      /**
       * Read did attribute
       **/
      readAttribute: AugmentedSubmittable<(didAccount: AccountId32 | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, Bytes]>;
      /**
       * Delete an existing attribute of a DID
       **/
      removeAttribute: AugmentedSubmittable<(didAccount: AccountId32 | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, Bytes]>;
      /**
       * Update an existing attribute of a DID
       * with optional validity
       **/
      updateAttribute: AugmentedSubmittable<(didAccount: AccountId32 | string | Uint8Array, name: Bytes | string | Uint8Array, value: Bytes | string | Uint8Array, validFor: Option<u32> | null | Uint8Array | u32 | AnyNumber) => SubmittableExtrinsic<ApiType>, [AccountId32, Bytes, Bytes, Option<u32>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    peaqMor: {
      fetchPeriodRewarding: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      fetchPotBalance: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * In this early version one can collect rewards for a machine, which has been online
       * on the network for a certain period of time.
       **/
      getOnlineRewards: AugmentedSubmittable<(machine: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * In this early version one can collect rewards for a machine, which has been online
       * on the network for a certain period of time.
       **/
      payMachineUsage: AugmentedSubmittable<(machine: AccountId32 | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, u128]>;
      /**
       * Registers a new machine on the network by given account-ID and machine-ID.
       **/
      registerNewMachine: AugmentedSubmittable<(machine: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    peaqRbac: {
      /**
       * create group call
       **/
      addGroup: AugmentedSubmittable<(groupId: U8aFixed | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, Bytes]>;
      /**
       * create permission call
       **/
      addPermission: AugmentedSubmittable<(permissionId: U8aFixed | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, Bytes]>;
      /**
       * create role call
       **/
      addRole: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, Bytes]>;
      /**
       * assign a permission to role call
       **/
      assignPermissionToRole: AugmentedSubmittable<(permissionId: U8aFixed | string | Uint8Array, roleId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * assign a role to group call
       **/
      assignRoleToGroup: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * assign a role to user call
       **/
      assignRoleToUser: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array, userId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * assign a user to group call
       **/
      assignUserToGroup: AugmentedSubmittable<(userId: U8aFixed | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * disable group call
       **/
      disableGroup: AugmentedSubmittable<(groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      disablePermission: AugmentedSubmittable<(permissionId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      disableRole: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed]>;
      fetchGroup: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchGroupPermissions: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchGroupRoles: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchGroups: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      fetchPermission: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, permissionId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchPermissions: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      fetchRole: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, entity: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchRolePermissions: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, roleId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchRoles: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32]>;
      fetchUserGroups: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, userId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchUserPermissions: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, userId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      fetchUserRoles: AugmentedSubmittable<(owner: AccountId32 | string | Uint8Array, userId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, U8aFixed]>;
      /**
       * unassign permission to role relationship call
       **/
      unassignPermissionToRole: AugmentedSubmittable<(permissionId: U8aFixed | string | Uint8Array, roleId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * unassign role to group relationship call
       **/
      unassignRoleToGroup: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * unassign role to user relationship call
       **/
      unassignRoleToUser: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array, userId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * unassign a user to group call
       **/
      unassignUserToGroup: AugmentedSubmittable<(userId: U8aFixed | string | Uint8Array, groupId: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, U8aFixed]>;
      /**
       * update group call
       **/
      updateGroup: AugmentedSubmittable<(groupId: U8aFixed | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, Bytes]>;
      /**
       * update permission call
       **/
      updatePermission: AugmentedSubmittable<(permissionId: U8aFixed | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, Bytes]>;
      /**
       * update role call
       **/
      updateRole: AugmentedSubmittable<(roleId: U8aFixed | string | Uint8Array, name: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [U8aFixed, Bytes]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    peaqStorage: {
      /**
       * Add a new item to the storage
       **/
      addItem: AugmentedSubmittable<(itemType: Bytes | string | Uint8Array, item: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Read storage item
       **/
      getItem: AugmentedSubmittable<(itemType: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Update an existing item in the storage
       **/
      updateItem: AugmentedSubmittable<(itemType: Bytes | string | Uint8Array, item: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, Bytes]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    polkadotXcm: {
      /**
       * Execute an XCM message from a local, signed, origin.
       * 
       * An event is deposited indicating whether `msg` could be executed completely or only
       * partially.
       * 
       * No more than `max_weight` will be used in its attempted execution. If this is less than the
       * maximum amount of weight that the message could take to be executed, then no execution
       * attempt will be made.
       * 
       * NOTE: A successful return to this does *not* imply that the `msg` was executed successfully
       * to completion; only that *some* of it was executed.
       **/
      execute: AugmentedSubmittable<(message: XcmVersionedXcm | { V0: any } | { V1: any } | { V2: any } | string | Uint8Array, maxWeight: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedXcm, WeightV1]>;
      /**
       * Set a safe XCM version (the version that XCM should be encoded with if the most recent
       * version a destination can accept is unknown).
       * 
       * - `origin`: Must be Root.
       * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
       **/
      forceDefaultXcmVersion: AugmentedSubmittable<(maybeXcmVersion: Option<u32> | null | Uint8Array | u32 | AnyNumber) => SubmittableExtrinsic<ApiType>, [Option<u32>]>;
      /**
       * Ask a location to notify us regarding their XCM version and any changes to it.
       * 
       * - `origin`: Must be Root.
       * - `location`: The location to which we should subscribe for XCM version notifications.
       **/
      forceSubscribeVersionNotify: AugmentedSubmittable<(location: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation]>;
      /**
       * Require that a particular destination should no longer notify us regarding any XCM
       * version changes.
       * 
       * - `origin`: Must be Root.
       * - `location`: The location to which we are currently subscribed for XCM version
       * notifications which we no longer desire.
       **/
      forceUnsubscribeVersionNotify: AugmentedSubmittable<(location: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation]>;
      /**
       * Extoll that a particular destination can be communicated with through a particular
       * version of XCM.
       * 
       * - `origin`: Must be Root.
       * - `location`: The destination that is being described.
       * - `xcm_version`: The latest version of XCM that `location` supports.
       **/
      forceXcmVersion: AugmentedSubmittable<(location: XcmV1MultiLocation | { parents?: any; interior?: any } | string | Uint8Array, xcmVersion: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmV1MultiLocation, u32]>;
      /**
       * Transfer some assets from the local chain to the sovereign account of a destination
       * chain and forward a notification XCM.
       * 
       * Fee payment on the destination side is made from the asset in the `assets` vector of
       * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
       * is needed than `weight_limit`, then the operation will fail and the assets send may be
       * at risk.
       * 
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
       * from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
       * an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
       * `dest` side.
       * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
       * fees.
       * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
       **/
      limitedReserveTransferAssets: AugmentedSubmittable<(dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, beneficiary: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, assets: XcmVersionedMultiAssets | { V0: any } | { V1: any } | string | Uint8Array, feeAssetItem: u32 | AnyNumber | Uint8Array, weightLimit: XcmV2WeightLimit | { Unlimited: any } | { Limited: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation, XcmVersionedMultiLocation, XcmVersionedMultiAssets, u32, XcmV2WeightLimit]>;
      /**
       * Teleport some assets from the local chain to some destination chain.
       * 
       * Fee payment on the destination side is made from the asset in the `assets` vector of
       * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
       * is needed than `weight_limit`, then the operation will fail and the assets send may be
       * at risk.
       * 
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
       * from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
       * an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
       * `dest` side. May not be empty.
       * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
       * fees.
       * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
       **/
      limitedTeleportAssets: AugmentedSubmittable<(dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, beneficiary: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, assets: XcmVersionedMultiAssets | { V0: any } | { V1: any } | string | Uint8Array, feeAssetItem: u32 | AnyNumber | Uint8Array, weightLimit: XcmV2WeightLimit | { Unlimited: any } | { Limited: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation, XcmVersionedMultiLocation, XcmVersionedMultiAssets, u32, XcmV2WeightLimit]>;
      /**
       * Transfer some assets from the local chain to the sovereign account of a destination
       * chain and forward a notification XCM.
       * 
       * Fee payment on the destination side is made from the asset in the `assets` vector of
       * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
       * with all fees taken as needed from the asset.
       * 
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
       * from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
       * an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
       * `dest` side.
       * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
       * fees.
       **/
      reserveTransferAssets: AugmentedSubmittable<(dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, beneficiary: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, assets: XcmVersionedMultiAssets | { V0: any } | { V1: any } | string | Uint8Array, feeAssetItem: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation, XcmVersionedMultiLocation, XcmVersionedMultiAssets, u32]>;
      send: AugmentedSubmittable<(dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, message: XcmVersionedXcm | { V0: any } | { V1: any } | { V2: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation, XcmVersionedXcm]>;
      /**
       * Teleport some assets from the local chain to some destination chain.
       * 
       * Fee payment on the destination side is made from the asset in the `assets` vector of
       * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
       * with all fees taken as needed from the asset.
       * 
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
       * from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
       * an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
       * `dest` side. May not be empty.
       * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
       * fees.
       **/
      teleportAssets: AugmentedSubmittable<(dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, beneficiary: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, assets: XcmVersionedMultiAssets | { V0: any } | { V1: any } | string | Uint8Array, feeAssetItem: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiLocation, XcmVersionedMultiLocation, XcmVersionedMultiAssets, u32]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    session: {
      /**
       * Removes any session key(s) of the function caller.
       * 
       * This doesn't take effect until the next session.
       * 
       * The dispatch origin of this function must be Signed and the account must be either be
       * convertible to a validator ID using the chain's typical addressing system (this usually
       * means being a controller account) or directly convertible into a validator ID (which
       * usually means being a stash account).
       * 
       * # <weight>
       * - Complexity: `O(1)` in number of key types. Actual cost depends on the number of length
       * of `T::Keys::key_ids()` which is fixed.
       * - DbReads: `T::ValidatorIdOf`, `NextKeys`, `origin account`
       * - DbWrites: `NextKeys`, `origin account`
       * - DbWrites per key id: `KeyOwner`
       * # </weight>
       **/
      purgeKeys: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Sets the session key(s) of the function caller to `keys`.
       * Allows an account to set its session key prior to becoming a validator.
       * This doesn't take effect until the next session.
       * 
       * The dispatch origin of this function must be signed.
       * 
       * # <weight>
       * - Complexity: `O(1)`. Actual cost depends on the number of length of
       * `T::Keys::key_ids()` which is fixed.
       * - DbReads: `origin account`, `T::ValidatorIdOf`, `NextKeys`
       * - DbWrites: `origin account`, `NextKeys`
       * - DbReads per key id: `KeyOwner`
       * - DbWrites per key id: `KeyOwner`
       * # </weight>
       **/
      setKeys: AugmentedSubmittable<(keys: PeaqDevRuntimeOpaqueSessionKeys | { aura?: any } | string | Uint8Array, proof: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PeaqDevRuntimeOpaqueSessionKeys, Bytes]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    sudo: {
      /**
       * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
       * key.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB change.
       * # </weight>
       **/
      setKey: AugmentedSubmittable<(updated: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress]>;
      /**
       * Authenticates the sudo key and dispatches a function call with `Root` origin.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB write (event).
       * - Weight of derivative `call` execution + 10,000.
       * # </weight>
       **/
      sudo: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call]>;
      /**
       * Authenticates the sudo key and dispatches a function call with `Signed` origin from
       * a given account.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB write (event).
       * - Weight of derivative `call` execution + 10,000.
       * # </weight>
       **/
      sudoAs: AugmentedSubmittable<(who: MultiAddress | { Id: any } | { Index: any } | { Raw: any } | { Address32: any } | { Address20: any } | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [MultiAddress, Call]>;
      /**
       * Authenticates the sudo key and dispatches a function call with `Root` origin.
       * This function does not check the weight of the call, and instead allows the
       * Sudo user to specify the weight of the call.
       * 
       * The dispatch origin for this call must be _Signed_.
       * 
       * # <weight>
       * - O(1).
       * - The weight of this call is defined by the caller.
       * # </weight>
       **/
      sudoUncheckedWeight: AugmentedSubmittable<(call: Call | IMethod | string | Uint8Array, weight: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Call, WeightV1]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    system: {
      /**
       * A dispatch that will fill the block weight up to the given ratio.
       **/
      fillBlock: AugmentedSubmittable<(ratio: Perbill | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Perbill]>;
      /**
       * Kill all storage items with a key that starts with the given prefix.
       * 
       * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
       * the prefix we are removing to accurately calculate the weight of this function.
       **/
      killPrefix: AugmentedSubmittable<(prefix: Bytes | string | Uint8Array, subkeys: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes, u32]>;
      /**
       * Kill some items from storage.
       **/
      killStorage: AugmentedSubmittable<(keys: Vec<Bytes> | (Bytes | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Bytes>]>;
      /**
       * Make some on-chain remark.
       * 
       * # <weight>
       * - `O(1)`
       * # </weight>
       **/
      remark: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Make some on-chain remark and emit event.
       **/
      remarkWithEvent: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the new runtime code.
       * 
       * # <weight>
       * - `O(C + S)` where `C` length of `code` and `S` complexity of `can_set_code`
       * - 1 call to `can_set_code`: `O(S)` (calls `sp_io::misc::runtime_version` which is
       * expensive).
       * - 1 storage write (codec `O(C)`).
       * - 1 digest item.
       * - 1 event.
       * The weight of this function is dependent on the runtime, but generally this is very
       * expensive. We will treat this as a full block.
       * # </weight>
       **/
      setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the new runtime code without doing any checks of the given `code`.
       * 
       * # <weight>
       * - `O(C)` where `C` length of `code`
       * - 1 storage write (codec `O(C)`).
       * - 1 digest item.
       * - 1 event.
       * The weight of this function is dependent on the runtime. We will treat this as a full
       * block. # </weight>
       **/
      setCodeWithoutChecks: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Set the number of pages in the WebAssembly environment's heap.
       **/
      setHeapPages: AugmentedSubmittable<(pages: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64]>;
      /**
       * Set some items of storage.
       **/
      setStorage: AugmentedSubmittable<(items: Vec<ITuple<[Bytes, Bytes]>> | ([Bytes | string | Uint8Array, Bytes | string | Uint8Array])[]) => SubmittableExtrinsic<ApiType>, [Vec<ITuple<[Bytes, Bytes]>>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    timestamp: {
      /**
       * Set the current time.
       * 
       * This call should be invoked exactly once per block. It will panic at the finalization
       * phase, if this call hasn't been invoked by that time.
       * 
       * The timestamp should be greater than the previous one by the amount specified by
       * `MinimumPeriod`.
       * 
       * The dispatch origin for this call must be `Inherent`.
       * 
       * # <weight>
       * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
       * - 1 storage read and 1 storage mutation (codec `O(1)`). (because of `DidUpdate::take` in
       * `on_finalize`)
       * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
       * # </weight>
       **/
      set: AugmentedSubmittable<(now: Compact<u64> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Compact<u64>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    transaction: {
      serviceDelivered: AugmentedSubmittable<(consumer: AccountId32 | string | Uint8Array, refundInfo: PeaqPalletTransactionStructsDeliveredInfo | { tokenNum?: any; txHash?: any; timePoint?: any; callHash?: any } | string | Uint8Array, spentInfo: PeaqPalletTransactionStructsDeliveredInfo | { tokenNum?: any; txHash?: any; timePoint?: any; callHash?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, PeaqPalletTransactionStructsDeliveredInfo, PeaqPalletTransactionStructsDeliveredInfo]>;
      serviceRequested: AugmentedSubmittable<(provider: AccountId32 | string | Uint8Array, tokenDeposited: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [AccountId32, u128]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    utility: {
      /**
       * Send a call through an indexed pseudonym of the sender.
       * 
       * Filter from origin are passed along. The call will be dispatched with an origin which
       * use the same filter as the origin of this call.
       * 
       * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
       * because you expect `proxy` to have been used prior in the call stack and you do not want
       * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
       * in the Multisig pallet instead.
       * 
       * NOTE: Prior to version *12, this was called `as_limited_sub`.
       * 
       * The dispatch origin for this call must be _Signed_.
       **/
      asDerivative: AugmentedSubmittable<(index: u16 | AnyNumber | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [u16, Call]>;
      /**
       * Send a batch of dispatch calls.
       * 
       * May be called from any origin.
       * 
       * - `calls`: The calls to be dispatched from the same origin. The number of call must not
       * exceed the constant: `batched_calls_limit` (available in constant metadata).
       * 
       * If origin is root then call are dispatch without checking origin filter. (This includes
       * bypassing `frame_system::Config::BaseCallFilter`).
       * 
       * # <weight>
       * - Complexity: O(C) where C is the number of calls to be batched.
       * # </weight>
       * 
       * This will return `Ok` in all circumstances. To determine the success of the batch, an
       * event is deposited. If a call failed and the batch was interrupted, then the
       * `BatchInterrupted` event is deposited, along with the number of successful calls made
       * and the error of the failed call. If all were successful, then the `BatchCompleted`
       * event is deposited.
       **/
      batch: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * Send a batch of dispatch calls and atomically execute them.
       * The whole transaction will rollback and fail if any of the calls failed.
       * 
       * May be called from any origin.
       * 
       * - `calls`: The calls to be dispatched from the same origin. The number of call must not
       * exceed the constant: `batched_calls_limit` (available in constant metadata).
       * 
       * If origin is root then call are dispatch without checking origin filter. (This includes
       * bypassing `frame_system::Config::BaseCallFilter`).
       * 
       * # <weight>
       * - Complexity: O(C) where C is the number of calls to be batched.
       * # </weight>
       **/
      batchAll: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * Dispatches a function call with a provided origin.
       * 
       * The dispatch origin for this call must be _Root_.
       * 
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB write (event).
       * - Weight of derivative `call` execution + T::WeightInfo::dispatch_as().
       * # </weight>
       **/
      dispatchAs: AugmentedSubmittable<(asOrigin: PeaqDevRuntimeOriginCaller | { system: any } | { Void: any } | { Ethereum: any } | { PolkadotXcm: any } | { CumulusXcm: any } | string | Uint8Array, call: Call | IMethod | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [PeaqDevRuntimeOriginCaller, Call]>;
      /**
       * Send a batch of dispatch calls.
       * Unlike `batch`, it allows errors and won't interrupt.
       * 
       * May be called from any origin.
       * 
       * - `calls`: The calls to be dispatched from the same origin. The number of call must not
       * exceed the constant: `batched_calls_limit` (available in constant metadata).
       * 
       * If origin is root then call are dispatch without checking origin filter. (This includes
       * bypassing `frame_system::Config::BaseCallFilter`).
       * 
       * # <weight>
       * - Complexity: O(C) where C is the number of calls to be batched.
       * # </weight>
       **/
      forceBatch: AugmentedSubmittable<(calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>, [Vec<Call>]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    xcmpQueue: {
      /**
       * Resumes all XCM executions for the XCMP queue.
       * 
       * Note that this function doesn't change the status of the in/out bound channels.
       * 
       * - `origin`: Must pass `ControllerOrigin`.
       **/
      resumeXcmExecution: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Services a single overweight XCM.
       * 
       * - `origin`: Must pass `ExecuteOverweightOrigin`.
       * - `index`: The index of the overweight XCM to service
       * - `weight_limit`: The amount of weight that XCM execution may take.
       * 
       * Errors:
       * - `BadOverweightIndex`: XCM under `index` is not found in the `Overweight` storage map.
       * - `BadXcm`: XCM under `index` cannot be properly decoded into a valid XCM format.
       * - `WeightOverLimit`: XCM execution may use greater `weight_limit`.
       * 
       * Events:
       * - `OverweightServiced`: On success.
       **/
      serviceOverweight: AugmentedSubmittable<(index: u64 | AnyNumber | Uint8Array, weightLimit: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u64, WeightV1]>;
      /**
       * Suspends all XCM executions for the XCMP queue, regardless of the sender's origin.
       * 
       * - `origin`: Must pass `ControllerOrigin`.
       **/
      suspendXcmExecution: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Overwrites the number of pages of messages which must be in the queue after which we drop any further
       * messages from the channel.
       * 
       * - `origin`: Must pass `Root`.
       * - `new`: Desired value for `QueueConfigData.drop_threshold`
       **/
      updateDropThreshold: AugmentedSubmittable<(updated: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Overwrites the number of pages of messages which the queue must be reduced to before it signals that
       * message sending may recommence after it has been suspended.
       * 
       * - `origin`: Must pass `Root`.
       * - `new`: Desired value for `QueueConfigData.resume_threshold`
       **/
      updateResumeThreshold: AugmentedSubmittable<(updated: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Overwrites the number of pages of messages which must be in the queue for the other side to be told to
       * suspend their sending.
       * 
       * - `origin`: Must pass `Root`.
       * - `new`: Desired value for `QueueConfigData.suspend_value`
       **/
      updateSuspendThreshold: AugmentedSubmittable<(updated: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u32]>;
      /**
       * Overwrites the amount of remaining weight under which we stop processing messages.
       * 
       * - `origin`: Must pass `Root`.
       * - `new`: Desired value for `QueueConfigData.threshold_weight`
       **/
      updateThresholdWeight: AugmentedSubmittable<(updated: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [WeightV1]>;
      /**
       * Overwrites the speed to which the available weight approaches the maximum weight.
       * A lower number results in a faster progression. A value of 1 makes the entire weight available initially.
       * 
       * - `origin`: Must pass `Root`.
       * - `new`: Desired value for `QueueConfigData.weight_restrict_decay`.
       **/
      updateWeightRestrictDecay: AugmentedSubmittable<(updated: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [WeightV1]>;
      /**
       * Overwrite the maximum amount of weight any individual message may consume.
       * Messages above this weight go into the overweight queue and may only be serviced explicitly.
       * 
       * - `origin`: Must pass `Root`.
       * - `new`: Desired value for `QueueConfigData.xcmp_max_individual_weight`.
       **/
      updateXcmpMaxIndividualWeight: AugmentedSubmittable<(updated: WeightV1 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [WeightV1]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    xTokens: {
      /**
       * Transfer native currencies.
       * 
       * `dest_weight` is the weight for XCM execution on the dest chain, and
       * it would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be
       * received.
       * 
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered
       * by the network, and if the receiving chain would handle
       * messages correctly.
       **/
      transfer: AugmentedSubmittable<(currencyId: PeaqPrimitivesXcmCurrencyCurrencyId | { Token: any } | { Erc20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array, dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, destWeight: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [PeaqPrimitivesXcmCurrencyCurrencyId, u128, XcmVersionedMultiLocation, u64]>;
      /**
       * Transfer `MultiAsset`.
       * 
       * `dest_weight` is the weight for XCM execution on the dest chain, and
       * it would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be
       * received.
       * 
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered
       * by the network, and if the receiving chain would handle
       * messages correctly.
       **/
      transferMultiasset: AugmentedSubmittable<(asset: XcmVersionedMultiAsset | { V0: any } | { V1: any } | string | Uint8Array, dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, destWeight: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiAsset, XcmVersionedMultiLocation, u64]>;
      /**
       * Transfer several `MultiAsset` specifying the item to be used as fee
       * 
       * `dest_weight` is the weight for XCM execution on the dest chain, and
       * it would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be
       * received.
       * 
       * `fee_item` is index of the MultiAssets that we want to use for
       * payment
       * 
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered
       * by the network, and if the receiving chain would handle
       * messages correctly.
       **/
      transferMultiassets: AugmentedSubmittable<(assets: XcmVersionedMultiAssets | { V0: any } | { V1: any } | string | Uint8Array, feeItem: u32 | AnyNumber | Uint8Array, dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, destWeight: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiAssets, u32, XcmVersionedMultiLocation, u64]>;
      /**
       * Transfer `MultiAsset` specifying the fee and amount as separate.
       * 
       * `dest_weight` is the weight for XCM execution on the dest chain, and
       * it would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be
       * received.
       * 
       * `fee` is the multiasset to be spent to pay for execution in
       * destination chain. Both fee and amount will be subtracted form the
       * callers balance For now we only accept fee and asset having the same
       * `MultiLocation` id.
       * 
       * If `fee` is not high enough to cover for the execution costs in the
       * destination chain, then the assets will be trapped in the
       * destination chain
       * 
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered
       * by the network, and if the receiving chain would handle
       * messages correctly.
       **/
      transferMultiassetWithFee: AugmentedSubmittable<(asset: XcmVersionedMultiAsset | { V0: any } | { V1: any } | string | Uint8Array, fee: XcmVersionedMultiAsset | { V0: any } | { V1: any } | string | Uint8Array, dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, destWeight: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [XcmVersionedMultiAsset, XcmVersionedMultiAsset, XcmVersionedMultiLocation, u64]>;
      /**
       * Transfer several currencies specifying the item to be used as fee
       * 
       * `dest_weight` is the weight for XCM execution on the dest chain, and
       * it would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be
       * received.
       * 
       * `fee_item` is index of the currencies tuple that we want to use for
       * payment
       * 
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered
       * by the network, and if the receiving chain would handle
       * messages correctly.
       **/
      transferMulticurrencies: AugmentedSubmittable<(currencies: Vec<ITuple<[PeaqPrimitivesXcmCurrencyCurrencyId, u128]>> | ([PeaqPrimitivesXcmCurrencyCurrencyId | { Token: any } | { Erc20: any } | string | Uint8Array, u128 | AnyNumber | Uint8Array])[], feeItem: u32 | AnyNumber | Uint8Array, dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, destWeight: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [Vec<ITuple<[PeaqPrimitivesXcmCurrencyCurrencyId, u128]>>, u32, XcmVersionedMultiLocation, u64]>;
      /**
       * Transfer native currencies specifying the fee and amount as
       * separate.
       * 
       * `dest_weight` is the weight for XCM execution on the dest chain, and
       * it would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be
       * received.
       * 
       * `fee` is the amount to be spent to pay for execution in destination
       * chain. Both fee and amount will be subtracted form the callers
       * balance.
       * 
       * If `fee` is not high enough to cover for the execution costs in the
       * destination chain, then the assets will be trapped in the
       * destination chain
       * 
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered
       * by the network, and if the receiving chain would handle
       * messages correctly.
       **/
      transferWithFee: AugmentedSubmittable<(currencyId: PeaqPrimitivesXcmCurrencyCurrencyId | { Token: any } | { Erc20: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array, fee: u128 | AnyNumber | Uint8Array, dest: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array, destWeight: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [PeaqPrimitivesXcmCurrencyCurrencyId, u128, u128, XcmVersionedMultiLocation, u64]>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
  } // AugmentedSubmittables
} // declare module
