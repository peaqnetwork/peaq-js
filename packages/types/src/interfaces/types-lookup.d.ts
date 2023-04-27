import '@polkadot/types/lookup';
import type { BTreeMap, BTreeSet, Bytes, Compact, Enum, Null, Option, Result, Struct, Text, U256, U8aFixed, Vec, WrapperKeepOpaque, bool, i128, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, Call, H160, H256, MultiAddress, Perbill, Permill, Perquintill, WeightV1 } from '@polkadot/types/interfaces/runtime';
import type { Event } from '@polkadot/types/interfaces/system';
declare module '@polkadot/types/lookup' {
    /** @name FrameSystemAccountInfo (3) */
    interface FrameSystemAccountInfo extends Struct {
        readonly nonce: u32;
        readonly consumers: u32;
        readonly providers: u32;
        readonly sufficients: u32;
        readonly data: PalletBalancesAccountData;
    }
    /** @name PalletBalancesAccountData (5) */
    interface PalletBalancesAccountData extends Struct {
        readonly free: u128;
        readonly reserved: u128;
        readonly miscFrozen: u128;
        readonly feeFrozen: u128;
    }
    /** @name FrameSupportWeightsPerDispatchClassWeight (7) */
    interface FrameSupportWeightsPerDispatchClassWeight extends Struct {
        readonly normal: WeightV1;
        readonly operational: WeightV1;
        readonly mandatory: WeightV1;
    }
    /** @name SpRuntimeDigest (12) */
    interface SpRuntimeDigest extends Struct {
        readonly logs: Vec<SpRuntimeDigestDigestItem>;
    }
    /** @name SpRuntimeDigestDigestItem (14) */
    interface SpRuntimeDigestDigestItem extends Enum {
        readonly isOther: boolean;
        readonly asOther: Bytes;
        readonly isConsensus: boolean;
        readonly asConsensus: ITuple<[U8aFixed, Bytes]>;
        readonly isSeal: boolean;
        readonly asSeal: ITuple<[U8aFixed, Bytes]>;
        readonly isPreRuntime: boolean;
        readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>;
        readonly isRuntimeEnvironmentUpdated: boolean;
        readonly type: 'Other' | 'Consensus' | 'Seal' | 'PreRuntime' | 'RuntimeEnvironmentUpdated';
    }
    /** @name FrameSystemEventRecord (17) */
    interface FrameSystemEventRecord extends Struct {
        readonly phase: FrameSystemPhase;
        readonly event: Event;
        readonly topics: Vec<H256>;
    }
    /** @name FrameSystemEvent (19) */
    interface FrameSystemEvent extends Enum {
        readonly isExtrinsicSuccess: boolean;
        readonly asExtrinsicSuccess: {
            readonly dispatchInfo: FrameSupportWeightsDispatchInfo;
        } & Struct;
        readonly isExtrinsicFailed: boolean;
        readonly asExtrinsicFailed: {
            readonly dispatchError: SpRuntimeDispatchError;
            readonly dispatchInfo: FrameSupportWeightsDispatchInfo;
        } & Struct;
        readonly isCodeUpdated: boolean;
        readonly isNewAccount: boolean;
        readonly asNewAccount: {
            readonly account: AccountId32;
        } & Struct;
        readonly isKilledAccount: boolean;
        readonly asKilledAccount: {
            readonly account: AccountId32;
        } & Struct;
        readonly isRemarked: boolean;
        readonly asRemarked: {
            readonly sender: AccountId32;
            readonly hash_: H256;
        } & Struct;
        readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked';
    }
    /** @name FrameSupportWeightsDispatchInfo (20) */
    interface FrameSupportWeightsDispatchInfo extends Struct {
        readonly weight: WeightV1;
        readonly class: FrameSupportWeightsDispatchClass;
        readonly paysFee: FrameSupportWeightsPays;
    }
    /** @name FrameSupportWeightsDispatchClass (21) */
    interface FrameSupportWeightsDispatchClass extends Enum {
        readonly isNormal: boolean;
        readonly isOperational: boolean;
        readonly isMandatory: boolean;
        readonly type: 'Normal' | 'Operational' | 'Mandatory';
    }
    /** @name FrameSupportWeightsPays (22) */
    interface FrameSupportWeightsPays extends Enum {
        readonly isYes: boolean;
        readonly isNo: boolean;
        readonly type: 'Yes' | 'No';
    }
    /** @name SpRuntimeDispatchError (23) */
    interface SpRuntimeDispatchError extends Enum {
        readonly isOther: boolean;
        readonly isCannotLookup: boolean;
        readonly isBadOrigin: boolean;
        readonly isModule: boolean;
        readonly asModule: SpRuntimeModuleError;
        readonly isConsumerRemaining: boolean;
        readonly isNoProviders: boolean;
        readonly isTooManyConsumers: boolean;
        readonly isToken: boolean;
        readonly asToken: SpRuntimeTokenError;
        readonly isArithmetic: boolean;
        readonly asArithmetic: SpRuntimeArithmeticError;
        readonly isTransactional: boolean;
        readonly asTransactional: SpRuntimeTransactionalError;
        readonly type: 'Other' | 'CannotLookup' | 'BadOrigin' | 'Module' | 'ConsumerRemaining' | 'NoProviders' | 'TooManyConsumers' | 'Token' | 'Arithmetic' | 'Transactional';
    }
    /** @name SpRuntimeModuleError (24) */
    interface SpRuntimeModuleError extends Struct {
        readonly index: u8;
        readonly error: U8aFixed;
    }
    /** @name SpRuntimeTokenError (25) */
    interface SpRuntimeTokenError extends Enum {
        readonly isNoFunds: boolean;
        readonly isWouldDie: boolean;
        readonly isBelowMinimum: boolean;
        readonly isCannotCreate: boolean;
        readonly isUnknownAsset: boolean;
        readonly isFrozen: boolean;
        readonly isUnsupported: boolean;
        readonly type: 'NoFunds' | 'WouldDie' | 'BelowMinimum' | 'CannotCreate' | 'UnknownAsset' | 'Frozen' | 'Unsupported';
    }
    /** @name SpRuntimeArithmeticError (26) */
    interface SpRuntimeArithmeticError extends Enum {
        readonly isUnderflow: boolean;
        readonly isOverflow: boolean;
        readonly isDivisionByZero: boolean;
        readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero';
    }
    /** @name SpRuntimeTransactionalError (27) */
    interface SpRuntimeTransactionalError extends Enum {
        readonly isLimitReached: boolean;
        readonly isNoLayer: boolean;
        readonly type: 'LimitReached' | 'NoLayer';
    }
    /** @name PalletBalancesEvent (28) */
    interface PalletBalancesEvent extends Enum {
        readonly isEndowed: boolean;
        readonly asEndowed: {
            readonly account: AccountId32;
            readonly freeBalance: u128;
        } & Struct;
        readonly isDustLost: boolean;
        readonly asDustLost: {
            readonly account: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isTransfer: boolean;
        readonly asTransfer: {
            readonly from: AccountId32;
            readonly to: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isBalanceSet: boolean;
        readonly asBalanceSet: {
            readonly who: AccountId32;
            readonly free: u128;
            readonly reserved: u128;
        } & Struct;
        readonly isReserved: boolean;
        readonly asReserved: {
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isUnreserved: boolean;
        readonly asUnreserved: {
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isReserveRepatriated: boolean;
        readonly asReserveRepatriated: {
            readonly from: AccountId32;
            readonly to: AccountId32;
            readonly amount: u128;
            readonly destinationStatus: FrameSupportTokensMiscBalanceStatus;
        } & Struct;
        readonly isDeposit: boolean;
        readonly asDeposit: {
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isWithdraw: boolean;
        readonly asWithdraw: {
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isSlashed: boolean;
        readonly asSlashed: {
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'BalanceSet' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'Deposit' | 'Withdraw' | 'Slashed';
    }
    /** @name FrameSupportTokensMiscBalanceStatus (29) */
    interface FrameSupportTokensMiscBalanceStatus extends Enum {
        readonly isFree: boolean;
        readonly isReserved: boolean;
        readonly type: 'Free' | 'Reserved';
    }
    /** @name PalletTransactionPaymentEvent (30) */
    interface PalletTransactionPaymentEvent extends Enum {
        readonly isTransactionFeePaid: boolean;
        readonly asTransactionFeePaid: {
            readonly who: AccountId32;
            readonly actualFee: u128;
            readonly tip: u128;
        } & Struct;
        readonly type: 'TransactionFeePaid';
    }
    /** @name PalletSudoEvent (31) */
    interface PalletSudoEvent extends Enum {
        readonly isSudid: boolean;
        readonly asSudid: {
            readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
        } & Struct;
        readonly isKeyChanged: boolean;
        readonly asKeyChanged: {
            readonly oldSudoer: Option<AccountId32>;
        } & Struct;
        readonly isSudoAsDone: boolean;
        readonly asSudoAsDone: {
            readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
        } & Struct;
        readonly type: 'Sudid' | 'KeyChanged' | 'SudoAsDone';
    }
    /** @name PalletContractsEvent (35) */
    interface PalletContractsEvent extends Enum {
        readonly isInstantiated: boolean;
        readonly asInstantiated: {
            readonly deployer: AccountId32;
            readonly contract: AccountId32;
        } & Struct;
        readonly isTerminated: boolean;
        readonly asTerminated: {
            readonly contract: AccountId32;
            readonly beneficiary: AccountId32;
        } & Struct;
        readonly isCodeStored: boolean;
        readonly asCodeStored: {
            readonly codeHash: H256;
        } & Struct;
        readonly isContractEmitted: boolean;
        readonly asContractEmitted: {
            readonly contract: AccountId32;
            readonly data: Bytes;
        } & Struct;
        readonly isCodeRemoved: boolean;
        readonly asCodeRemoved: {
            readonly codeHash: H256;
        } & Struct;
        readonly isContractCodeUpdated: boolean;
        readonly asContractCodeUpdated: {
            readonly contract: AccountId32;
            readonly newCodeHash: H256;
            readonly oldCodeHash: H256;
        } & Struct;
        readonly isCalled: boolean;
        readonly asCalled: {
            readonly caller: AccountId32;
            readonly contract: AccountId32;
        } & Struct;
        readonly isDelegateCalled: boolean;
        readonly asDelegateCalled: {
            readonly contract: AccountId32;
            readonly codeHash: H256;
        } & Struct;
        readonly type: 'Instantiated' | 'Terminated' | 'CodeStored' | 'ContractEmitted' | 'CodeRemoved' | 'ContractCodeUpdated' | 'Called' | 'DelegateCalled';
    }
    /** @name PalletUtilityEvent (36) */
    interface PalletUtilityEvent extends Enum {
        readonly isBatchInterrupted: boolean;
        readonly asBatchInterrupted: {
            readonly index: u32;
            readonly error: SpRuntimeDispatchError;
        } & Struct;
        readonly isBatchCompleted: boolean;
        readonly isBatchCompletedWithErrors: boolean;
        readonly isItemCompleted: boolean;
        readonly isItemFailed: boolean;
        readonly asItemFailed: {
            readonly error: SpRuntimeDispatchError;
        } & Struct;
        readonly isDispatchedAs: boolean;
        readonly asDispatchedAs: {
            readonly result: Result<Null, SpRuntimeDispatchError>;
        } & Struct;
        readonly type: 'BatchInterrupted' | 'BatchCompleted' | 'BatchCompletedWithErrors' | 'ItemCompleted' | 'ItemFailed' | 'DispatchedAs';
    }
    /** @name PalletEthereumEvent (37) */
    interface PalletEthereumEvent extends Enum {
        readonly isExecuted: boolean;
        readonly asExecuted: {
            readonly from: H160;
            readonly to: H160;
            readonly transactionHash: H256;
            readonly exitReason: EvmCoreErrorExitReason;
        } & Struct;
        readonly type: 'Executed';
    }
    /** @name EvmCoreErrorExitReason (40) */
    interface EvmCoreErrorExitReason extends Enum {
        readonly isSucceed: boolean;
        readonly asSucceed: EvmCoreErrorExitSucceed;
        readonly isError: boolean;
        readonly asError: EvmCoreErrorExitError;
        readonly isRevert: boolean;
        readonly asRevert: EvmCoreErrorExitRevert;
        readonly isFatal: boolean;
        readonly asFatal: EvmCoreErrorExitFatal;
        readonly type: 'Succeed' | 'Error' | 'Revert' | 'Fatal';
    }
    /** @name EvmCoreErrorExitSucceed (41) */
    interface EvmCoreErrorExitSucceed extends Enum {
        readonly isStopped: boolean;
        readonly isReturned: boolean;
        readonly isSuicided: boolean;
        readonly type: 'Stopped' | 'Returned' | 'Suicided';
    }
    /** @name EvmCoreErrorExitError (42) */
    interface EvmCoreErrorExitError extends Enum {
        readonly isStackUnderflow: boolean;
        readonly isStackOverflow: boolean;
        readonly isInvalidJump: boolean;
        readonly isInvalidRange: boolean;
        readonly isDesignatedInvalid: boolean;
        readonly isCallTooDeep: boolean;
        readonly isCreateCollision: boolean;
        readonly isCreateContractLimit: boolean;
        readonly isOutOfOffset: boolean;
        readonly isOutOfGas: boolean;
        readonly isOutOfFund: boolean;
        readonly isPcUnderflow: boolean;
        readonly isCreateEmpty: boolean;
        readonly isOther: boolean;
        readonly asOther: Text;
        readonly isInvalidCode: boolean;
        readonly asInvalidCode: u8;
        readonly type: 'StackUnderflow' | 'StackOverflow' | 'InvalidJump' | 'InvalidRange' | 'DesignatedInvalid' | 'CallTooDeep' | 'CreateCollision' | 'CreateContractLimit' | 'OutOfOffset' | 'OutOfGas' | 'OutOfFund' | 'PcUnderflow' | 'CreateEmpty' | 'Other' | 'InvalidCode';
    }
    /** @name EvmCoreErrorExitRevert (46) */
    interface EvmCoreErrorExitRevert extends Enum {
        readonly isReverted: boolean;
        readonly type: 'Reverted';
    }
    /** @name EvmCoreErrorExitFatal (47) */
    interface EvmCoreErrorExitFatal extends Enum {
        readonly isNotSupported: boolean;
        readonly isUnhandledInterrupt: boolean;
        readonly isCallErrorAsFatal: boolean;
        readonly asCallErrorAsFatal: EvmCoreErrorExitError;
        readonly isOther: boolean;
        readonly asOther: Text;
        readonly type: 'NotSupported' | 'UnhandledInterrupt' | 'CallErrorAsFatal' | 'Other';
    }
    /** @name PalletEvmEvent (48) */
    interface PalletEvmEvent extends Enum {
        readonly isLog: boolean;
        readonly asLog: {
            readonly log: EthereumLog;
        } & Struct;
        readonly isCreated: boolean;
        readonly asCreated: {
            readonly address: H160;
        } & Struct;
        readonly isCreatedFailed: boolean;
        readonly asCreatedFailed: {
            readonly address: H160;
        } & Struct;
        readonly isExecuted: boolean;
        readonly asExecuted: {
            readonly address: H160;
        } & Struct;
        readonly isExecutedFailed: boolean;
        readonly asExecutedFailed: {
            readonly address: H160;
        } & Struct;
        readonly type: 'Log' | 'Created' | 'CreatedFailed' | 'Executed' | 'ExecutedFailed';
    }
    /** @name EthereumLog (49) */
    interface EthereumLog extends Struct {
        readonly address: H160;
        readonly topics: Vec<H256>;
        readonly data: Bytes;
    }
    /** @name PalletBaseFeeEvent (51) */
    interface PalletBaseFeeEvent extends Enum {
        readonly isNewBaseFeePerGas: boolean;
        readonly asNewBaseFeePerGas: {
            readonly fee: U256;
        } & Struct;
        readonly isBaseFeeOverflow: boolean;
        readonly isNewElasticity: boolean;
        readonly asNewElasticity: {
            readonly elasticity: Permill;
        } & Struct;
        readonly type: 'NewBaseFeePerGas' | 'BaseFeeOverflow' | 'NewElasticity';
    }
    /** @name PalletSessionEvent (55) */
    interface PalletSessionEvent extends Enum {
        readonly isNewSession: boolean;
        readonly asNewSession: {
            readonly sessionIndex: u32;
        } & Struct;
        readonly type: 'NewSession';
    }
    /** @name ParachainStakingEvent (56) */
    interface ParachainStakingEvent extends Enum {
        readonly isNewRound: boolean;
        readonly asNewRound: ITuple<[u32, u32]>;
        readonly isEnteredTopCandidates: boolean;
        readonly asEnteredTopCandidates: AccountId32;
        readonly isLeftTopCandidates: boolean;
        readonly asLeftTopCandidates: AccountId32;
        readonly isJoinedCollatorCandidates: boolean;
        readonly asJoinedCollatorCandidates: ITuple<[AccountId32, u128]>;
        readonly isCollatorStakedMore: boolean;
        readonly asCollatorStakedMore: ITuple<[AccountId32, u128, u128]>;
        readonly isCollatorStakedLess: boolean;
        readonly asCollatorStakedLess: ITuple<[AccountId32, u128, u128]>;
        readonly isCollatorScheduledExit: boolean;
        readonly asCollatorScheduledExit: ITuple<[u32, AccountId32, u32]>;
        readonly isCollatorCanceledExit: boolean;
        readonly asCollatorCanceledExit: AccountId32;
        readonly isCandidateLeft: boolean;
        readonly asCandidateLeft: ITuple<[AccountId32, u128]>;
        readonly isCollatorRemoved: boolean;
        readonly asCollatorRemoved: ITuple<[AccountId32, u128]>;
        readonly isMaxCandidateStakeChanged: boolean;
        readonly asMaxCandidateStakeChanged: u128;
        readonly isDelegatorStakedMore: boolean;
        readonly asDelegatorStakedMore: ITuple<[AccountId32, AccountId32, u128, u128]>;
        readonly isDelegatorStakedLess: boolean;
        readonly asDelegatorStakedLess: ITuple<[AccountId32, AccountId32, u128, u128]>;
        readonly isDelegatorLeft: boolean;
        readonly asDelegatorLeft: ITuple<[AccountId32, u128]>;
        readonly isDelegation: boolean;
        readonly asDelegation: ITuple<[AccountId32, u128, AccountId32, u128]>;
        readonly isDelegationReplaced: boolean;
        readonly asDelegationReplaced: ITuple<[AccountId32, u128, AccountId32, u128, AccountId32, u128]>;
        readonly isDelegatorLeftCollator: boolean;
        readonly asDelegatorLeftCollator: ITuple<[AccountId32, AccountId32, u128, u128]>;
        readonly isRewarded: boolean;
        readonly asRewarded: ITuple<[AccountId32, u128]>;
        readonly isRoundRewardRateSet: boolean;
        readonly asRoundRewardRateSet: ITuple<[Perquintill, Perquintill]>;
        readonly isMaxSelectedCandidatesSet: boolean;
        readonly asMaxSelectedCandidatesSet: ITuple<[u32, u32]>;
        readonly isBlocksPerRoundSet: boolean;
        readonly asBlocksPerRoundSet: ITuple<[u32, u32, u32, u32]>;
        readonly type: 'NewRound' | 'EnteredTopCandidates' | 'LeftTopCandidates' | 'JoinedCollatorCandidates' | 'CollatorStakedMore' | 'CollatorStakedLess' | 'CollatorScheduledExit' | 'CollatorCanceledExit' | 'CandidateLeft' | 'CollatorRemoved' | 'MaxCandidateStakeChanged' | 'DelegatorStakedMore' | 'DelegatorStakedLess' | 'DelegatorLeft' | 'Delegation' | 'DelegationReplaced' | 'DelegatorLeftCollator' | 'Rewarded' | 'RoundRewardRateSet' | 'MaxSelectedCandidatesSet' | 'BlocksPerRoundSet';
    }
    /** @name CumulusPalletParachainSystemEvent (58) */
    interface CumulusPalletParachainSystemEvent extends Enum {
        readonly isValidationFunctionStored: boolean;
        readonly isValidationFunctionApplied: boolean;
        readonly asValidationFunctionApplied: {
            readonly relayChainBlockNum: u32;
        } & Struct;
        readonly isValidationFunctionDiscarded: boolean;
        readonly isUpgradeAuthorized: boolean;
        readonly asUpgradeAuthorized: {
            readonly codeHash: H256;
        } & Struct;
        readonly isDownwardMessagesReceived: boolean;
        readonly asDownwardMessagesReceived: {
            readonly count: u32;
        } & Struct;
        readonly isDownwardMessagesProcessed: boolean;
        readonly asDownwardMessagesProcessed: {
            readonly weightUsed: WeightV1;
            readonly dmqHead: H256;
        } & Struct;
        readonly type: 'ValidationFunctionStored' | 'ValidationFunctionApplied' | 'ValidationFunctionDiscarded' | 'UpgradeAuthorized' | 'DownwardMessagesReceived' | 'DownwardMessagesProcessed';
    }
    /** @name PalletBlockRewardEvent (59) */
    interface PalletBlockRewardEvent extends Enum {
        readonly isDistributionConfigurationChanged: boolean;
        readonly asDistributionConfigurationChanged: PalletBlockRewardRewardDistributionConfig;
        readonly isBlockIssueRewardChanged: boolean;
        readonly asBlockIssueRewardChanged: u128;
        readonly isHardCapChanged: boolean;
        readonly asHardCapChanged: u128;
        readonly type: 'DistributionConfigurationChanged' | 'BlockIssueRewardChanged' | 'HardCapChanged';
    }
    /** @name PalletBlockRewardRewardDistributionConfig (60) */
    interface PalletBlockRewardRewardDistributionConfig extends Struct {
        readonly treasuryPercent: Compact<Perbill>;
        readonly dappsPercent: Compact<Perbill>;
        readonly collatorsPercent: Compact<Perbill>;
        readonly lpPercent: Compact<Perbill>;
        readonly machinesPercent: Compact<Perbill>;
        readonly machinesSubsidizationPercent: Compact<Perbill>;
    }
    /** @name CumulusPalletXcmpQueueEvent (63) */
    interface CumulusPalletXcmpQueueEvent extends Enum {
        readonly isSuccess: boolean;
        readonly asSuccess: {
            readonly messageHash: Option<H256>;
            readonly weight: WeightV1;
        } & Struct;
        readonly isFail: boolean;
        readonly asFail: {
            readonly messageHash: Option<H256>;
            readonly error: XcmV2TraitsError;
            readonly weight: WeightV1;
        } & Struct;
        readonly isBadVersion: boolean;
        readonly asBadVersion: {
            readonly messageHash: Option<H256>;
        } & Struct;
        readonly isBadFormat: boolean;
        readonly asBadFormat: {
            readonly messageHash: Option<H256>;
        } & Struct;
        readonly isUpwardMessageSent: boolean;
        readonly asUpwardMessageSent: {
            readonly messageHash: Option<H256>;
        } & Struct;
        readonly isXcmpMessageSent: boolean;
        readonly asXcmpMessageSent: {
            readonly messageHash: Option<H256>;
        } & Struct;
        readonly isOverweightEnqueued: boolean;
        readonly asOverweightEnqueued: {
            readonly sender: u32;
            readonly sentAt: u32;
            readonly index: u64;
            readonly required: WeightV1;
        } & Struct;
        readonly isOverweightServiced: boolean;
        readonly asOverweightServiced: {
            readonly index: u64;
            readonly used: WeightV1;
        } & Struct;
        readonly type: 'Success' | 'Fail' | 'BadVersion' | 'BadFormat' | 'UpwardMessageSent' | 'XcmpMessageSent' | 'OverweightEnqueued' | 'OverweightServiced';
    }
    /** @name XcmV2TraitsError (65) */
    interface XcmV2TraitsError extends Enum {
        readonly isOverflow: boolean;
        readonly isUnimplemented: boolean;
        readonly isUntrustedReserveLocation: boolean;
        readonly isUntrustedTeleportLocation: boolean;
        readonly isMultiLocationFull: boolean;
        readonly isMultiLocationNotInvertible: boolean;
        readonly isBadOrigin: boolean;
        readonly isInvalidLocation: boolean;
        readonly isAssetNotFound: boolean;
        readonly isFailedToTransactAsset: boolean;
        readonly isNotWithdrawable: boolean;
        readonly isLocationCannotHold: boolean;
        readonly isExceedsMaxMessageSize: boolean;
        readonly isDestinationUnsupported: boolean;
        readonly isTransport: boolean;
        readonly isUnroutable: boolean;
        readonly isUnknownClaim: boolean;
        readonly isFailedToDecode: boolean;
        readonly isMaxWeightInvalid: boolean;
        readonly isNotHoldingFees: boolean;
        readonly isTooExpensive: boolean;
        readonly isTrap: boolean;
        readonly asTrap: u64;
        readonly isUnhandledXcmVersion: boolean;
        readonly isWeightLimitReached: boolean;
        readonly asWeightLimitReached: u64;
        readonly isBarrier: boolean;
        readonly isWeightNotComputable: boolean;
        readonly type: 'Overflow' | 'Unimplemented' | 'UntrustedReserveLocation' | 'UntrustedTeleportLocation' | 'MultiLocationFull' | 'MultiLocationNotInvertible' | 'BadOrigin' | 'InvalidLocation' | 'AssetNotFound' | 'FailedToTransactAsset' | 'NotWithdrawable' | 'LocationCannotHold' | 'ExceedsMaxMessageSize' | 'DestinationUnsupported' | 'Transport' | 'Unroutable' | 'UnknownClaim' | 'FailedToDecode' | 'MaxWeightInvalid' | 'NotHoldingFees' | 'TooExpensive' | 'Trap' | 'UnhandledXcmVersion' | 'WeightLimitReached' | 'Barrier' | 'WeightNotComputable';
    }
    /** @name PalletXcmEvent (67) */
    interface PalletXcmEvent extends Enum {
        readonly isAttempted: boolean;
        readonly asAttempted: XcmV2TraitsOutcome;
        readonly isSent: boolean;
        readonly asSent: ITuple<[XcmV1MultiLocation, XcmV1MultiLocation, XcmV2Xcm]>;
        readonly isUnexpectedResponse: boolean;
        readonly asUnexpectedResponse: ITuple<[XcmV1MultiLocation, u64]>;
        readonly isResponseReady: boolean;
        readonly asResponseReady: ITuple<[u64, XcmV2Response]>;
        readonly isNotified: boolean;
        readonly asNotified: ITuple<[u64, u8, u8]>;
        readonly isNotifyOverweight: boolean;
        readonly asNotifyOverweight: ITuple<[u64, u8, u8, WeightV1, WeightV1]>;
        readonly isNotifyDispatchError: boolean;
        readonly asNotifyDispatchError: ITuple<[u64, u8, u8]>;
        readonly isNotifyDecodeFailed: boolean;
        readonly asNotifyDecodeFailed: ITuple<[u64, u8, u8]>;
        readonly isInvalidResponder: boolean;
        readonly asInvalidResponder: ITuple<[XcmV1MultiLocation, u64, Option<XcmV1MultiLocation>]>;
        readonly isInvalidResponderVersion: boolean;
        readonly asInvalidResponderVersion: ITuple<[XcmV1MultiLocation, u64]>;
        readonly isResponseTaken: boolean;
        readonly asResponseTaken: u64;
        readonly isAssetsTrapped: boolean;
        readonly asAssetsTrapped: ITuple<[H256, XcmV1MultiLocation, XcmVersionedMultiAssets]>;
        readonly isVersionChangeNotified: boolean;
        readonly asVersionChangeNotified: ITuple<[XcmV1MultiLocation, u32]>;
        readonly isSupportedVersionChanged: boolean;
        readonly asSupportedVersionChanged: ITuple<[XcmV1MultiLocation, u32]>;
        readonly isNotifyTargetSendFail: boolean;
        readonly asNotifyTargetSendFail: ITuple<[XcmV1MultiLocation, u64, XcmV2TraitsError]>;
        readonly isNotifyTargetMigrationFail: boolean;
        readonly asNotifyTargetMigrationFail: ITuple<[XcmVersionedMultiLocation, u64]>;
        readonly type: 'Attempted' | 'Sent' | 'UnexpectedResponse' | 'ResponseReady' | 'Notified' | 'NotifyOverweight' | 'NotifyDispatchError' | 'NotifyDecodeFailed' | 'InvalidResponder' | 'InvalidResponderVersion' | 'ResponseTaken' | 'AssetsTrapped' | 'VersionChangeNotified' | 'SupportedVersionChanged' | 'NotifyTargetSendFail' | 'NotifyTargetMigrationFail';
    }
    /** @name XcmV2TraitsOutcome (68) */
    interface XcmV2TraitsOutcome extends Enum {
        readonly isComplete: boolean;
        readonly asComplete: u64;
        readonly isIncomplete: boolean;
        readonly asIncomplete: ITuple<[u64, XcmV2TraitsError]>;
        readonly isError: boolean;
        readonly asError: XcmV2TraitsError;
        readonly type: 'Complete' | 'Incomplete' | 'Error';
    }
    /** @name XcmV1MultiLocation (69) */
    interface XcmV1MultiLocation extends Struct {
        readonly parents: u8;
        readonly interior: XcmV1MultilocationJunctions;
    }
    /** @name XcmV1MultilocationJunctions (70) */
    interface XcmV1MultilocationJunctions extends Enum {
        readonly isHere: boolean;
        readonly isX1: boolean;
        readonly asX1: XcmV1Junction;
        readonly isX2: boolean;
        readonly asX2: ITuple<[XcmV1Junction, XcmV1Junction]>;
        readonly isX3: boolean;
        readonly asX3: ITuple<[XcmV1Junction, XcmV1Junction, XcmV1Junction]>;
        readonly isX4: boolean;
        readonly asX4: ITuple<[XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction]>;
        readonly isX5: boolean;
        readonly asX5: ITuple<[XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction]>;
        readonly isX6: boolean;
        readonly asX6: ITuple<[XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction]>;
        readonly isX7: boolean;
        readonly asX7: ITuple<[XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction]>;
        readonly isX8: boolean;
        readonly asX8: ITuple<[XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction, XcmV1Junction]>;
        readonly type: 'Here' | 'X1' | 'X2' | 'X3' | 'X4' | 'X5' | 'X6' | 'X7' | 'X8';
    }
    /** @name XcmV1Junction (71) */
    interface XcmV1Junction extends Enum {
        readonly isParachain: boolean;
        readonly asParachain: Compact<u32>;
        readonly isAccountId32: boolean;
        readonly asAccountId32: {
            readonly network: XcmV0JunctionNetworkId;
            readonly id: U8aFixed;
        } & Struct;
        readonly isAccountIndex64: boolean;
        readonly asAccountIndex64: {
            readonly network: XcmV0JunctionNetworkId;
            readonly index: Compact<u64>;
        } & Struct;
        readonly isAccountKey20: boolean;
        readonly asAccountKey20: {
            readonly network: XcmV0JunctionNetworkId;
            readonly key: U8aFixed;
        } & Struct;
        readonly isPalletInstance: boolean;
        readonly asPalletInstance: u8;
        readonly isGeneralIndex: boolean;
        readonly asGeneralIndex: Compact<u128>;
        readonly isGeneralKey: boolean;
        readonly asGeneralKey: Bytes;
        readonly isOnlyChild: boolean;
        readonly isPlurality: boolean;
        readonly asPlurality: {
            readonly id: XcmV0JunctionBodyId;
            readonly part: XcmV0JunctionBodyPart;
        } & Struct;
        readonly type: 'Parachain' | 'AccountId32' | 'AccountIndex64' | 'AccountKey20' | 'PalletInstance' | 'GeneralIndex' | 'GeneralKey' | 'OnlyChild' | 'Plurality';
    }
    /** @name XcmV0JunctionNetworkId (73) */
    interface XcmV0JunctionNetworkId extends Enum {
        readonly isAny: boolean;
        readonly isNamed: boolean;
        readonly asNamed: Bytes;
        readonly isPolkadot: boolean;
        readonly isKusama: boolean;
        readonly type: 'Any' | 'Named' | 'Polkadot' | 'Kusama';
    }
    /** @name XcmV0JunctionBodyId (77) */
    interface XcmV0JunctionBodyId extends Enum {
        readonly isUnit: boolean;
        readonly isNamed: boolean;
        readonly asNamed: Bytes;
        readonly isIndex: boolean;
        readonly asIndex: Compact<u32>;
        readonly isExecutive: boolean;
        readonly isTechnical: boolean;
        readonly isLegislative: boolean;
        readonly isJudicial: boolean;
        readonly type: 'Unit' | 'Named' | 'Index' | 'Executive' | 'Technical' | 'Legislative' | 'Judicial';
    }
    /** @name XcmV0JunctionBodyPart (78) */
    interface XcmV0JunctionBodyPart extends Enum {
        readonly isVoice: boolean;
        readonly isMembers: boolean;
        readonly asMembers: {
            readonly count: Compact<u32>;
        } & Struct;
        readonly isFraction: boolean;
        readonly asFraction: {
            readonly nom: Compact<u32>;
            readonly denom: Compact<u32>;
        } & Struct;
        readonly isAtLeastProportion: boolean;
        readonly asAtLeastProportion: {
            readonly nom: Compact<u32>;
            readonly denom: Compact<u32>;
        } & Struct;
        readonly isMoreThanProportion: boolean;
        readonly asMoreThanProportion: {
            readonly nom: Compact<u32>;
            readonly denom: Compact<u32>;
        } & Struct;
        readonly type: 'Voice' | 'Members' | 'Fraction' | 'AtLeastProportion' | 'MoreThanProportion';
    }
    /** @name XcmV2Xcm (79) */
    interface XcmV2Xcm extends Vec<XcmV2Instruction> {
    }
    /** @name XcmV2Instruction (81) */
    interface XcmV2Instruction extends Enum {
        readonly isWithdrawAsset: boolean;
        readonly asWithdrawAsset: XcmV1MultiassetMultiAssets;
        readonly isReserveAssetDeposited: boolean;
        readonly asReserveAssetDeposited: XcmV1MultiassetMultiAssets;
        readonly isReceiveTeleportedAsset: boolean;
        readonly asReceiveTeleportedAsset: XcmV1MultiassetMultiAssets;
        readonly isQueryResponse: boolean;
        readonly asQueryResponse: {
            readonly queryId: Compact<u64>;
            readonly response: XcmV2Response;
            readonly maxWeight: Compact<u64>;
        } & Struct;
        readonly isTransferAsset: boolean;
        readonly asTransferAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly beneficiary: XcmV1MultiLocation;
        } & Struct;
        readonly isTransferReserveAsset: boolean;
        readonly asTransferReserveAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly dest: XcmV1MultiLocation;
            readonly xcm: XcmV2Xcm;
        } & Struct;
        readonly isTransact: boolean;
        readonly asTransact: {
            readonly originType: XcmV0OriginKind;
            readonly requireWeightAtMost: Compact<u64>;
            readonly call: XcmDoubleEncoded;
        } & Struct;
        readonly isHrmpNewChannelOpenRequest: boolean;
        readonly asHrmpNewChannelOpenRequest: {
            readonly sender: Compact<u32>;
            readonly maxMessageSize: Compact<u32>;
            readonly maxCapacity: Compact<u32>;
        } & Struct;
        readonly isHrmpChannelAccepted: boolean;
        readonly asHrmpChannelAccepted: {
            readonly recipient: Compact<u32>;
        } & Struct;
        readonly isHrmpChannelClosing: boolean;
        readonly asHrmpChannelClosing: {
            readonly initiator: Compact<u32>;
            readonly sender: Compact<u32>;
            readonly recipient: Compact<u32>;
        } & Struct;
        readonly isClearOrigin: boolean;
        readonly isDescendOrigin: boolean;
        readonly asDescendOrigin: XcmV1MultilocationJunctions;
        readonly isReportError: boolean;
        readonly asReportError: {
            readonly queryId: Compact<u64>;
            readonly dest: XcmV1MultiLocation;
            readonly maxResponseWeight: Compact<u64>;
        } & Struct;
        readonly isDepositAsset: boolean;
        readonly asDepositAsset: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly maxAssets: Compact<u32>;
            readonly beneficiary: XcmV1MultiLocation;
        } & Struct;
        readonly isDepositReserveAsset: boolean;
        readonly asDepositReserveAsset: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly maxAssets: Compact<u32>;
            readonly dest: XcmV1MultiLocation;
            readonly xcm: XcmV2Xcm;
        } & Struct;
        readonly isExchangeAsset: boolean;
        readonly asExchangeAsset: {
            readonly give: XcmV1MultiassetMultiAssetFilter;
            readonly receive: XcmV1MultiassetMultiAssets;
        } & Struct;
        readonly isInitiateReserveWithdraw: boolean;
        readonly asInitiateReserveWithdraw: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly reserve: XcmV1MultiLocation;
            readonly xcm: XcmV2Xcm;
        } & Struct;
        readonly isInitiateTeleport: boolean;
        readonly asInitiateTeleport: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly dest: XcmV1MultiLocation;
            readonly xcm: XcmV2Xcm;
        } & Struct;
        readonly isQueryHolding: boolean;
        readonly asQueryHolding: {
            readonly queryId: Compact<u64>;
            readonly dest: XcmV1MultiLocation;
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly maxResponseWeight: Compact<u64>;
        } & Struct;
        readonly isBuyExecution: boolean;
        readonly asBuyExecution: {
            readonly fees: XcmV1MultiAsset;
            readonly weightLimit: XcmV2WeightLimit;
        } & Struct;
        readonly isRefundSurplus: boolean;
        readonly isSetErrorHandler: boolean;
        readonly asSetErrorHandler: XcmV2Xcm;
        readonly isSetAppendix: boolean;
        readonly asSetAppendix: XcmV2Xcm;
        readonly isClearError: boolean;
        readonly isClaimAsset: boolean;
        readonly asClaimAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly ticket: XcmV1MultiLocation;
        } & Struct;
        readonly isTrap: boolean;
        readonly asTrap: Compact<u64>;
        readonly isSubscribeVersion: boolean;
        readonly asSubscribeVersion: {
            readonly queryId: Compact<u64>;
            readonly maxResponseWeight: Compact<u64>;
        } & Struct;
        readonly isUnsubscribeVersion: boolean;
        readonly type: 'WithdrawAsset' | 'ReserveAssetDeposited' | 'ReceiveTeleportedAsset' | 'QueryResponse' | 'TransferAsset' | 'TransferReserveAsset' | 'Transact' | 'HrmpNewChannelOpenRequest' | 'HrmpChannelAccepted' | 'HrmpChannelClosing' | 'ClearOrigin' | 'DescendOrigin' | 'ReportError' | 'DepositAsset' | 'DepositReserveAsset' | 'ExchangeAsset' | 'InitiateReserveWithdraw' | 'InitiateTeleport' | 'QueryHolding' | 'BuyExecution' | 'RefundSurplus' | 'SetErrorHandler' | 'SetAppendix' | 'ClearError' | 'ClaimAsset' | 'Trap' | 'SubscribeVersion' | 'UnsubscribeVersion';
    }
    /** @name XcmV1MultiassetMultiAssets (82) */
    interface XcmV1MultiassetMultiAssets extends Vec<XcmV1MultiAsset> {
    }
    /** @name XcmV1MultiAsset (84) */
    interface XcmV1MultiAsset extends Struct {
        readonly id: XcmV1MultiassetAssetId;
        readonly fun: XcmV1MultiassetFungibility;
    }
    /** @name XcmV1MultiassetAssetId (85) */
    interface XcmV1MultiassetAssetId extends Enum {
        readonly isConcrete: boolean;
        readonly asConcrete: XcmV1MultiLocation;
        readonly isAbstract: boolean;
        readonly asAbstract: Bytes;
        readonly type: 'Concrete' | 'Abstract';
    }
    /** @name XcmV1MultiassetFungibility (86) */
    interface XcmV1MultiassetFungibility extends Enum {
        readonly isFungible: boolean;
        readonly asFungible: Compact<u128>;
        readonly isNonFungible: boolean;
        readonly asNonFungible: XcmV1MultiassetAssetInstance;
        readonly type: 'Fungible' | 'NonFungible';
    }
    /** @name XcmV1MultiassetAssetInstance (87) */
    interface XcmV1MultiassetAssetInstance extends Enum {
        readonly isUndefined: boolean;
        readonly isIndex: boolean;
        readonly asIndex: Compact<u128>;
        readonly isArray4: boolean;
        readonly asArray4: U8aFixed;
        readonly isArray8: boolean;
        readonly asArray8: U8aFixed;
        readonly isArray16: boolean;
        readonly asArray16: U8aFixed;
        readonly isArray32: boolean;
        readonly asArray32: U8aFixed;
        readonly isBlob: boolean;
        readonly asBlob: Bytes;
        readonly type: 'Undefined' | 'Index' | 'Array4' | 'Array8' | 'Array16' | 'Array32' | 'Blob';
    }
    /** @name XcmV2Response (90) */
    interface XcmV2Response extends Enum {
        readonly isNull: boolean;
        readonly isAssets: boolean;
        readonly asAssets: XcmV1MultiassetMultiAssets;
        readonly isExecutionResult: boolean;
        readonly asExecutionResult: Option<ITuple<[u32, XcmV2TraitsError]>>;
        readonly isVersion: boolean;
        readonly asVersion: u32;
        readonly type: 'Null' | 'Assets' | 'ExecutionResult' | 'Version';
    }
    /** @name XcmV0OriginKind (93) */
    interface XcmV0OriginKind extends Enum {
        readonly isNative: boolean;
        readonly isSovereignAccount: boolean;
        readonly isSuperuser: boolean;
        readonly isXcm: boolean;
        readonly type: 'Native' | 'SovereignAccount' | 'Superuser' | 'Xcm';
    }
    /** @name XcmDoubleEncoded (94) */
    interface XcmDoubleEncoded extends Struct {
        readonly encoded: Bytes;
    }
    /** @name XcmV1MultiassetMultiAssetFilter (95) */
    interface XcmV1MultiassetMultiAssetFilter extends Enum {
        readonly isDefinite: boolean;
        readonly asDefinite: XcmV1MultiassetMultiAssets;
        readonly isWild: boolean;
        readonly asWild: XcmV1MultiassetWildMultiAsset;
        readonly type: 'Definite' | 'Wild';
    }
    /** @name XcmV1MultiassetWildMultiAsset (96) */
    interface XcmV1MultiassetWildMultiAsset extends Enum {
        readonly isAll: boolean;
        readonly isAllOf: boolean;
        readonly asAllOf: {
            readonly id: XcmV1MultiassetAssetId;
            readonly fun: XcmV1MultiassetWildFungibility;
        } & Struct;
        readonly type: 'All' | 'AllOf';
    }
    /** @name XcmV1MultiassetWildFungibility (97) */
    interface XcmV1MultiassetWildFungibility extends Enum {
        readonly isFungible: boolean;
        readonly isNonFungible: boolean;
        readonly type: 'Fungible' | 'NonFungible';
    }
    /** @name XcmV2WeightLimit (98) */
    interface XcmV2WeightLimit extends Enum {
        readonly isUnlimited: boolean;
        readonly isLimited: boolean;
        readonly asLimited: Compact<u64>;
        readonly type: 'Unlimited' | 'Limited';
    }
    /** @name XcmVersionedMultiAssets (100) */
    interface XcmVersionedMultiAssets extends Enum {
        readonly isV0: boolean;
        readonly asV0: Vec<XcmV0MultiAsset>;
        readonly isV1: boolean;
        readonly asV1: XcmV1MultiassetMultiAssets;
        readonly type: 'V0' | 'V1';
    }
    /** @name XcmV0MultiAsset (102) */
    interface XcmV0MultiAsset extends Enum {
        readonly isNone: boolean;
        readonly isAll: boolean;
        readonly isAllFungible: boolean;
        readonly isAllNonFungible: boolean;
        readonly isAllAbstractFungible: boolean;
        readonly asAllAbstractFungible: {
            readonly id: Bytes;
        } & Struct;
        readonly isAllAbstractNonFungible: boolean;
        readonly asAllAbstractNonFungible: {
            readonly class: Bytes;
        } & Struct;
        readonly isAllConcreteFungible: boolean;
        readonly asAllConcreteFungible: {
            readonly id: XcmV0MultiLocation;
        } & Struct;
        readonly isAllConcreteNonFungible: boolean;
        readonly asAllConcreteNonFungible: {
            readonly class: XcmV0MultiLocation;
        } & Struct;
        readonly isAbstractFungible: boolean;
        readonly asAbstractFungible: {
            readonly id: Bytes;
            readonly amount: Compact<u128>;
        } & Struct;
        readonly isAbstractNonFungible: boolean;
        readonly asAbstractNonFungible: {
            readonly class: Bytes;
            readonly instance: XcmV1MultiassetAssetInstance;
        } & Struct;
        readonly isConcreteFungible: boolean;
        readonly asConcreteFungible: {
            readonly id: XcmV0MultiLocation;
            readonly amount: Compact<u128>;
        } & Struct;
        readonly isConcreteNonFungible: boolean;
        readonly asConcreteNonFungible: {
            readonly class: XcmV0MultiLocation;
            readonly instance: XcmV1MultiassetAssetInstance;
        } & Struct;
        readonly type: 'None' | 'All' | 'AllFungible' | 'AllNonFungible' | 'AllAbstractFungible' | 'AllAbstractNonFungible' | 'AllConcreteFungible' | 'AllConcreteNonFungible' | 'AbstractFungible' | 'AbstractNonFungible' | 'ConcreteFungible' | 'ConcreteNonFungible';
    }
    /** @name XcmV0MultiLocation (103) */
    interface XcmV0MultiLocation extends Enum {
        readonly isNull: boolean;
        readonly isX1: boolean;
        readonly asX1: XcmV0Junction;
        readonly isX2: boolean;
        readonly asX2: ITuple<[XcmV0Junction, XcmV0Junction]>;
        readonly isX3: boolean;
        readonly asX3: ITuple<[XcmV0Junction, XcmV0Junction, XcmV0Junction]>;
        readonly isX4: boolean;
        readonly asX4: ITuple<[XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction]>;
        readonly isX5: boolean;
        readonly asX5: ITuple<[XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction]>;
        readonly isX6: boolean;
        readonly asX6: ITuple<[XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction]>;
        readonly isX7: boolean;
        readonly asX7: ITuple<[XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction]>;
        readonly isX8: boolean;
        readonly asX8: ITuple<[XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction, XcmV0Junction]>;
        readonly type: 'Null' | 'X1' | 'X2' | 'X3' | 'X4' | 'X5' | 'X6' | 'X7' | 'X8';
    }
    /** @name XcmV0Junction (104) */
    interface XcmV0Junction extends Enum {
        readonly isParent: boolean;
        readonly isParachain: boolean;
        readonly asParachain: Compact<u32>;
        readonly isAccountId32: boolean;
        readonly asAccountId32: {
            readonly network: XcmV0JunctionNetworkId;
            readonly id: U8aFixed;
        } & Struct;
        readonly isAccountIndex64: boolean;
        readonly asAccountIndex64: {
            readonly network: XcmV0JunctionNetworkId;
            readonly index: Compact<u64>;
        } & Struct;
        readonly isAccountKey20: boolean;
        readonly asAccountKey20: {
            readonly network: XcmV0JunctionNetworkId;
            readonly key: U8aFixed;
        } & Struct;
        readonly isPalletInstance: boolean;
        readonly asPalletInstance: u8;
        readonly isGeneralIndex: boolean;
        readonly asGeneralIndex: Compact<u128>;
        readonly isGeneralKey: boolean;
        readonly asGeneralKey: Bytes;
        readonly isOnlyChild: boolean;
        readonly isPlurality: boolean;
        readonly asPlurality: {
            readonly id: XcmV0JunctionBodyId;
            readonly part: XcmV0JunctionBodyPart;
        } & Struct;
        readonly type: 'Parent' | 'Parachain' | 'AccountId32' | 'AccountIndex64' | 'AccountKey20' | 'PalletInstance' | 'GeneralIndex' | 'GeneralKey' | 'OnlyChild' | 'Plurality';
    }
    /** @name XcmVersionedMultiLocation (105) */
    interface XcmVersionedMultiLocation extends Enum {
        readonly isV0: boolean;
        readonly asV0: XcmV0MultiLocation;
        readonly isV1: boolean;
        readonly asV1: XcmV1MultiLocation;
        readonly type: 'V0' | 'V1';
    }
    /** @name CumulusPalletXcmEvent (106) */
    interface CumulusPalletXcmEvent extends Enum {
        readonly isInvalidFormat: boolean;
        readonly asInvalidFormat: U8aFixed;
        readonly isUnsupportedVersion: boolean;
        readonly asUnsupportedVersion: U8aFixed;
        readonly isExecutedDownward: boolean;
        readonly asExecutedDownward: ITuple<[U8aFixed, XcmV2TraitsOutcome]>;
        readonly type: 'InvalidFormat' | 'UnsupportedVersion' | 'ExecutedDownward';
    }
    /** @name CumulusPalletDmpQueueEvent (107) */
    interface CumulusPalletDmpQueueEvent extends Enum {
        readonly isInvalidFormat: boolean;
        readonly asInvalidFormat: {
            readonly messageId: U8aFixed;
        } & Struct;
        readonly isUnsupportedVersion: boolean;
        readonly asUnsupportedVersion: {
            readonly messageId: U8aFixed;
        } & Struct;
        readonly isExecutedDownward: boolean;
        readonly asExecutedDownward: {
            readonly messageId: U8aFixed;
            readonly outcome: XcmV2TraitsOutcome;
        } & Struct;
        readonly isWeightExhausted: boolean;
        readonly asWeightExhausted: {
            readonly messageId: U8aFixed;
            readonly remainingWeight: WeightV1;
            readonly requiredWeight: WeightV1;
        } & Struct;
        readonly isOverweightEnqueued: boolean;
        readonly asOverweightEnqueued: {
            readonly messageId: U8aFixed;
            readonly overweightIndex: u64;
            readonly requiredWeight: WeightV1;
        } & Struct;
        readonly isOverweightServiced: boolean;
        readonly asOverweightServiced: {
            readonly overweightIndex: u64;
            readonly weightUsed: WeightV1;
        } & Struct;
        readonly type: 'InvalidFormat' | 'UnsupportedVersion' | 'ExecutedDownward' | 'WeightExhausted' | 'OverweightEnqueued' | 'OverweightServiced';
    }
    /** @name OrmlTokensModuleEvent (108) */
    interface OrmlTokensModuleEvent extends Enum {
        readonly isEndowed: boolean;
        readonly asEndowed: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isDustLost: boolean;
        readonly asDustLost: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isTransfer: boolean;
        readonly asTransfer: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly from: AccountId32;
            readonly to: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isReserved: boolean;
        readonly asReserved: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isUnreserved: boolean;
        readonly asUnreserved: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isReserveRepatriated: boolean;
        readonly asReserveRepatriated: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly from: AccountId32;
            readonly to: AccountId32;
            readonly amount: u128;
            readonly status: FrameSupportTokensMiscBalanceStatus;
        } & Struct;
        readonly isBalanceSet: boolean;
        readonly asBalanceSet: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly free: u128;
            readonly reserved: u128;
        } & Struct;
        readonly isTotalIssuanceSet: boolean;
        readonly asTotalIssuanceSet: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly amount: u128;
        } & Struct;
        readonly isWithdrawn: boolean;
        readonly asWithdrawn: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isSlashed: boolean;
        readonly asSlashed: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly freeAmount: u128;
            readonly reservedAmount: u128;
        } & Struct;
        readonly isDeposited: boolean;
        readonly asDeposited: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isLockSet: boolean;
        readonly asLockSet: {
            readonly lockId: U8aFixed;
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isLockRemoved: boolean;
        readonly asLockRemoved: {
            readonly lockId: U8aFixed;
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly who: AccountId32;
        } & Struct;
        readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'BalanceSet' | 'TotalIssuanceSet' | 'Withdrawn' | 'Slashed' | 'Deposited' | 'LockSet' | 'LockRemoved';
    }
    /** @name PeaqPrimitivesXcmCurrencyCurrencyId (109) */
    interface PeaqPrimitivesXcmCurrencyCurrencyId extends Enum {
        readonly isToken: boolean;
        readonly asToken: PeaqPrimitivesXcmCurrencyTokenSymbol;
        readonly isErc20: boolean;
        readonly asErc20: H160;
        readonly type: 'Token' | 'Erc20';
    }
    /** @name PeaqPrimitivesXcmCurrencyTokenSymbol (110) */
    interface PeaqPrimitivesXcmCurrencyTokenSymbol extends Enum {
        readonly isPeaq: boolean;
        readonly isDot: boolean;
        readonly isAca: boolean;
        readonly type: 'Peaq' | 'Dot' | 'Aca';
    }
    /** @name OrmlXtokensModuleEvent (111) */
    interface OrmlXtokensModuleEvent extends Enum {
        readonly isTransferredMultiAssets: boolean;
        readonly asTransferredMultiAssets: {
            readonly sender: AccountId32;
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly fee: XcmV1MultiAsset;
            readonly dest: XcmV1MultiLocation;
        } & Struct;
        readonly type: 'TransferredMultiAssets';
    }
    /** @name OrmlUnknownTokensModuleEvent (112) */
    interface OrmlUnknownTokensModuleEvent extends Enum {
        readonly isDeposited: boolean;
        readonly asDeposited: {
            readonly asset: XcmV1MultiAsset;
            readonly who: XcmV1MultiLocation;
        } & Struct;
        readonly isWithdrawn: boolean;
        readonly asWithdrawn: {
            readonly asset: XcmV1MultiAsset;
            readonly who: XcmV1MultiLocation;
        } & Struct;
        readonly type: 'Deposited' | 'Withdrawn';
    }
    /** @name PeaqPalletDidEvent (113) */
    interface PeaqPalletDidEvent extends Enum {
        readonly isAttributeAdded: boolean;
        readonly asAttributeAdded: ITuple<[AccountId32, AccountId32, Bytes, Bytes, Option<u32>]>;
        readonly isAttributeRead: boolean;
        readonly asAttributeRead: PeaqPalletDidStructsAttribute;
        readonly isAttributeUpdated: boolean;
        readonly asAttributeUpdated: ITuple<[AccountId32, AccountId32, Bytes, Bytes, Option<u32>]>;
        readonly isAttributeRemoved: boolean;
        readonly asAttributeRemoved: ITuple<[AccountId32, AccountId32, Bytes]>;
        readonly type: 'AttributeAdded' | 'AttributeRead' | 'AttributeUpdated' | 'AttributeRemoved';
    }
    /** @name PeaqPalletDidStructsAttribute (115) */
    interface PeaqPalletDidStructsAttribute extends Struct {
        readonly name: Bytes;
        readonly value: Bytes;
        readonly validity: u32;
        readonly created: u64;
    }
    /** @name PeaqPalletTransactionEvent (116) */
    interface PeaqPalletTransactionEvent extends Enum {
        readonly isServiceRequested: boolean;
        readonly asServiceRequested: {
            readonly consumer: AccountId32;
            readonly provider: AccountId32;
            readonly tokenDeposited: u128;
        } & Struct;
        readonly isServiceDelivered: boolean;
        readonly asServiceDelivered: {
            readonly provider: AccountId32;
            readonly consumer: AccountId32;
            readonly refundInfo: PeaqPalletTransactionStructsDeliveredInfo;
            readonly spentInfo: PeaqPalletTransactionStructsDeliveredInfo;
        } & Struct;
        readonly type: 'ServiceRequested' | 'ServiceDelivered';
    }
    /** @name PeaqPalletTransactionStructsDeliveredInfo (117) */
    interface PeaqPalletTransactionStructsDeliveredInfo extends Struct {
        readonly tokenNum: u128;
        readonly txHash: H256;
        readonly timePoint: PeaqPalletTransactionStructsTimepoint;
        readonly callHash: U8aFixed;
    }
    /** @name PeaqPalletTransactionStructsTimepoint (118) */
    interface PeaqPalletTransactionStructsTimepoint extends Struct {
        readonly height: u32;
        readonly index: u32;
    }
    /** @name PalletMultisigEvent (119) */
    interface PalletMultisigEvent extends Enum {
        readonly isNewMultisig: boolean;
        readonly asNewMultisig: {
            readonly approving: AccountId32;
            readonly multisig: AccountId32;
            readonly callHash: U8aFixed;
        } & Struct;
        readonly isMultisigApproval: boolean;
        readonly asMultisigApproval: {
            readonly approving: AccountId32;
            readonly timepoint: PalletMultisigTimepoint;
            readonly multisig: AccountId32;
            readonly callHash: U8aFixed;
        } & Struct;
        readonly isMultisigExecuted: boolean;
        readonly asMultisigExecuted: {
            readonly approving: AccountId32;
            readonly timepoint: PalletMultisigTimepoint;
            readonly multisig: AccountId32;
            readonly callHash: U8aFixed;
            readonly result: Result<Null, SpRuntimeDispatchError>;
        } & Struct;
        readonly isMultisigCancelled: boolean;
        readonly asMultisigCancelled: {
            readonly cancelling: AccountId32;
            readonly timepoint: PalletMultisigTimepoint;
            readonly multisig: AccountId32;
            readonly callHash: U8aFixed;
        } & Struct;
        readonly type: 'NewMultisig' | 'MultisigApproval' | 'MultisigExecuted' | 'MultisigCancelled';
    }
    /** @name PalletMultisigTimepoint (120) */
    interface PalletMultisigTimepoint extends Struct {
        readonly height: u32;
        readonly index: u32;
    }
    /** @name PeaqPalletRbacEvent (121) */
    interface PeaqPalletRbacEvent extends Enum {
        readonly isRoleAdded: boolean;
        readonly asRoleAdded: ITuple<[AccountId32, U8aFixed, Bytes]>;
        readonly isRoleUpdated: boolean;
        readonly asRoleUpdated: ITuple<[AccountId32, U8aFixed, Bytes]>;
        readonly isRoleRemoved: boolean;
        readonly asRoleRemoved: ITuple<[AccountId32, U8aFixed]>;
        readonly isRoleFetched: boolean;
        readonly asRoleFetched: PeaqPalletRbacStructsEntity;
        readonly isAllRolesFetched: boolean;
        readonly asAllRolesFetched: Vec<PeaqPalletRbacStructsEntity>;
        readonly isRoleAssignedToUser: boolean;
        readonly asRoleAssignedToUser: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isRoleUnassignedToUser: boolean;
        readonly asRoleUnassignedToUser: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isRoleAssignedToGroup: boolean;
        readonly asRoleAssignedToGroup: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isRoleUnassignedToGroup: boolean;
        readonly asRoleUnassignedToGroup: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isFetchedGroupRoles: boolean;
        readonly asFetchedGroupRoles: Vec<PeaqPalletRbacStructsRole2Group>;
        readonly isFetchedUserRoles: boolean;
        readonly asFetchedUserRoles: Vec<PeaqPalletRbacStructsRole2User>;
        readonly isFetchedUserGroups: boolean;
        readonly asFetchedUserGroups: Vec<PeaqPalletRbacStructsUser2Group>;
        readonly isFetchedUserPermissions: boolean;
        readonly asFetchedUserPermissions: Vec<PeaqPalletRbacStructsEntity>;
        readonly isFetchedGroupPermissions: boolean;
        readonly asFetchedGroupPermissions: Vec<PeaqPalletRbacStructsEntity>;
        readonly isPermissionAdded: boolean;
        readonly asPermissionAdded: ITuple<[AccountId32, U8aFixed, Bytes]>;
        readonly isPermissionUpdated: boolean;
        readonly asPermissionUpdated: ITuple<[AccountId32, U8aFixed, Bytes]>;
        readonly isPermissionDisabled: boolean;
        readonly asPermissionDisabled: ITuple<[AccountId32, U8aFixed]>;
        readonly isPermissionAssigned: boolean;
        readonly asPermissionAssigned: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isPermissionUnassignedToRole: boolean;
        readonly asPermissionUnassignedToRole: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isFetchedRolePermissions: boolean;
        readonly asFetchedRolePermissions: Vec<PeaqPalletRbacStructsPermission2Role>;
        readonly isPermissionFetched: boolean;
        readonly asPermissionFetched: PeaqPalletRbacStructsEntity;
        readonly isAllPermissionsFetched: boolean;
        readonly asAllPermissionsFetched: Vec<PeaqPalletRbacStructsEntity>;
        readonly isGroupFetched: boolean;
        readonly asGroupFetched: PeaqPalletRbacStructsEntity;
        readonly isAllGroupsFetched: boolean;
        readonly asAllGroupsFetched: Vec<PeaqPalletRbacStructsEntity>;
        readonly isGroupAdded: boolean;
        readonly asGroupAdded: ITuple<[AccountId32, U8aFixed, Bytes]>;
        readonly isGroupUpdated: boolean;
        readonly asGroupUpdated: ITuple<[AccountId32, U8aFixed, Bytes]>;
        readonly isGroupDisabled: boolean;
        readonly asGroupDisabled: ITuple<[AccountId32, U8aFixed]>;
        readonly isUserAssignedToGroup: boolean;
        readonly asUserAssignedToGroup: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly isUserUnAssignedToGroup: boolean;
        readonly asUserUnAssignedToGroup: ITuple<[AccountId32, U8aFixed, U8aFixed]>;
        readonly type: 'RoleAdded' | 'RoleUpdated' | 'RoleRemoved' | 'RoleFetched' | 'AllRolesFetched' | 'RoleAssignedToUser' | 'RoleUnassignedToUser' | 'RoleAssignedToGroup' | 'RoleUnassignedToGroup' | 'FetchedGroupRoles' | 'FetchedUserRoles' | 'FetchedUserGroups' | 'FetchedUserPermissions' | 'FetchedGroupPermissions' | 'PermissionAdded' | 'PermissionUpdated' | 'PermissionDisabled' | 'PermissionAssigned' | 'PermissionUnassignedToRole' | 'FetchedRolePermissions' | 'PermissionFetched' | 'AllPermissionsFetched' | 'GroupFetched' | 'AllGroupsFetched' | 'GroupAdded' | 'GroupUpdated' | 'GroupDisabled' | 'UserAssignedToGroup' | 'UserUnAssignedToGroup';
    }
    /** @name PeaqPalletRbacStructsEntity (122) */
    interface PeaqPalletRbacStructsEntity extends Struct {
        readonly id: U8aFixed;
        readonly name: Bytes;
        readonly enabled: bool;
    }
    /** @name PeaqPalletRbacStructsRole2Group (126) */
    interface PeaqPalletRbacStructsRole2Group extends Struct {
        readonly role: U8aFixed;
        readonly group: U8aFixed;
    }
    /** @name PeaqPalletRbacStructsRole2User (128) */
    interface PeaqPalletRbacStructsRole2User extends Struct {
        readonly role: U8aFixed;
        readonly user: U8aFixed;
    }
    /** @name PeaqPalletRbacStructsUser2Group (130) */
    interface PeaqPalletRbacStructsUser2Group extends Struct {
        readonly user: U8aFixed;
        readonly group: U8aFixed;
    }
    /** @name PeaqPalletRbacStructsPermission2Role (132) */
    interface PeaqPalletRbacStructsPermission2Role extends Struct {
        readonly permission: U8aFixed;
        readonly role: U8aFixed;
    }
    /** @name PeaqPalletStorageEvent (133) */
    interface PeaqPalletStorageEvent extends Enum {
        readonly isItemAdded: boolean;
        readonly asItemAdded: ITuple<[AccountId32, Bytes, Bytes]>;
        readonly isItemRead: boolean;
        readonly asItemRead: Bytes;
        readonly isItemUpdated: boolean;
        readonly asItemUpdated: ITuple<[AccountId32, Bytes, Bytes]>;
        readonly type: 'ItemAdded' | 'ItemRead' | 'ItemUpdated';
    }
    /** @name PeaqPalletMorEvent (134) */
    interface PeaqPalletMorEvent extends Enum {
        readonly isMintedRewards: boolean;
        readonly asMintedRewards: ITuple<[AccountId32, u128]>;
        readonly isPayedFromPot: boolean;
        readonly asPayedFromPot: ITuple<[AccountId32, u128]>;
        readonly isBalanceIs: boolean;
        readonly asBalanceIs: u128;
        readonly type: 'MintedRewards' | 'PayedFromPot' | 'BalanceIs';
    }
    /** @name FrameSystemPhase (135) */
    interface FrameSystemPhase extends Enum {
        readonly isApplyExtrinsic: boolean;
        readonly asApplyExtrinsic: u32;
        readonly isFinalization: boolean;
        readonly isInitialization: boolean;
        readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization';
    }
    /** @name FrameSystemLastRuntimeUpgradeInfo (138) */
    interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
        readonly specVersion: Compact<u32>;
        readonly specName: Text;
    }
    /** @name FrameSystemCall (139) */
    interface FrameSystemCall extends Enum {
        readonly isFillBlock: boolean;
        readonly asFillBlock: {
            readonly ratio: Perbill;
        } & Struct;
        readonly isRemark: boolean;
        readonly asRemark: {
            readonly remark: Bytes;
        } & Struct;
        readonly isSetHeapPages: boolean;
        readonly asSetHeapPages: {
            readonly pages: u64;
        } & Struct;
        readonly isSetCode: boolean;
        readonly asSetCode: {
            readonly code: Bytes;
        } & Struct;
        readonly isSetCodeWithoutChecks: boolean;
        readonly asSetCodeWithoutChecks: {
            readonly code: Bytes;
        } & Struct;
        readonly isSetStorage: boolean;
        readonly asSetStorage: {
            readonly items: Vec<ITuple<[Bytes, Bytes]>>;
        } & Struct;
        readonly isKillStorage: boolean;
        readonly asKillStorage: {
            readonly keys_: Vec<Bytes>;
        } & Struct;
        readonly isKillPrefix: boolean;
        readonly asKillPrefix: {
            readonly prefix: Bytes;
            readonly subkeys: u32;
        } & Struct;
        readonly isRemarkWithEvent: boolean;
        readonly asRemarkWithEvent: {
            readonly remark: Bytes;
        } & Struct;
        readonly type: 'FillBlock' | 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetStorage' | 'KillStorage' | 'KillPrefix' | 'RemarkWithEvent';
    }
    /** @name FrameSystemLimitsBlockWeights (143) */
    interface FrameSystemLimitsBlockWeights extends Struct {
        readonly baseBlock: WeightV1;
        readonly maxBlock: WeightV1;
        readonly perClass: FrameSupportWeightsPerDispatchClassWeightsPerClass;
    }
    /** @name FrameSupportWeightsPerDispatchClassWeightsPerClass (144) */
    interface FrameSupportWeightsPerDispatchClassWeightsPerClass extends Struct {
        readonly normal: FrameSystemLimitsWeightsPerClass;
        readonly operational: FrameSystemLimitsWeightsPerClass;
        readonly mandatory: FrameSystemLimitsWeightsPerClass;
    }
    /** @name FrameSystemLimitsWeightsPerClass (145) */
    interface FrameSystemLimitsWeightsPerClass extends Struct {
        readonly baseExtrinsic: WeightV1;
        readonly maxExtrinsic: Option<WeightV1>;
        readonly maxTotal: Option<WeightV1>;
        readonly reserved: Option<WeightV1>;
    }
    /** @name FrameSystemLimitsBlockLength (147) */
    interface FrameSystemLimitsBlockLength extends Struct {
        readonly max: FrameSupportWeightsPerDispatchClassU32;
    }
    /** @name FrameSupportWeightsPerDispatchClassU32 (148) */
    interface FrameSupportWeightsPerDispatchClassU32 extends Struct {
        readonly normal: u32;
        readonly operational: u32;
        readonly mandatory: u32;
    }
    /** @name FrameSupportWeightsRuntimeDbWeight (149) */
    interface FrameSupportWeightsRuntimeDbWeight extends Struct {
        readonly read: u64;
        readonly write: u64;
    }
    /** @name SpVersionRuntimeVersion (150) */
    interface SpVersionRuntimeVersion extends Struct {
        readonly specName: Text;
        readonly implName: Text;
        readonly authoringVersion: u32;
        readonly specVersion: u32;
        readonly implVersion: u32;
        readonly apis: Vec<ITuple<[U8aFixed, u32]>>;
        readonly transactionVersion: u32;
        readonly stateVersion: u8;
    }
    /** @name FrameSystemError (155) */
    interface FrameSystemError extends Enum {
        readonly isInvalidSpecName: boolean;
        readonly isSpecVersionNeedsToIncrease: boolean;
        readonly isFailedToExtractRuntimeVersion: boolean;
        readonly isNonDefaultComposite: boolean;
        readonly isNonZeroRefCount: boolean;
        readonly isCallFiltered: boolean;
        readonly type: 'InvalidSpecName' | 'SpecVersionNeedsToIncrease' | 'FailedToExtractRuntimeVersion' | 'NonDefaultComposite' | 'NonZeroRefCount' | 'CallFiltered';
    }
    /** @name PalletTimestampCall (157) */
    interface PalletTimestampCall extends Enum {
        readonly isSet: boolean;
        readonly asSet: {
            readonly now: Compact<u64>;
        } & Struct;
        readonly type: 'Set';
    }
    /** @name PalletBalancesBalanceLock (159) */
    interface PalletBalancesBalanceLock extends Struct {
        readonly id: U8aFixed;
        readonly amount: u128;
        readonly reasons: PalletBalancesReasons;
    }
    /** @name PalletBalancesReasons (160) */
    interface PalletBalancesReasons extends Enum {
        readonly isFee: boolean;
        readonly isMisc: boolean;
        readonly isAll: boolean;
        readonly type: 'Fee' | 'Misc' | 'All';
    }
    /** @name PalletBalancesReserveData (163) */
    interface PalletBalancesReserveData extends Struct {
        readonly id: U8aFixed;
        readonly amount: u128;
    }
    /** @name PalletBalancesReleases (165) */
    interface PalletBalancesReleases extends Enum {
        readonly isV100: boolean;
        readonly isV200: boolean;
        readonly type: 'V100' | 'V200';
    }
    /** @name PalletBalancesCall (166) */
    interface PalletBalancesCall extends Enum {
        readonly isTransfer: boolean;
        readonly asTransfer: {
            readonly dest: MultiAddress;
            readonly value: Compact<u128>;
        } & Struct;
        readonly isSetBalance: boolean;
        readonly asSetBalance: {
            readonly who: MultiAddress;
            readonly newFree: Compact<u128>;
            readonly newReserved: Compact<u128>;
        } & Struct;
        readonly isForceTransfer: boolean;
        readonly asForceTransfer: {
            readonly source: MultiAddress;
            readonly dest: MultiAddress;
            readonly value: Compact<u128>;
        } & Struct;
        readonly isTransferKeepAlive: boolean;
        readonly asTransferKeepAlive: {
            readonly dest: MultiAddress;
            readonly value: Compact<u128>;
        } & Struct;
        readonly isTransferAll: boolean;
        readonly asTransferAll: {
            readonly dest: MultiAddress;
            readonly keepAlive: bool;
        } & Struct;
        readonly isForceUnreserve: boolean;
        readonly asForceUnreserve: {
            readonly who: MultiAddress;
            readonly amount: u128;
        } & Struct;
        readonly type: 'Transfer' | 'SetBalance' | 'ForceTransfer' | 'TransferKeepAlive' | 'TransferAll' | 'ForceUnreserve';
    }
    /** @name PalletBalancesError (168) */
    interface PalletBalancesError extends Enum {
        readonly isVestingBalance: boolean;
        readonly isLiquidityRestrictions: boolean;
        readonly isInsufficientBalance: boolean;
        readonly isExistentialDeposit: boolean;
        readonly isKeepAlive: boolean;
        readonly isExistingVestingSchedule: boolean;
        readonly isDeadAccount: boolean;
        readonly isTooManyReserves: boolean;
        readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'InsufficientBalance' | 'ExistentialDeposit' | 'KeepAlive' | 'ExistingVestingSchedule' | 'DeadAccount' | 'TooManyReserves';
    }
    /** @name PalletTransactionPaymentReleases (170) */
    interface PalletTransactionPaymentReleases extends Enum {
        readonly isV1Ancient: boolean;
        readonly isV2: boolean;
        readonly type: 'V1Ancient' | 'V2';
    }
    /** @name PalletSudoCall (171) */
    interface PalletSudoCall extends Enum {
        readonly isSudo: boolean;
        readonly asSudo: {
            readonly call: Call;
        } & Struct;
        readonly isSudoUncheckedWeight: boolean;
        readonly asSudoUncheckedWeight: {
            readonly call: Call;
            readonly weight: WeightV1;
        } & Struct;
        readonly isSetKey: boolean;
        readonly asSetKey: {
            readonly new_: MultiAddress;
        } & Struct;
        readonly isSudoAs: boolean;
        readonly asSudoAs: {
            readonly who: MultiAddress;
            readonly call: Call;
        } & Struct;
        readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs';
    }
    /** @name PalletContractsCall (173) */
    interface PalletContractsCall extends Enum {
        readonly isCall: boolean;
        readonly asCall: {
            readonly dest: MultiAddress;
            readonly value: Compact<u128>;
            readonly gasLimit: Compact<WeightV1>;
            readonly storageDepositLimit: Option<Compact<u128>>;
            readonly data: Bytes;
        } & Struct;
        readonly isInstantiateWithCode: boolean;
        readonly asInstantiateWithCode: {
            readonly value: Compact<u128>;
            readonly gasLimit: Compact<WeightV1>;
            readonly storageDepositLimit: Option<Compact<u128>>;
            readonly code: Bytes;
            readonly data: Bytes;
            readonly salt: Bytes;
        } & Struct;
        readonly isInstantiate: boolean;
        readonly asInstantiate: {
            readonly value: Compact<u128>;
            readonly gasLimit: Compact<WeightV1>;
            readonly storageDepositLimit: Option<Compact<u128>>;
            readonly codeHash: H256;
            readonly data: Bytes;
            readonly salt: Bytes;
        } & Struct;
        readonly isUploadCode: boolean;
        readonly asUploadCode: {
            readonly code: Bytes;
            readonly storageDepositLimit: Option<Compact<u128>>;
        } & Struct;
        readonly isRemoveCode: boolean;
        readonly asRemoveCode: {
            readonly codeHash: H256;
        } & Struct;
        readonly isSetCode: boolean;
        readonly asSetCode: {
            readonly dest: MultiAddress;
            readonly codeHash: H256;
        } & Struct;
        readonly type: 'Call' | 'InstantiateWithCode' | 'Instantiate' | 'UploadCode' | 'RemoveCode' | 'SetCode';
    }
    /** @name PalletUtilityCall (176) */
    interface PalletUtilityCall extends Enum {
        readonly isBatch: boolean;
        readonly asBatch: {
            readonly calls: Vec<Call>;
        } & Struct;
        readonly isAsDerivative: boolean;
        readonly asAsDerivative: {
            readonly index: u16;
            readonly call: Call;
        } & Struct;
        readonly isBatchAll: boolean;
        readonly asBatchAll: {
            readonly calls: Vec<Call>;
        } & Struct;
        readonly isDispatchAs: boolean;
        readonly asDispatchAs: {
            readonly asOrigin: PeaqDevRuntimeOriginCaller;
            readonly call: Call;
        } & Struct;
        readonly isForceBatch: boolean;
        readonly asForceBatch: {
            readonly calls: Vec<Call>;
        } & Struct;
        readonly type: 'Batch' | 'AsDerivative' | 'BatchAll' | 'DispatchAs' | 'ForceBatch';
    }
    /** @name PeaqDevRuntimeOriginCaller (178) */
    interface PeaqDevRuntimeOriginCaller extends Enum {
        readonly isSystem: boolean;
        readonly asSystem: FrameSupportDispatchRawOrigin;
        readonly isVoid: boolean;
        readonly isEthereum: boolean;
        readonly asEthereum: PalletEthereumRawOrigin;
        readonly isPolkadotXcm: boolean;
        readonly asPolkadotXcm: PalletXcmOrigin;
        readonly isCumulusXcm: boolean;
        readonly asCumulusXcm: CumulusPalletXcmOrigin;
        readonly type: 'System' | 'Void' | 'Ethereum' | 'PolkadotXcm' | 'CumulusXcm';
    }
    /** @name FrameSupportDispatchRawOrigin (179) */
    interface FrameSupportDispatchRawOrigin extends Enum {
        readonly isRoot: boolean;
        readonly isSigned: boolean;
        readonly asSigned: AccountId32;
        readonly isNone: boolean;
        readonly type: 'Root' | 'Signed' | 'None';
    }
    /** @name PalletEthereumRawOrigin (180) */
    interface PalletEthereumRawOrigin extends Enum {
        readonly isEthereumTransaction: boolean;
        readonly asEthereumTransaction: H160;
        readonly type: 'EthereumTransaction';
    }
    /** @name PalletXcmOrigin (181) */
    interface PalletXcmOrigin extends Enum {
        readonly isXcm: boolean;
        readonly asXcm: XcmV1MultiLocation;
        readonly isResponse: boolean;
        readonly asResponse: XcmV1MultiLocation;
        readonly type: 'Xcm' | 'Response';
    }
    /** @name CumulusPalletXcmOrigin (182) */
    interface CumulusPalletXcmOrigin extends Enum {
        readonly isRelay: boolean;
        readonly isSiblingParachain: boolean;
        readonly asSiblingParachain: u32;
        readonly type: 'Relay' | 'SiblingParachain';
    }
    /** @name SpCoreVoid (183) */
    type SpCoreVoid = Null;
    /** @name PalletEthereumCall (184) */
    interface PalletEthereumCall extends Enum {
        readonly isTransact: boolean;
        readonly asTransact: {
            readonly transaction: EthereumTransactionTransactionV2;
        } & Struct;
        readonly type: 'Transact';
    }
    /** @name EthereumTransactionTransactionV2 (185) */
    interface EthereumTransactionTransactionV2 extends Enum {
        readonly isLegacy: boolean;
        readonly asLegacy: EthereumTransactionLegacyTransaction;
        readonly isEip2930: boolean;
        readonly asEip2930: EthereumTransactionEip2930Transaction;
        readonly isEip1559: boolean;
        readonly asEip1559: EthereumTransactionEip1559Transaction;
        readonly type: 'Legacy' | 'Eip2930' | 'Eip1559';
    }
    /** @name EthereumTransactionLegacyTransaction (186) */
    interface EthereumTransactionLegacyTransaction extends Struct {
        readonly nonce: U256;
        readonly gasPrice: U256;
        readonly gasLimit: U256;
        readonly action: EthereumTransactionTransactionAction;
        readonly value: U256;
        readonly input: Bytes;
        readonly signature: EthereumTransactionTransactionSignature;
    }
    /** @name EthereumTransactionTransactionAction (187) */
    interface EthereumTransactionTransactionAction extends Enum {
        readonly isCall: boolean;
        readonly asCall: H160;
        readonly isCreate: boolean;
        readonly type: 'Call' | 'Create';
    }
    /** @name EthereumTransactionTransactionSignature (188) */
    interface EthereumTransactionTransactionSignature extends Struct {
        readonly v: u64;
        readonly r: H256;
        readonly s: H256;
    }
    /** @name EthereumTransactionEip2930Transaction (190) */
    interface EthereumTransactionEip2930Transaction extends Struct {
        readonly chainId: u64;
        readonly nonce: U256;
        readonly gasPrice: U256;
        readonly gasLimit: U256;
        readonly action: EthereumTransactionTransactionAction;
        readonly value: U256;
        readonly input: Bytes;
        readonly accessList: Vec<EthereumTransactionAccessListItem>;
        readonly oddYParity: bool;
        readonly r: H256;
        readonly s: H256;
    }
    /** @name EthereumTransactionAccessListItem (192) */
    interface EthereumTransactionAccessListItem extends Struct {
        readonly address: H160;
        readonly storageKeys: Vec<H256>;
    }
    /** @name EthereumTransactionEip1559Transaction (193) */
    interface EthereumTransactionEip1559Transaction extends Struct {
        readonly chainId: u64;
        readonly nonce: U256;
        readonly maxPriorityFeePerGas: U256;
        readonly maxFeePerGas: U256;
        readonly gasLimit: U256;
        readonly action: EthereumTransactionTransactionAction;
        readonly value: U256;
        readonly input: Bytes;
        readonly accessList: Vec<EthereumTransactionAccessListItem>;
        readonly oddYParity: bool;
        readonly r: H256;
        readonly s: H256;
    }
    /** @name PalletEvmCall (194) */
    interface PalletEvmCall extends Enum {
        readonly isWithdraw: boolean;
        readonly asWithdraw: {
            readonly address: H160;
            readonly value: u128;
        } & Struct;
        readonly isCall: boolean;
        readonly asCall: {
            readonly source: H160;
            readonly target: H160;
            readonly input: Bytes;
            readonly value: U256;
            readonly gasLimit: u64;
            readonly maxFeePerGas: U256;
            readonly maxPriorityFeePerGas: Option<U256>;
            readonly nonce: Option<U256>;
            readonly accessList: Vec<ITuple<[H160, Vec<H256>]>>;
        } & Struct;
        readonly isCreate: boolean;
        readonly asCreate: {
            readonly source: H160;
            readonly init: Bytes;
            readonly value: U256;
            readonly gasLimit: u64;
            readonly maxFeePerGas: U256;
            readonly maxPriorityFeePerGas: Option<U256>;
            readonly nonce: Option<U256>;
            readonly accessList: Vec<ITuple<[H160, Vec<H256>]>>;
        } & Struct;
        readonly isCreate2: boolean;
        readonly asCreate2: {
            readonly source: H160;
            readonly init: Bytes;
            readonly salt: H256;
            readonly value: U256;
            readonly gasLimit: u64;
            readonly maxFeePerGas: U256;
            readonly maxPriorityFeePerGas: Option<U256>;
            readonly nonce: Option<U256>;
            readonly accessList: Vec<ITuple<[H160, Vec<H256>]>>;
        } & Struct;
        readonly type: 'Withdraw' | 'Call' | 'Create' | 'Create2';
    }
    /** @name PalletDynamicFeeCall (198) */
    interface PalletDynamicFeeCall extends Enum {
        readonly isNoteMinGasPriceTarget: boolean;
        readonly asNoteMinGasPriceTarget: {
            readonly target: U256;
        } & Struct;
        readonly type: 'NoteMinGasPriceTarget';
    }
    /** @name PalletBaseFeeCall (199) */
    interface PalletBaseFeeCall extends Enum {
        readonly isSetBaseFeePerGas: boolean;
        readonly asSetBaseFeePerGas: {
            readonly fee: U256;
        } & Struct;
        readonly isSetElasticity: boolean;
        readonly asSetElasticity: {
            readonly elasticity: Permill;
        } & Struct;
        readonly type: 'SetBaseFeePerGas' | 'SetElasticity';
    }
    /** @name PalletAuthorshipCall (200) */
    interface PalletAuthorshipCall extends Enum {
        readonly isSetUncles: boolean;
        readonly asSetUncles: {
            readonly newUncles: Vec<SpRuntimeHeader>;
        } & Struct;
        readonly type: 'SetUncles';
    }
    /** @name SpRuntimeHeader (202) */
    interface SpRuntimeHeader extends Struct {
        readonly parentHash: H256;
        readonly number: Compact<u32>;
        readonly stateRoot: H256;
        readonly extrinsicsRoot: H256;
        readonly digest: SpRuntimeDigest;
    }
    /** @name SpRuntimeBlakeTwo256 (203) */
    type SpRuntimeBlakeTwo256 = Null;
    /** @name PalletSessionCall (204) */
    interface PalletSessionCall extends Enum {
        readonly isSetKeys: boolean;
        readonly asSetKeys: {
            readonly keys_: PeaqDevRuntimeOpaqueSessionKeys;
            readonly proof: Bytes;
        } & Struct;
        readonly isPurgeKeys: boolean;
        readonly type: 'SetKeys' | 'PurgeKeys';
    }
    /** @name PeaqDevRuntimeOpaqueSessionKeys (205) */
    interface PeaqDevRuntimeOpaqueSessionKeys extends Struct {
        readonly aura: SpConsensusAuraSr25519AppSr25519Public;
    }
    /** @name SpConsensusAuraSr25519AppSr25519Public (206) */
    interface SpConsensusAuraSr25519AppSr25519Public extends SpCoreSr25519Public {
    }
    /** @name SpCoreSr25519Public (207) */
    interface SpCoreSr25519Public extends U8aFixed {
    }
    /** @name ParachainStakingCall (208) */
    interface ParachainStakingCall extends Enum {
        readonly isForceNewRound: boolean;
        readonly isSetRewardRate: boolean;
        readonly asSetRewardRate: {
            readonly collatorRate: Perquintill;
            readonly delegatorRate: Perquintill;
        } & Struct;
        readonly isSetMaxSelectedCandidates: boolean;
        readonly asSetMaxSelectedCandidates: {
            readonly new_: u32;
        } & Struct;
        readonly isSetBlocksPerRound: boolean;
        readonly asSetBlocksPerRound: {
            readonly new_: u32;
        } & Struct;
        readonly isSetMaxCandidateStake: boolean;
        readonly asSetMaxCandidateStake: {
            readonly new_: u128;
        } & Struct;
        readonly isForceRemoveCandidate: boolean;
        readonly asForceRemoveCandidate: {
            readonly collator: MultiAddress;
        } & Struct;
        readonly isJoinCandidates: boolean;
        readonly asJoinCandidates: {
            readonly stake: u128;
        } & Struct;
        readonly isInitLeaveCandidates: boolean;
        readonly isExecuteLeaveCandidates: boolean;
        readonly asExecuteLeaveCandidates: {
            readonly collator: MultiAddress;
        } & Struct;
        readonly isCancelLeaveCandidates: boolean;
        readonly isCandidateStakeMore: boolean;
        readonly asCandidateStakeMore: {
            readonly more: u128;
        } & Struct;
        readonly isCandidateStakeLess: boolean;
        readonly asCandidateStakeLess: {
            readonly less: u128;
        } & Struct;
        readonly isJoinDelegators: boolean;
        readonly asJoinDelegators: {
            readonly collator: MultiAddress;
            readonly amount: u128;
        } & Struct;
        readonly isDelegateAnotherCandidate: boolean;
        readonly asDelegateAnotherCandidate: {
            readonly collator: MultiAddress;
            readonly amount: u128;
        } & Struct;
        readonly isLeaveDelegators: boolean;
        readonly isRevokeDelegation: boolean;
        readonly asRevokeDelegation: {
            readonly collator: MultiAddress;
        } & Struct;
        readonly isDelegatorStakeMore: boolean;
        readonly asDelegatorStakeMore: {
            readonly candidate: MultiAddress;
            readonly more: u128;
        } & Struct;
        readonly isDelegatorStakeLess: boolean;
        readonly asDelegatorStakeLess: {
            readonly candidate: MultiAddress;
            readonly less: u128;
        } & Struct;
        readonly isUnlockUnstaked: boolean;
        readonly asUnlockUnstaked: {
            readonly target: MultiAddress;
        } & Struct;
        readonly type: 'ForceNewRound' | 'SetRewardRate' | 'SetMaxSelectedCandidates' | 'SetBlocksPerRound' | 'SetMaxCandidateStake' | 'ForceRemoveCandidate' | 'JoinCandidates' | 'InitLeaveCandidates' | 'ExecuteLeaveCandidates' | 'CancelLeaveCandidates' | 'CandidateStakeMore' | 'CandidateStakeLess' | 'JoinDelegators' | 'DelegateAnotherCandidate' | 'LeaveDelegators' | 'RevokeDelegation' | 'DelegatorStakeMore' | 'DelegatorStakeLess' | 'UnlockUnstaked';
    }
    /** @name CumulusPalletParachainSystemCall (209) */
    interface CumulusPalletParachainSystemCall extends Enum {
        readonly isSetValidationData: boolean;
        readonly asSetValidationData: {
            readonly data: CumulusPrimitivesParachainInherentParachainInherentData;
        } & Struct;
        readonly isSudoSendUpwardMessage: boolean;
        readonly asSudoSendUpwardMessage: {
            readonly message: Bytes;
        } & Struct;
        readonly isAuthorizeUpgrade: boolean;
        readonly asAuthorizeUpgrade: {
            readonly codeHash: H256;
        } & Struct;
        readonly isEnactAuthorizedUpgrade: boolean;
        readonly asEnactAuthorizedUpgrade: {
            readonly code: Bytes;
        } & Struct;
        readonly type: 'SetValidationData' | 'SudoSendUpwardMessage' | 'AuthorizeUpgrade' | 'EnactAuthorizedUpgrade';
    }
    /** @name CumulusPrimitivesParachainInherentParachainInherentData (210) */
    interface CumulusPrimitivesParachainInherentParachainInherentData extends Struct {
        readonly validationData: PolkadotPrimitivesV2PersistedValidationData;
        readonly relayChainState: SpTrieStorageProof;
        readonly downwardMessages: Vec<PolkadotCorePrimitivesInboundDownwardMessage>;
        readonly horizontalMessages: BTreeMap<u32, Vec<PolkadotCorePrimitivesInboundHrmpMessage>>;
    }
    /** @name PolkadotPrimitivesV2PersistedValidationData (211) */
    interface PolkadotPrimitivesV2PersistedValidationData extends Struct {
        readonly parentHead: Bytes;
        readonly relayParentNumber: u32;
        readonly relayParentStorageRoot: H256;
        readonly maxPovSize: u32;
    }
    /** @name SpTrieStorageProof (213) */
    interface SpTrieStorageProof extends Struct {
        readonly trieNodes: BTreeSet<Bytes>;
    }
    /** @name PolkadotCorePrimitivesInboundDownwardMessage (216) */
    interface PolkadotCorePrimitivesInboundDownwardMessage extends Struct {
        readonly sentAt: u32;
        readonly msg: Bytes;
    }
    /** @name PolkadotCorePrimitivesInboundHrmpMessage (219) */
    interface PolkadotCorePrimitivesInboundHrmpMessage extends Struct {
        readonly sentAt: u32;
        readonly data: Bytes;
    }
    /** @name PalletBlockRewardCall (222) */
    interface PalletBlockRewardCall extends Enum {
        readonly isSetConfiguration: boolean;
        readonly asSetConfiguration: {
            readonly rewardDistroParams: PalletBlockRewardRewardDistributionConfig;
        } & Struct;
        readonly isSetBlockIssueReward: boolean;
        readonly asSetBlockIssueReward: {
            readonly blockReward: u128;
        } & Struct;
        readonly isSetHardCap: boolean;
        readonly asSetHardCap: {
            readonly limit: u128;
        } & Struct;
        readonly type: 'SetConfiguration' | 'SetBlockIssueReward' | 'SetHardCap';
    }
    /** @name CumulusPalletXcmpQueueCall (223) */
    interface CumulusPalletXcmpQueueCall extends Enum {
        readonly isServiceOverweight: boolean;
        readonly asServiceOverweight: {
            readonly index: u64;
            readonly weightLimit: WeightV1;
        } & Struct;
        readonly isSuspendXcmExecution: boolean;
        readonly isResumeXcmExecution: boolean;
        readonly isUpdateSuspendThreshold: boolean;
        readonly asUpdateSuspendThreshold: {
            readonly new_: u32;
        } & Struct;
        readonly isUpdateDropThreshold: boolean;
        readonly asUpdateDropThreshold: {
            readonly new_: u32;
        } & Struct;
        readonly isUpdateResumeThreshold: boolean;
        readonly asUpdateResumeThreshold: {
            readonly new_: u32;
        } & Struct;
        readonly isUpdateThresholdWeight: boolean;
        readonly asUpdateThresholdWeight: {
            readonly new_: WeightV1;
        } & Struct;
        readonly isUpdateWeightRestrictDecay: boolean;
        readonly asUpdateWeightRestrictDecay: {
            readonly new_: WeightV1;
        } & Struct;
        readonly isUpdateXcmpMaxIndividualWeight: boolean;
        readonly asUpdateXcmpMaxIndividualWeight: {
            readonly new_: WeightV1;
        } & Struct;
        readonly type: 'ServiceOverweight' | 'SuspendXcmExecution' | 'ResumeXcmExecution' | 'UpdateSuspendThreshold' | 'UpdateDropThreshold' | 'UpdateResumeThreshold' | 'UpdateThresholdWeight' | 'UpdateWeightRestrictDecay' | 'UpdateXcmpMaxIndividualWeight';
    }
    /** @name PalletXcmCall (224) */
    interface PalletXcmCall extends Enum {
        readonly isSend: boolean;
        readonly asSend: {
            readonly dest: XcmVersionedMultiLocation;
            readonly message: XcmVersionedXcm;
        } & Struct;
        readonly isTeleportAssets: boolean;
        readonly asTeleportAssets: {
            readonly dest: XcmVersionedMultiLocation;
            readonly beneficiary: XcmVersionedMultiLocation;
            readonly assets: XcmVersionedMultiAssets;
            readonly feeAssetItem: u32;
        } & Struct;
        readonly isReserveTransferAssets: boolean;
        readonly asReserveTransferAssets: {
            readonly dest: XcmVersionedMultiLocation;
            readonly beneficiary: XcmVersionedMultiLocation;
            readonly assets: XcmVersionedMultiAssets;
            readonly feeAssetItem: u32;
        } & Struct;
        readonly isExecute: boolean;
        readonly asExecute: {
            readonly message: XcmVersionedXcm;
            readonly maxWeight: WeightV1;
        } & Struct;
        readonly isForceXcmVersion: boolean;
        readonly asForceXcmVersion: {
            readonly location: XcmV1MultiLocation;
            readonly xcmVersion: u32;
        } & Struct;
        readonly isForceDefaultXcmVersion: boolean;
        readonly asForceDefaultXcmVersion: {
            readonly maybeXcmVersion: Option<u32>;
        } & Struct;
        readonly isForceSubscribeVersionNotify: boolean;
        readonly asForceSubscribeVersionNotify: {
            readonly location: XcmVersionedMultiLocation;
        } & Struct;
        readonly isForceUnsubscribeVersionNotify: boolean;
        readonly asForceUnsubscribeVersionNotify: {
            readonly location: XcmVersionedMultiLocation;
        } & Struct;
        readonly isLimitedReserveTransferAssets: boolean;
        readonly asLimitedReserveTransferAssets: {
            readonly dest: XcmVersionedMultiLocation;
            readonly beneficiary: XcmVersionedMultiLocation;
            readonly assets: XcmVersionedMultiAssets;
            readonly feeAssetItem: u32;
            readonly weightLimit: XcmV2WeightLimit;
        } & Struct;
        readonly isLimitedTeleportAssets: boolean;
        readonly asLimitedTeleportAssets: {
            readonly dest: XcmVersionedMultiLocation;
            readonly beneficiary: XcmVersionedMultiLocation;
            readonly assets: XcmVersionedMultiAssets;
            readonly feeAssetItem: u32;
            readonly weightLimit: XcmV2WeightLimit;
        } & Struct;
        readonly type: 'Send' | 'TeleportAssets' | 'ReserveTransferAssets' | 'Execute' | 'ForceXcmVersion' | 'ForceDefaultXcmVersion' | 'ForceSubscribeVersionNotify' | 'ForceUnsubscribeVersionNotify' | 'LimitedReserveTransferAssets' | 'LimitedTeleportAssets';
    }
    /** @name XcmVersionedXcm (225) */
    interface XcmVersionedXcm extends Enum {
        readonly isV0: boolean;
        readonly asV0: XcmV0Xcm;
        readonly isV1: boolean;
        readonly asV1: XcmV1Xcm;
        readonly isV2: boolean;
        readonly asV2: XcmV2Xcm;
        readonly type: 'V0' | 'V1' | 'V2';
    }
    /** @name XcmV0Xcm (226) */
    interface XcmV0Xcm extends Enum {
        readonly isWithdrawAsset: boolean;
        readonly asWithdrawAsset: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isReserveAssetDeposit: boolean;
        readonly asReserveAssetDeposit: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isTeleportAsset: boolean;
        readonly asTeleportAsset: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isQueryResponse: boolean;
        readonly asQueryResponse: {
            readonly queryId: Compact<u64>;
            readonly response: XcmV0Response;
        } & Struct;
        readonly isTransferAsset: boolean;
        readonly asTransferAsset: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly dest: XcmV0MultiLocation;
        } & Struct;
        readonly isTransferReserveAsset: boolean;
        readonly asTransferReserveAsset: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly dest: XcmV0MultiLocation;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isTransact: boolean;
        readonly asTransact: {
            readonly originType: XcmV0OriginKind;
            readonly requireWeightAtMost: u64;
            readonly call: XcmDoubleEncoded;
        } & Struct;
        readonly isHrmpNewChannelOpenRequest: boolean;
        readonly asHrmpNewChannelOpenRequest: {
            readonly sender: Compact<u32>;
            readonly maxMessageSize: Compact<u32>;
            readonly maxCapacity: Compact<u32>;
        } & Struct;
        readonly isHrmpChannelAccepted: boolean;
        readonly asHrmpChannelAccepted: {
            readonly recipient: Compact<u32>;
        } & Struct;
        readonly isHrmpChannelClosing: boolean;
        readonly asHrmpChannelClosing: {
            readonly initiator: Compact<u32>;
            readonly sender: Compact<u32>;
            readonly recipient: Compact<u32>;
        } & Struct;
        readonly isRelayedFrom: boolean;
        readonly asRelayedFrom: {
            readonly who: XcmV0MultiLocation;
            readonly message: XcmV0Xcm;
        } & Struct;
        readonly type: 'WithdrawAsset' | 'ReserveAssetDeposit' | 'TeleportAsset' | 'QueryResponse' | 'TransferAsset' | 'TransferReserveAsset' | 'Transact' | 'HrmpNewChannelOpenRequest' | 'HrmpChannelAccepted' | 'HrmpChannelClosing' | 'RelayedFrom';
    }
    /** @name XcmV0Order (228) */
    interface XcmV0Order extends Enum {
        readonly isNull: boolean;
        readonly isDepositAsset: boolean;
        readonly asDepositAsset: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly dest: XcmV0MultiLocation;
        } & Struct;
        readonly isDepositReserveAsset: boolean;
        readonly asDepositReserveAsset: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly dest: XcmV0MultiLocation;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isExchangeAsset: boolean;
        readonly asExchangeAsset: {
            readonly give: Vec<XcmV0MultiAsset>;
            readonly receive: Vec<XcmV0MultiAsset>;
        } & Struct;
        readonly isInitiateReserveWithdraw: boolean;
        readonly asInitiateReserveWithdraw: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly reserve: XcmV0MultiLocation;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isInitiateTeleport: boolean;
        readonly asInitiateTeleport: {
            readonly assets: Vec<XcmV0MultiAsset>;
            readonly dest: XcmV0MultiLocation;
            readonly effects: Vec<XcmV0Order>;
        } & Struct;
        readonly isQueryHolding: boolean;
        readonly asQueryHolding: {
            readonly queryId: Compact<u64>;
            readonly dest: XcmV0MultiLocation;
            readonly assets: Vec<XcmV0MultiAsset>;
        } & Struct;
        readonly isBuyExecution: boolean;
        readonly asBuyExecution: {
            readonly fees: XcmV0MultiAsset;
            readonly weight: u64;
            readonly debt: u64;
            readonly haltOnError: bool;
            readonly xcm: Vec<XcmV0Xcm>;
        } & Struct;
        readonly type: 'Null' | 'DepositAsset' | 'DepositReserveAsset' | 'ExchangeAsset' | 'InitiateReserveWithdraw' | 'InitiateTeleport' | 'QueryHolding' | 'BuyExecution';
    }
    /** @name XcmV0Response (230) */
    interface XcmV0Response extends Enum {
        readonly isAssets: boolean;
        readonly asAssets: Vec<XcmV0MultiAsset>;
        readonly type: 'Assets';
    }
    /** @name XcmV1Xcm (231) */
    interface XcmV1Xcm extends Enum {
        readonly isWithdrawAsset: boolean;
        readonly asWithdrawAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isReserveAssetDeposited: boolean;
        readonly asReserveAssetDeposited: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isReceiveTeleportedAsset: boolean;
        readonly asReceiveTeleportedAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isQueryResponse: boolean;
        readonly asQueryResponse: {
            readonly queryId: Compact<u64>;
            readonly response: XcmV1Response;
        } & Struct;
        readonly isTransferAsset: boolean;
        readonly asTransferAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly beneficiary: XcmV1MultiLocation;
        } & Struct;
        readonly isTransferReserveAsset: boolean;
        readonly asTransferReserveAsset: {
            readonly assets: XcmV1MultiassetMultiAssets;
            readonly dest: XcmV1MultiLocation;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isTransact: boolean;
        readonly asTransact: {
            readonly originType: XcmV0OriginKind;
            readonly requireWeightAtMost: u64;
            readonly call: XcmDoubleEncoded;
        } & Struct;
        readonly isHrmpNewChannelOpenRequest: boolean;
        readonly asHrmpNewChannelOpenRequest: {
            readonly sender: Compact<u32>;
            readonly maxMessageSize: Compact<u32>;
            readonly maxCapacity: Compact<u32>;
        } & Struct;
        readonly isHrmpChannelAccepted: boolean;
        readonly asHrmpChannelAccepted: {
            readonly recipient: Compact<u32>;
        } & Struct;
        readonly isHrmpChannelClosing: boolean;
        readonly asHrmpChannelClosing: {
            readonly initiator: Compact<u32>;
            readonly sender: Compact<u32>;
            readonly recipient: Compact<u32>;
        } & Struct;
        readonly isRelayedFrom: boolean;
        readonly asRelayedFrom: {
            readonly who: XcmV1MultilocationJunctions;
            readonly message: XcmV1Xcm;
        } & Struct;
        readonly isSubscribeVersion: boolean;
        readonly asSubscribeVersion: {
            readonly queryId: Compact<u64>;
            readonly maxResponseWeight: Compact<u64>;
        } & Struct;
        readonly isUnsubscribeVersion: boolean;
        readonly type: 'WithdrawAsset' | 'ReserveAssetDeposited' | 'ReceiveTeleportedAsset' | 'QueryResponse' | 'TransferAsset' | 'TransferReserveAsset' | 'Transact' | 'HrmpNewChannelOpenRequest' | 'HrmpChannelAccepted' | 'HrmpChannelClosing' | 'RelayedFrom' | 'SubscribeVersion' | 'UnsubscribeVersion';
    }
    /** @name XcmV1Order (233) */
    interface XcmV1Order extends Enum {
        readonly isNoop: boolean;
        readonly isDepositAsset: boolean;
        readonly asDepositAsset: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly maxAssets: u32;
            readonly beneficiary: XcmV1MultiLocation;
        } & Struct;
        readonly isDepositReserveAsset: boolean;
        readonly asDepositReserveAsset: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly maxAssets: u32;
            readonly dest: XcmV1MultiLocation;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isExchangeAsset: boolean;
        readonly asExchangeAsset: {
            readonly give: XcmV1MultiassetMultiAssetFilter;
            readonly receive: XcmV1MultiassetMultiAssets;
        } & Struct;
        readonly isInitiateReserveWithdraw: boolean;
        readonly asInitiateReserveWithdraw: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly reserve: XcmV1MultiLocation;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isInitiateTeleport: boolean;
        readonly asInitiateTeleport: {
            readonly assets: XcmV1MultiassetMultiAssetFilter;
            readonly dest: XcmV1MultiLocation;
            readonly effects: Vec<XcmV1Order>;
        } & Struct;
        readonly isQueryHolding: boolean;
        readonly asQueryHolding: {
            readonly queryId: Compact<u64>;
            readonly dest: XcmV1MultiLocation;
            readonly assets: XcmV1MultiassetMultiAssetFilter;
        } & Struct;
        readonly isBuyExecution: boolean;
        readonly asBuyExecution: {
            readonly fees: XcmV1MultiAsset;
            readonly weight: u64;
            readonly debt: u64;
            readonly haltOnError: bool;
            readonly instructions: Vec<XcmV1Xcm>;
        } & Struct;
        readonly type: 'Noop' | 'DepositAsset' | 'DepositReserveAsset' | 'ExchangeAsset' | 'InitiateReserveWithdraw' | 'InitiateTeleport' | 'QueryHolding' | 'BuyExecution';
    }
    /** @name XcmV1Response (235) */
    interface XcmV1Response extends Enum {
        readonly isAssets: boolean;
        readonly asAssets: XcmV1MultiassetMultiAssets;
        readonly isVersion: boolean;
        readonly asVersion: u32;
        readonly type: 'Assets' | 'Version';
    }
    /** @name CumulusPalletDmpQueueCall (249) */
    interface CumulusPalletDmpQueueCall extends Enum {
        readonly isServiceOverweight: boolean;
        readonly asServiceOverweight: {
            readonly index: u64;
            readonly weightLimit: WeightV1;
        } & Struct;
        readonly type: 'ServiceOverweight';
    }
    /** @name OrmlCurrenciesModuleCall (250) */
    interface OrmlCurrenciesModuleCall extends Enum {
        readonly isTransfer: boolean;
        readonly asTransfer: {
            readonly dest: MultiAddress;
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly amount: Compact<u128>;
        } & Struct;
        readonly isTransferNativeCurrency: boolean;
        readonly asTransferNativeCurrency: {
            readonly dest: MultiAddress;
            readonly amount: Compact<u128>;
        } & Struct;
        readonly isUpdateBalance: boolean;
        readonly asUpdateBalance: {
            readonly who: MultiAddress;
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly amount: i128;
        } & Struct;
        readonly type: 'Transfer' | 'TransferNativeCurrency' | 'UpdateBalance';
    }
    /** @name OrmlXtokensModuleCall (252) */
    interface OrmlXtokensModuleCall extends Enum {
        readonly isTransfer: boolean;
        readonly asTransfer: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly amount: u128;
            readonly dest: XcmVersionedMultiLocation;
            readonly destWeight: u64;
        } & Struct;
        readonly isTransferMultiasset: boolean;
        readonly asTransferMultiasset: {
            readonly asset: XcmVersionedMultiAsset;
            readonly dest: XcmVersionedMultiLocation;
            readonly destWeight: u64;
        } & Struct;
        readonly isTransferWithFee: boolean;
        readonly asTransferWithFee: {
            readonly currencyId: PeaqPrimitivesXcmCurrencyCurrencyId;
            readonly amount: u128;
            readonly fee: u128;
            readonly dest: XcmVersionedMultiLocation;
            readonly destWeight: u64;
        } & Struct;
        readonly isTransferMultiassetWithFee: boolean;
        readonly asTransferMultiassetWithFee: {
            readonly asset: XcmVersionedMultiAsset;
            readonly fee: XcmVersionedMultiAsset;
            readonly dest: XcmVersionedMultiLocation;
            readonly destWeight: u64;
        } & Struct;
        readonly isTransferMulticurrencies: boolean;
        readonly asTransferMulticurrencies: {
            readonly currencies: Vec<ITuple<[PeaqPrimitivesXcmCurrencyCurrencyId, u128]>>;
            readonly feeItem: u32;
            readonly dest: XcmVersionedMultiLocation;
            readonly destWeight: u64;
        } & Struct;
        readonly isTransferMultiassets: boolean;
        readonly asTransferMultiassets: {
            readonly assets: XcmVersionedMultiAssets;
            readonly feeItem: u32;
            readonly dest: XcmVersionedMultiLocation;
            readonly destWeight: u64;
        } & Struct;
        readonly type: 'Transfer' | 'TransferMultiasset' | 'TransferWithFee' | 'TransferMultiassetWithFee' | 'TransferMulticurrencies' | 'TransferMultiassets';
    }
    /** @name XcmVersionedMultiAsset (253) */
    interface XcmVersionedMultiAsset extends Enum {
        readonly isV0: boolean;
        readonly asV0: XcmV0MultiAsset;
        readonly isV1: boolean;
        readonly asV1: XcmV1MultiAsset;
        readonly type: 'V0' | 'V1';
    }
    /** @name PeaqPalletDidCall (256) */
    interface PeaqPalletDidCall extends Enum {
        readonly isAddAttribute: boolean;
        readonly asAddAttribute: {
            readonly didAccount: AccountId32;
            readonly name: Bytes;
            readonly value: Bytes;
            readonly validFor: Option<u32>;
        } & Struct;
        readonly isUpdateAttribute: boolean;
        readonly asUpdateAttribute: {
            readonly didAccount: AccountId32;
            readonly name: Bytes;
            readonly value: Bytes;
            readonly validFor: Option<u32>;
        } & Struct;
        readonly isReadAttribute: boolean;
        readonly asReadAttribute: {
            readonly didAccount: AccountId32;
            readonly name: Bytes;
        } & Struct;
        readonly isRemoveAttribute: boolean;
        readonly asRemoveAttribute: {
            readonly didAccount: AccountId32;
            readonly name: Bytes;
        } & Struct;
        readonly type: 'AddAttribute' | 'UpdateAttribute' | 'ReadAttribute' | 'RemoveAttribute';
    }
    /** @name PeaqPalletTransactionCall (257) */
    interface PeaqPalletTransactionCall extends Enum {
        readonly isServiceRequested: boolean;
        readonly asServiceRequested: {
            readonly provider: AccountId32;
            readonly tokenDeposited: u128;
        } & Struct;
        readonly isServiceDelivered: boolean;
        readonly asServiceDelivered: {
            readonly consumer: AccountId32;
            readonly refundInfo: PeaqPalletTransactionStructsDeliveredInfo;
            readonly spentInfo: PeaqPalletTransactionStructsDeliveredInfo;
        } & Struct;
        readonly type: 'ServiceRequested' | 'ServiceDelivered';
    }
    /** @name PalletMultisigCall (258) */
    interface PalletMultisigCall extends Enum {
        readonly isAsMultiThreshold1: boolean;
        readonly asAsMultiThreshold1: {
            readonly otherSignatories: Vec<AccountId32>;
            readonly call: Call;
        } & Struct;
        readonly isAsMulti: boolean;
        readonly asAsMulti: {
            readonly threshold: u16;
            readonly otherSignatories: Vec<AccountId32>;
            readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
            readonly call: WrapperKeepOpaque<Call>;
            readonly storeCall: bool;
            readonly maxWeight: WeightV1;
        } & Struct;
        readonly isApproveAsMulti: boolean;
        readonly asApproveAsMulti: {
            readonly threshold: u16;
            readonly otherSignatories: Vec<AccountId32>;
            readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
            readonly callHash: U8aFixed;
            readonly maxWeight: WeightV1;
        } & Struct;
        readonly isCancelAsMulti: boolean;
        readonly asCancelAsMulti: {
            readonly threshold: u16;
            readonly otherSignatories: Vec<AccountId32>;
            readonly timepoint: PalletMultisigTimepoint;
            readonly callHash: U8aFixed;
        } & Struct;
        readonly type: 'AsMultiThreshold1' | 'AsMulti' | 'ApproveAsMulti' | 'CancelAsMulti';
    }
    /** @name PeaqPalletRbacCall (262) */
    interface PeaqPalletRbacCall extends Enum {
        readonly isFetchRole: boolean;
        readonly asFetchRole: {
            readonly owner: AccountId32;
            readonly entity: U8aFixed;
        } & Struct;
        readonly isFetchRoles: boolean;
        readonly asFetchRoles: {
            readonly owner: AccountId32;
        } & Struct;
        readonly isAddRole: boolean;
        readonly asAddRole: {
            readonly roleId: U8aFixed;
            readonly name: Bytes;
        } & Struct;
        readonly isUpdateRole: boolean;
        readonly asUpdateRole: {
            readonly roleId: U8aFixed;
            readonly name: Bytes;
        } & Struct;
        readonly isDisableRole: boolean;
        readonly asDisableRole: {
            readonly roleId: U8aFixed;
        } & Struct;
        readonly isFetchUserRoles: boolean;
        readonly asFetchUserRoles: {
            readonly owner: AccountId32;
            readonly userId: U8aFixed;
        } & Struct;
        readonly isAssignRoleToUser: boolean;
        readonly asAssignRoleToUser: {
            readonly roleId: U8aFixed;
            readonly userId: U8aFixed;
        } & Struct;
        readonly isUnassignRoleToUser: boolean;
        readonly asUnassignRoleToUser: {
            readonly roleId: U8aFixed;
            readonly userId: U8aFixed;
        } & Struct;
        readonly isFetchPermission: boolean;
        readonly asFetchPermission: {
            readonly owner: AccountId32;
            readonly permissionId: U8aFixed;
        } & Struct;
        readonly isFetchPermissions: boolean;
        readonly asFetchPermissions: {
            readonly owner: AccountId32;
        } & Struct;
        readonly isAddPermission: boolean;
        readonly asAddPermission: {
            readonly permissionId: U8aFixed;
            readonly name: Bytes;
        } & Struct;
        readonly isUpdatePermission: boolean;
        readonly asUpdatePermission: {
            readonly permissionId: U8aFixed;
            readonly name: Bytes;
        } & Struct;
        readonly isDisablePermission: boolean;
        readonly asDisablePermission: {
            readonly permissionId: U8aFixed;
        } & Struct;
        readonly isFetchRolePermissions: boolean;
        readonly asFetchRolePermissions: {
            readonly owner: AccountId32;
            readonly roleId: U8aFixed;
        } & Struct;
        readonly isAssignPermissionToRole: boolean;
        readonly asAssignPermissionToRole: {
            readonly permissionId: U8aFixed;
            readonly roleId: U8aFixed;
        } & Struct;
        readonly isUnassignPermissionToRole: boolean;
        readonly asUnassignPermissionToRole: {
            readonly permissionId: U8aFixed;
            readonly roleId: U8aFixed;
        } & Struct;
        readonly isFetchGroup: boolean;
        readonly asFetchGroup: {
            readonly owner: AccountId32;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isFetchGroups: boolean;
        readonly asFetchGroups: {
            readonly owner: AccountId32;
        } & Struct;
        readonly isAddGroup: boolean;
        readonly asAddGroup: {
            readonly groupId: U8aFixed;
            readonly name: Bytes;
        } & Struct;
        readonly isUpdateGroup: boolean;
        readonly asUpdateGroup: {
            readonly groupId: U8aFixed;
            readonly name: Bytes;
        } & Struct;
        readonly isDisableGroup: boolean;
        readonly asDisableGroup: {
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isAssignRoleToGroup: boolean;
        readonly asAssignRoleToGroup: {
            readonly roleId: U8aFixed;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isUnassignRoleToGroup: boolean;
        readonly asUnassignRoleToGroup: {
            readonly roleId: U8aFixed;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isFetchGroupRoles: boolean;
        readonly asFetchGroupRoles: {
            readonly owner: AccountId32;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isAssignUserToGroup: boolean;
        readonly asAssignUserToGroup: {
            readonly userId: U8aFixed;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isUnassignUserToGroup: boolean;
        readonly asUnassignUserToGroup: {
            readonly userId: U8aFixed;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly isFetchUserGroups: boolean;
        readonly asFetchUserGroups: {
            readonly owner: AccountId32;
            readonly userId: U8aFixed;
        } & Struct;
        readonly isFetchUserPermissions: boolean;
        readonly asFetchUserPermissions: {
            readonly owner: AccountId32;
            readonly userId: U8aFixed;
        } & Struct;
        readonly isFetchGroupPermissions: boolean;
        readonly asFetchGroupPermissions: {
            readonly owner: AccountId32;
            readonly groupId: U8aFixed;
        } & Struct;
        readonly type: 'FetchRole' | 'FetchRoles' | 'AddRole' | 'UpdateRole' | 'DisableRole' | 'FetchUserRoles' | 'AssignRoleToUser' | 'UnassignRoleToUser' | 'FetchPermission' | 'FetchPermissions' | 'AddPermission' | 'UpdatePermission' | 'DisablePermission' | 'FetchRolePermissions' | 'AssignPermissionToRole' | 'UnassignPermissionToRole' | 'FetchGroup' | 'FetchGroups' | 'AddGroup' | 'UpdateGroup' | 'DisableGroup' | 'AssignRoleToGroup' | 'UnassignRoleToGroup' | 'FetchGroupRoles' | 'AssignUserToGroup' | 'UnassignUserToGroup' | 'FetchUserGroups' | 'FetchUserPermissions' | 'FetchGroupPermissions';
    }
    /** @name PeaqPalletStorageCall (263) */
    interface PeaqPalletStorageCall extends Enum {
        readonly isAddItem: boolean;
        readonly asAddItem: {
            readonly itemType: Bytes;
            readonly item: Bytes;
        } & Struct;
        readonly isUpdateItem: boolean;
        readonly asUpdateItem: {
            readonly itemType: Bytes;
            readonly item: Bytes;
        } & Struct;
        readonly isGetItem: boolean;
        readonly asGetItem: {
            readonly itemType: Bytes;
        } & Struct;
        readonly type: 'AddItem' | 'UpdateItem' | 'GetItem';
    }
    /** @name PeaqPalletMorCall (264) */
    interface PeaqPalletMorCall extends Enum {
        readonly isRegisterNewMachine: boolean;
        readonly asRegisterNewMachine: {
            readonly machine: AccountId32;
        } & Struct;
        readonly isGetOnlineRewards: boolean;
        readonly asGetOnlineRewards: {
            readonly machine: AccountId32;
        } & Struct;
        readonly isPayMachineUsage: boolean;
        readonly asPayMachineUsage: {
            readonly machine: AccountId32;
            readonly amount: u128;
        } & Struct;
        readonly isFetchPotBalance: boolean;
        readonly isFetchPeriodRewarding: boolean;
        readonly type: 'RegisterNewMachine' | 'GetOnlineRewards' | 'PayMachineUsage' | 'FetchPotBalance' | 'FetchPeriodRewarding';
    }
    /** @name PalletSudoError (265) */
    interface PalletSudoError extends Enum {
        readonly isRequireSudo: boolean;
        readonly type: 'RequireSudo';
    }
    /** @name PalletContractsWasmPrefabWasmModule (267) */
    interface PalletContractsWasmPrefabWasmModule extends Struct {
        readonly instructionWeightsVersion: Compact<u32>;
        readonly initial: Compact<u32>;
        readonly maximum: Compact<u32>;
        readonly code: Bytes;
    }
    /** @name PalletContractsWasmOwnerInfo (269) */
    interface PalletContractsWasmOwnerInfo extends Struct {
        readonly owner: AccountId32;
        readonly deposit: Compact<u128>;
        readonly refcount: Compact<u64>;
    }
    /** @name PalletContractsStorageRawContractInfo (270) */
    interface PalletContractsStorageRawContractInfo extends Struct {
        readonly trieId: Bytes;
        readonly codeHash: H256;
        readonly storageDeposit: u128;
    }
    /** @name PalletContractsStorageDeletedContract (273) */
    interface PalletContractsStorageDeletedContract extends Struct {
        readonly trieId: Bytes;
    }
    /** @name PalletContractsSchedule (275) */
    interface PalletContractsSchedule extends Struct {
        readonly limits: PalletContractsScheduleLimits;
        readonly instructionWeights: PalletContractsScheduleInstructionWeights;
        readonly hostFnWeights: PalletContractsScheduleHostFnWeights;
    }
    /** @name PalletContractsScheduleLimits (276) */
    interface PalletContractsScheduleLimits extends Struct {
        readonly eventTopics: u32;
        readonly stackHeight: Option<u32>;
        readonly globals: u32;
        readonly parameters: u32;
        readonly memoryPages: u32;
        readonly tableSize: u32;
        readonly brTableSize: u32;
        readonly subjectLen: u32;
        readonly callDepth: u32;
        readonly payloadLen: u32;
    }
    /** @name PalletContractsScheduleInstructionWeights (277) */
    interface PalletContractsScheduleInstructionWeights extends Struct {
        readonly version: u32;
        readonly i64const: u32;
        readonly i64load: u32;
        readonly i64store: u32;
        readonly select: u32;
        readonly r_if: u32;
        readonly br: u32;
        readonly brIf: u32;
        readonly brTable: u32;
        readonly brTablePerEntry: u32;
        readonly call: u32;
        readonly callIndirect: u32;
        readonly callIndirectPerParam: u32;
        readonly localGet: u32;
        readonly localSet: u32;
        readonly localTee: u32;
        readonly globalGet: u32;
        readonly globalSet: u32;
        readonly memoryCurrent: u32;
        readonly memoryGrow: u32;
        readonly i64clz: u32;
        readonly i64ctz: u32;
        readonly i64popcnt: u32;
        readonly i64eqz: u32;
        readonly i64extendsi32: u32;
        readonly i64extendui32: u32;
        readonly i32wrapi64: u32;
        readonly i64eq: u32;
        readonly i64ne: u32;
        readonly i64lts: u32;
        readonly i64ltu: u32;
        readonly i64gts: u32;
        readonly i64gtu: u32;
        readonly i64les: u32;
        readonly i64leu: u32;
        readonly i64ges: u32;
        readonly i64geu: u32;
        readonly i64add: u32;
        readonly i64sub: u32;
        readonly i64mul: u32;
        readonly i64divs: u32;
        readonly i64divu: u32;
        readonly i64rems: u32;
        readonly i64remu: u32;
        readonly i64and: u32;
        readonly i64or: u32;
        readonly i64xor: u32;
        readonly i64shl: u32;
        readonly i64shrs: u32;
        readonly i64shru: u32;
        readonly i64rotl: u32;
        readonly i64rotr: u32;
    }
    /** @name PalletContractsScheduleHostFnWeights (278) */
    interface PalletContractsScheduleHostFnWeights extends Struct {
        readonly caller: u64;
        readonly isContract: u64;
        readonly codeHash: u64;
        readonly ownCodeHash: u64;
        readonly callerIsOrigin: u64;
        readonly address: u64;
        readonly gasLeft: u64;
        readonly balance: u64;
        readonly valueTransferred: u64;
        readonly minimumBalance: u64;
        readonly blockNumber: u64;
        readonly now: u64;
        readonly weightToFee: u64;
        readonly gas: u64;
        readonly input: u64;
        readonly inputPerByte: u64;
        readonly r_return: u64;
        readonly returnPerByte: u64;
        readonly terminate: u64;
        readonly random: u64;
        readonly depositEvent: u64;
        readonly depositEventPerTopic: u64;
        readonly depositEventPerByte: u64;
        readonly debugMessage: u64;
        readonly setStorage: u64;
        readonly setStoragePerNewByte: u64;
        readonly setStoragePerOldByte: u64;
        readonly setCodeHash: u64;
        readonly clearStorage: u64;
        readonly clearStoragePerByte: u64;
        readonly containsStorage: u64;
        readonly containsStoragePerByte: u64;
        readonly getStorage: u64;
        readonly getStoragePerByte: u64;
        readonly takeStorage: u64;
        readonly takeStoragePerByte: u64;
        readonly transfer: u64;
        readonly call: u64;
        readonly delegateCall: u64;
        readonly callTransferSurcharge: u64;
        readonly callPerClonedByte: u64;
        readonly instantiate: u64;
        readonly instantiateTransferSurcharge: u64;
        readonly instantiatePerSaltByte: u64;
        readonly hashSha2256: u64;
        readonly hashSha2256PerByte: u64;
        readonly hashKeccak256: u64;
        readonly hashKeccak256PerByte: u64;
        readonly hashBlake2256: u64;
        readonly hashBlake2256PerByte: u64;
        readonly hashBlake2128: u64;
        readonly hashBlake2128PerByte: u64;
        readonly ecdsaRecover: u64;
        readonly ecdsaToEthAddress: u64;
    }
    /** @name PalletContractsError (279) */
    interface PalletContractsError extends Enum {
        readonly isInvalidScheduleVersion: boolean;
        readonly isInvalidCallFlags: boolean;
        readonly isOutOfGas: boolean;
        readonly isOutputBufferTooSmall: boolean;
        readonly isTransferFailed: boolean;
        readonly isMaxCallDepthReached: boolean;
        readonly isContractNotFound: boolean;
        readonly isCodeTooLarge: boolean;
        readonly isCodeNotFound: boolean;
        readonly isOutOfBounds: boolean;
        readonly isDecodingFailed: boolean;
        readonly isContractTrapped: boolean;
        readonly isValueTooLarge: boolean;
        readonly isTerminatedWhileReentrant: boolean;
        readonly isInputForwarded: boolean;
        readonly isRandomSubjectTooLong: boolean;
        readonly isTooManyTopics: boolean;
        readonly isDuplicateTopics: boolean;
        readonly isNoChainExtension: boolean;
        readonly isDeletionQueueFull: boolean;
        readonly isDuplicateContract: boolean;
        readonly isTerminatedInConstructor: boolean;
        readonly isDebugMessageInvalidUTF8: boolean;
        readonly isReentranceDenied: boolean;
        readonly isStorageDepositNotEnoughFunds: boolean;
        readonly isStorageDepositLimitExhausted: boolean;
        readonly isCodeInUse: boolean;
        readonly isContractReverted: boolean;
        readonly isCodeRejected: boolean;
        readonly type: 'InvalidScheduleVersion' | 'InvalidCallFlags' | 'OutOfGas' | 'OutputBufferTooSmall' | 'TransferFailed' | 'MaxCallDepthReached' | 'ContractNotFound' | 'CodeTooLarge' | 'CodeNotFound' | 'OutOfBounds' | 'DecodingFailed' | 'ContractTrapped' | 'ValueTooLarge' | 'TerminatedWhileReentrant' | 'InputForwarded' | 'RandomSubjectTooLong' | 'TooManyTopics' | 'DuplicateTopics' | 'NoChainExtension' | 'DeletionQueueFull' | 'DuplicateContract' | 'TerminatedInConstructor' | 'DebugMessageInvalidUTF8' | 'ReentranceDenied' | 'StorageDepositNotEnoughFunds' | 'StorageDepositLimitExhausted' | 'CodeInUse' | 'ContractReverted' | 'CodeRejected';
    }
    /** @name PalletUtilityError (280) */
    interface PalletUtilityError extends Enum {
        readonly isTooManyCalls: boolean;
        readonly type: 'TooManyCalls';
    }
    /** @name FpRpcTransactionStatus (283) */
    interface FpRpcTransactionStatus extends Struct {
        readonly transactionHash: H256;
        readonly transactionIndex: u32;
        readonly from: H160;
        readonly to: Option<H160>;
        readonly contractAddress: Option<H160>;
        readonly logs: Vec<EthereumLog>;
        readonly logsBloom: EthbloomBloom;
    }
    /** @name EthbloomBloom (286) */
    interface EthbloomBloom extends U8aFixed {
    }
    /** @name EthereumReceiptReceiptV3 (288) */
    interface EthereumReceiptReceiptV3 extends Enum {
        readonly isLegacy: boolean;
        readonly asLegacy: EthereumReceiptEip658ReceiptData;
        readonly isEip2930: boolean;
        readonly asEip2930: EthereumReceiptEip658ReceiptData;
        readonly isEip1559: boolean;
        readonly asEip1559: EthereumReceiptEip658ReceiptData;
        readonly type: 'Legacy' | 'Eip2930' | 'Eip1559';
    }
    /** @name EthereumReceiptEip658ReceiptData (289) */
    interface EthereumReceiptEip658ReceiptData extends Struct {
        readonly statusCode: u8;
        readonly usedGas: U256;
        readonly logsBloom: EthbloomBloom;
        readonly logs: Vec<EthereumLog>;
    }
    /** @name EthereumBlock (290) */
    interface EthereumBlock extends Struct {
        readonly header: EthereumHeader;
        readonly transactions: Vec<EthereumTransactionTransactionV2>;
        readonly ommers: Vec<EthereumHeader>;
    }
    /** @name EthereumHeader (291) */
    interface EthereumHeader extends Struct {
        readonly parentHash: H256;
        readonly ommersHash: H256;
        readonly beneficiary: H160;
        readonly stateRoot: H256;
        readonly transactionsRoot: H256;
        readonly receiptsRoot: H256;
        readonly logsBloom: EthbloomBloom;
        readonly difficulty: U256;
        readonly number: U256;
        readonly gasLimit: U256;
        readonly gasUsed: U256;
        readonly timestamp: u64;
        readonly extraData: Bytes;
        readonly mixHash: H256;
        readonly nonce: EthereumTypesHashH64;
    }
    /** @name EthereumTypesHashH64 (292) */
    interface EthereumTypesHashH64 extends U8aFixed {
    }
    /** @name PalletEthereumError (297) */
    interface PalletEthereumError extends Enum {
        readonly isInvalidSignature: boolean;
        readonly isPreLogExists: boolean;
        readonly type: 'InvalidSignature' | 'PreLogExists';
    }
    /** @name PalletEvmError (299) */
    interface PalletEvmError extends Enum {
        readonly isBalanceLow: boolean;
        readonly isFeeOverflow: boolean;
        readonly isPaymentOverflow: boolean;
        readonly isWithdrawFailed: boolean;
        readonly isGasPriceTooLow: boolean;
        readonly isInvalidNonce: boolean;
        readonly isGasLimitTooLow: boolean;
        readonly isGasLimitTooHigh: boolean;
        readonly isUndefined: boolean;
        readonly isReentrancy: boolean;
        readonly type: 'BalanceLow' | 'FeeOverflow' | 'PaymentOverflow' | 'WithdrawFailed' | 'GasPriceTooLow' | 'InvalidNonce' | 'GasLimitTooLow' | 'GasLimitTooHigh' | 'Undefined' | 'Reentrancy';
    }
    /** @name PalletAuthorshipUncleEntryItem (301) */
    interface PalletAuthorshipUncleEntryItem extends Enum {
        readonly isInclusionHeight: boolean;
        readonly asInclusionHeight: u32;
        readonly isUncle: boolean;
        readonly asUncle: ITuple<[H256, Option<AccountId32>]>;
        readonly type: 'InclusionHeight' | 'Uncle';
    }
    /** @name PalletAuthorshipError (303) */
    interface PalletAuthorshipError extends Enum {
        readonly isInvalidUncleParent: boolean;
        readonly isUnclesAlreadySet: boolean;
        readonly isTooManyUncles: boolean;
        readonly isGenesisUncle: boolean;
        readonly isTooHighUncle: boolean;
        readonly isUncleAlreadyIncluded: boolean;
        readonly isOldUncle: boolean;
        readonly type: 'InvalidUncleParent' | 'UnclesAlreadySet' | 'TooManyUncles' | 'GenesisUncle' | 'TooHighUncle' | 'UncleAlreadyIncluded' | 'OldUncle';
    }
    /** @name SpCoreCryptoKeyTypeId (308) */
    interface SpCoreCryptoKeyTypeId extends U8aFixed {
    }
    /** @name PalletSessionError (309) */
    interface PalletSessionError extends Enum {
        readonly isInvalidProof: boolean;
        readonly isNoAssociatedValidatorId: boolean;
        readonly isDuplicatedKey: boolean;
        readonly isNoKeys: boolean;
        readonly isNoAccount: boolean;
        readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount';
    }
    /** @name ParachainStakingRoundInfo (312) */
    interface ParachainStakingRoundInfo extends Struct {
        readonly current: u32;
        readonly first: u32;
        readonly length: u32;
    }
    /** @name ParachainStakingDelegationCounter (313) */
    interface ParachainStakingDelegationCounter extends Struct {
        readonly round: u32;
        readonly counter: u32;
    }
    /** @name ParachainStakingDelegator (314) */
    interface ParachainStakingDelegator extends Struct {
        readonly delegations: ParachainStakingSetOrderedSet;
        readonly total: u128;
    }
    /** @name ParachainStakingSetOrderedSet (315) */
    interface ParachainStakingSetOrderedSet extends Vec<ParachainStakingStake> {
    }
    /** @name ParachainStakingStake (316) */
    interface ParachainStakingStake extends Struct {
        readonly owner: AccountId32;
        readonly amount: u128;
    }
    /** @name ParachainStakingCandidate (319) */
    interface ParachainStakingCandidate extends Struct {
        readonly id: AccountId32;
        readonly stake: u128;
        readonly delegators: ParachainStakingSetOrderedSet;
        readonly total: u128;
        readonly status: ParachainStakingCandidateStatus;
    }
    /** @name ParachainStakingCandidateStatus (322) */
    interface ParachainStakingCandidateStatus extends Enum {
        readonly isActive: boolean;
        readonly isLeaving: boolean;
        readonly asLeaving: u32;
        readonly type: 'Active' | 'Leaving';
    }
    /** @name ParachainStakingTotalStake (323) */
    interface ParachainStakingTotalStake extends Struct {
        readonly collators: u128;
        readonly delegators: u128;
    }
    /** @name ParachainStakingRewardRateRewardRateInfo (326) */
    interface ParachainStakingRewardRateRewardRateInfo extends Struct {
        readonly collatorRate: Perquintill;
        readonly delegatorRate: Perquintill;
    }
    /** @name FrameSupportPalletId (331) */
    interface FrameSupportPalletId extends U8aFixed {
    }
    /** @name ParachainStakingError (332) */
    interface ParachainStakingError extends Enum {
        readonly isDelegatorNotFound: boolean;
        readonly isCandidateNotFound: boolean;
        readonly isDelegatorExists: boolean;
        readonly isCandidateExists: boolean;
        readonly isValStakeZero: boolean;
        readonly isValStakeBelowMin: boolean;
        readonly isValStakeAboveMax: boolean;
        readonly isNomStakeBelowMin: boolean;
        readonly isDelegationBelowMin: boolean;
        readonly isAlreadyLeaving: boolean;
        readonly isNotLeaving: boolean;
        readonly isCannotLeaveYet: boolean;
        readonly isCannotJoinBeforeUnlocking: boolean;
        readonly isAlreadyDelegating: boolean;
        readonly isNotYetDelegating: boolean;
        readonly isDelegationsPerRoundExceeded: boolean;
        readonly isTooManyDelegators: boolean;
        readonly isTooFewCollatorCandidates: boolean;
        readonly isCannotStakeIfLeaving: boolean;
        readonly isCannotDelegateIfLeaving: boolean;
        readonly isMaxCollatorsPerDelegatorExceeded: boolean;
        readonly isAlreadyDelegatedCollator: boolean;
        readonly isDelegationNotFound: boolean;
        readonly isUnderflow: boolean;
        readonly isCannotSetAboveMax: boolean;
        readonly isCannotSetBelowMin: boolean;
        readonly isInvalidSchedule: boolean;
        readonly isNoMoreUnstaking: boolean;
        readonly isStakeNotFound: boolean;
        readonly isUnstakingIsEmpty: boolean;
        readonly type: 'DelegatorNotFound' | 'CandidateNotFound' | 'DelegatorExists' | 'CandidateExists' | 'ValStakeZero' | 'ValStakeBelowMin' | 'ValStakeAboveMax' | 'NomStakeBelowMin' | 'DelegationBelowMin' | 'AlreadyLeaving' | 'NotLeaving' | 'CannotLeaveYet' | 'CannotJoinBeforeUnlocking' | 'AlreadyDelegating' | 'NotYetDelegating' | 'DelegationsPerRoundExceeded' | 'TooManyDelegators' | 'TooFewCollatorCandidates' | 'CannotStakeIfLeaving' | 'CannotDelegateIfLeaving' | 'MaxCollatorsPerDelegatorExceeded' | 'AlreadyDelegatedCollator' | 'DelegationNotFound' | 'Underflow' | 'CannotSetAboveMax' | 'CannotSetBelowMin' | 'InvalidSchedule' | 'NoMoreUnstaking' | 'StakeNotFound' | 'UnstakingIsEmpty';
    }
    /** @name PolkadotPrimitivesV2UpgradeRestriction (334) */
    interface PolkadotPrimitivesV2UpgradeRestriction extends Enum {
        readonly isPresent: boolean;
        readonly type: 'Present';
    }
    /** @name CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot (335) */
    interface CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot extends Struct {
        readonly dmqMqcHead: H256;
        readonly relayDispatchQueueSize: ITuple<[u32, u32]>;
        readonly ingressChannels: Vec<ITuple<[u32, PolkadotPrimitivesV2AbridgedHrmpChannel]>>;
        readonly egressChannels: Vec<ITuple<[u32, PolkadotPrimitivesV2AbridgedHrmpChannel]>>;
    }
    /** @name PolkadotPrimitivesV2AbridgedHrmpChannel (338) */
    interface PolkadotPrimitivesV2AbridgedHrmpChannel extends Struct {
        readonly maxCapacity: u32;
        readonly maxTotalSize: u32;
        readonly maxMessageSize: u32;
        readonly msgCount: u32;
        readonly totalSize: u32;
        readonly mqcHead: Option<H256>;
    }
    /** @name PolkadotPrimitivesV2AbridgedHostConfiguration (339) */
    interface PolkadotPrimitivesV2AbridgedHostConfiguration extends Struct {
        readonly maxCodeSize: u32;
        readonly maxHeadDataSize: u32;
        readonly maxUpwardQueueCount: u32;
        readonly maxUpwardQueueSize: u32;
        readonly maxUpwardMessageSize: u32;
        readonly maxUpwardMessageNumPerCandidate: u32;
        readonly hrmpMaxMessageNumPerCandidate: u32;
        readonly validationUpgradeCooldown: u32;
        readonly validationUpgradeDelay: u32;
    }
    /** @name PolkadotCorePrimitivesOutboundHrmpMessage (345) */
    interface PolkadotCorePrimitivesOutboundHrmpMessage extends Struct {
        readonly recipient: u32;
        readonly data: Bytes;
    }
    /** @name CumulusPalletParachainSystemError (346) */
    interface CumulusPalletParachainSystemError extends Enum {
        readonly isOverlappingUpgrades: boolean;
        readonly isProhibitedByPolkadot: boolean;
        readonly isTooBig: boolean;
        readonly isValidationDataNotAvailable: boolean;
        readonly isHostConfigurationNotAvailable: boolean;
        readonly isNotScheduled: boolean;
        readonly isNothingAuthorized: boolean;
        readonly isUnauthorized: boolean;
        readonly type: 'OverlappingUpgrades' | 'ProhibitedByPolkadot' | 'TooBig' | 'ValidationDataNotAvailable' | 'HostConfigurationNotAvailable' | 'NotScheduled' | 'NothingAuthorized' | 'Unauthorized';
    }
    /** @name PalletBlockRewardError (347) */
    interface PalletBlockRewardError extends Enum {
        readonly isInvalidDistributionConfiguration: boolean;
        readonly type: 'InvalidDistributionConfiguration';
    }
    /** @name CumulusPalletXcmpQueueInboundChannelDetails (349) */
    interface CumulusPalletXcmpQueueInboundChannelDetails extends Struct {
        readonly sender: u32;
        readonly state: CumulusPalletXcmpQueueInboundState;
        readonly messageMetadata: Vec<ITuple<[u32, PolkadotParachainPrimitivesXcmpMessageFormat]>>;
    }
    /** @name CumulusPalletXcmpQueueInboundState (350) */
    interface CumulusPalletXcmpQueueInboundState extends Enum {
        readonly isOk: boolean;
        readonly isSuspended: boolean;
        readonly type: 'Ok' | 'Suspended';
    }
    /** @name PolkadotParachainPrimitivesXcmpMessageFormat (353) */
    interface PolkadotParachainPrimitivesXcmpMessageFormat extends Enum {
        readonly isConcatenatedVersionedXcm: boolean;
        readonly isConcatenatedEncodedBlob: boolean;
        readonly isSignals: boolean;
        readonly type: 'ConcatenatedVersionedXcm' | 'ConcatenatedEncodedBlob' | 'Signals';
    }
    /** @name CumulusPalletXcmpQueueOutboundChannelDetails (356) */
    interface CumulusPalletXcmpQueueOutboundChannelDetails extends Struct {
        readonly recipient: u32;
        readonly state: CumulusPalletXcmpQueueOutboundState;
        readonly signalsExist: bool;
        readonly firstIndex: u16;
        readonly lastIndex: u16;
    }
    /** @name CumulusPalletXcmpQueueOutboundState (357) */
    interface CumulusPalletXcmpQueueOutboundState extends Enum {
        readonly isOk: boolean;
        readonly isSuspended: boolean;
        readonly type: 'Ok' | 'Suspended';
    }
    /** @name CumulusPalletXcmpQueueQueueConfigData (359) */
    interface CumulusPalletXcmpQueueQueueConfigData extends Struct {
        readonly suspendThreshold: u32;
        readonly dropThreshold: u32;
        readonly resumeThreshold: u32;
        readonly thresholdWeight: WeightV1;
        readonly weightRestrictDecay: WeightV1;
        readonly xcmpMaxIndividualWeight: WeightV1;
    }
    /** @name CumulusPalletXcmpQueueError (361) */
    interface CumulusPalletXcmpQueueError extends Enum {
        readonly isFailedToSend: boolean;
        readonly isBadXcmOrigin: boolean;
        readonly isBadXcm: boolean;
        readonly isBadOverweightIndex: boolean;
        readonly isWeightOverLimit: boolean;
        readonly type: 'FailedToSend' | 'BadXcmOrigin' | 'BadXcm' | 'BadOverweightIndex' | 'WeightOverLimit';
    }
    /** @name PalletXcmError (362) */
    interface PalletXcmError extends Enum {
        readonly isUnreachable: boolean;
        readonly isSendFailure: boolean;
        readonly isFiltered: boolean;
        readonly isUnweighableMessage: boolean;
        readonly isDestinationNotInvertible: boolean;
        readonly isEmpty: boolean;
        readonly isCannotReanchor: boolean;
        readonly isTooManyAssets: boolean;
        readonly isInvalidOrigin: boolean;
        readonly isBadVersion: boolean;
        readonly isBadLocation: boolean;
        readonly isNoSubscription: boolean;
        readonly isAlreadySubscribed: boolean;
        readonly type: 'Unreachable' | 'SendFailure' | 'Filtered' | 'UnweighableMessage' | 'DestinationNotInvertible' | 'Empty' | 'CannotReanchor' | 'TooManyAssets' | 'InvalidOrigin' | 'BadVersion' | 'BadLocation' | 'NoSubscription' | 'AlreadySubscribed';
    }
    /** @name CumulusPalletXcmError (363) */
    type CumulusPalletXcmError = Null;
    /** @name CumulusPalletDmpQueueConfigData (364) */
    interface CumulusPalletDmpQueueConfigData extends Struct {
        readonly maxIndividual: WeightV1;
    }
    /** @name CumulusPalletDmpQueuePageIndexData (365) */
    interface CumulusPalletDmpQueuePageIndexData extends Struct {
        readonly beginUsed: u32;
        readonly endUsed: u32;
        readonly overweightCount: u64;
    }
    /** @name CumulusPalletDmpQueueError (368) */
    interface CumulusPalletDmpQueueError extends Enum {
        readonly isUnknown: boolean;
        readonly isOverLimit: boolean;
        readonly type: 'Unknown' | 'OverLimit';
    }
    /** @name OrmlCurrenciesModuleError (369) */
    interface OrmlCurrenciesModuleError extends Enum {
        readonly isAmountIntoBalanceFailed: boolean;
        readonly isBalanceTooLow: boolean;
        readonly isDepositFailed: boolean;
        readonly type: 'AmountIntoBalanceFailed' | 'BalanceTooLow' | 'DepositFailed';
    }
    /** @name OrmlTokensBalanceLock (372) */
    interface OrmlTokensBalanceLock extends Struct {
        readonly id: U8aFixed;
        readonly amount: u128;
    }
    /** @name OrmlTokensAccountData (374) */
    interface OrmlTokensAccountData extends Struct {
        readonly free: u128;
        readonly reserved: u128;
        readonly frozen: u128;
    }
    /** @name OrmlTokensReserveData (376) */
    interface OrmlTokensReserveData extends Struct {
        readonly id: U8aFixed;
        readonly amount: u128;
    }
    /** @name OrmlTokensModuleError (378) */
    interface OrmlTokensModuleError extends Enum {
        readonly isBalanceTooLow: boolean;
        readonly isAmountIntoBalanceFailed: boolean;
        readonly isLiquidityRestrictions: boolean;
        readonly isMaxLocksExceeded: boolean;
        readonly isKeepAlive: boolean;
        readonly isExistentialDeposit: boolean;
        readonly isDeadAccount: boolean;
        readonly isTooManyReserves: boolean;
        readonly type: 'BalanceTooLow' | 'AmountIntoBalanceFailed' | 'LiquidityRestrictions' | 'MaxLocksExceeded' | 'KeepAlive' | 'ExistentialDeposit' | 'DeadAccount' | 'TooManyReserves';
    }
    /** @name OrmlXtokensModuleError (379) */
    interface OrmlXtokensModuleError extends Enum {
        readonly isAssetHasNoReserve: boolean;
        readonly isNotCrossChainTransfer: boolean;
        readonly isInvalidDest: boolean;
        readonly isNotCrossChainTransferableCurrency: boolean;
        readonly isUnweighableMessage: boolean;
        readonly isXcmExecutionFailed: boolean;
        readonly isCannotReanchor: boolean;
        readonly isInvalidAncestry: boolean;
        readonly isInvalidAsset: boolean;
        readonly isDestinationNotInvertible: boolean;
        readonly isBadVersion: boolean;
        readonly isDistinctReserveForAssetAndFee: boolean;
        readonly isZeroFee: boolean;
        readonly isZeroAmount: boolean;
        readonly isTooManyAssetsBeingSent: boolean;
        readonly isAssetIndexNonExistent: boolean;
        readonly isFeeNotEnough: boolean;
        readonly isNotSupportedMultiLocation: boolean;
        readonly isMinXcmFeeNotDefined: boolean;
        readonly type: 'AssetHasNoReserve' | 'NotCrossChainTransfer' | 'InvalidDest' | 'NotCrossChainTransferableCurrency' | 'UnweighableMessage' | 'XcmExecutionFailed' | 'CannotReanchor' | 'InvalidAncestry' | 'InvalidAsset' | 'DestinationNotInvertible' | 'BadVersion' | 'DistinctReserveForAssetAndFee' | 'ZeroFee' | 'ZeroAmount' | 'TooManyAssetsBeingSent' | 'AssetIndexNonExistent' | 'FeeNotEnough' | 'NotSupportedMultiLocation' | 'MinXcmFeeNotDefined';
    }
    /** @name OrmlUnknownTokensModuleError (382) */
    interface OrmlUnknownTokensModuleError extends Enum {
        readonly isBalanceTooLow: boolean;
        readonly isBalanceOverflow: boolean;
        readonly isUnhandledAsset: boolean;
        readonly type: 'BalanceTooLow' | 'BalanceOverflow' | 'UnhandledAsset';
    }
    /** @name PeaqPalletDidError (384) */
    interface PeaqPalletDidError extends Enum {
        readonly isAttributeNameExceedMax64: boolean;
        readonly isAttributeAlreadyExist: boolean;
        readonly isAttributeCreationFailed: boolean;
        readonly isAttributeUpdateFailed: boolean;
        readonly isAttributeNotFound: boolean;
        readonly isAttributeAuthorizationFailed: boolean;
        readonly isMaxBlockNumberExceeded: boolean;
        readonly isInvalidSuppliedValue: boolean;
        readonly isParseError: boolean;
        readonly type: 'AttributeNameExceedMax64' | 'AttributeAlreadyExist' | 'AttributeCreationFailed' | 'AttributeUpdateFailed' | 'AttributeNotFound' | 'AttributeAuthorizationFailed' | 'MaxBlockNumberExceeded' | 'InvalidSuppliedValue' | 'ParseError';
    }
    /** @name PeaqPalletTransactionError (385) */
    type PeaqPalletTransactionError = Null;
    /** @name PalletMultisigMultisig (386) */
    interface PalletMultisigMultisig extends Struct {
        readonly when: PalletMultisigTimepoint;
        readonly deposit: u128;
        readonly depositor: AccountId32;
        readonly approvals: Vec<AccountId32>;
    }
    /** @name PalletMultisigError (388) */
    interface PalletMultisigError extends Enum {
        readonly isMinimumThreshold: boolean;
        readonly isAlreadyApproved: boolean;
        readonly isNoApprovalsNeeded: boolean;
        readonly isTooFewSignatories: boolean;
        readonly isTooManySignatories: boolean;
        readonly isSignatoriesOutOfOrder: boolean;
        readonly isSenderInSignatories: boolean;
        readonly isNotFound: boolean;
        readonly isNotOwner: boolean;
        readonly isNoTimepoint: boolean;
        readonly isWrongTimepoint: boolean;
        readonly isUnexpectedTimepoint: boolean;
        readonly isMaxWeightTooLow: boolean;
        readonly isAlreadyStored: boolean;
        readonly type: 'MinimumThreshold' | 'AlreadyApproved' | 'NoApprovalsNeeded' | 'TooFewSignatories' | 'TooManySignatories' | 'SignatoriesOutOfOrder' | 'SenderInSignatories' | 'NotFound' | 'NotOwner' | 'NoTimepoint' | 'WrongTimepoint' | 'UnexpectedTimepoint' | 'MaxWeightTooLow' | 'AlreadyStored';
    }
    /** @name PeaqPalletRbacError (389) */
    interface PeaqPalletRbacError extends Enum {
        readonly isEntityNameExceedMax64: boolean;
        readonly isEntityAlreadyExist: boolean;
        readonly isEntityDoesNotExist: boolean;
        readonly isEntityDisabled: boolean;
        readonly isEntityAuthorizationFailed: boolean;
        readonly isAssignmentAlreadyExist: boolean;
        readonly isAssignmentDoesNotExist: boolean;
        readonly type: 'EntityNameExceedMax64' | 'EntityAlreadyExist' | 'EntityDoesNotExist' | 'EntityDisabled' | 'EntityAuthorizationFailed' | 'AssignmentAlreadyExist' | 'AssignmentDoesNotExist';
    }
    /** @name PeaqPalletStorageError (390) */
    interface PeaqPalletStorageError extends Enum {
        readonly isItemNotFound: boolean;
        readonly isItemTypeAlreadyExists: boolean;
        readonly isItemTypeExceedMax64: boolean;
        readonly isItemExceedMax128: boolean;
        readonly type: 'ItemNotFound' | 'ItemTypeAlreadyExists' | 'ItemTypeExceedMax64' | 'ItemExceedMax128';
    }
    /** @name PeaqPalletMorError (393) */
    interface PeaqPalletMorError extends Enum {
        readonly isAuthorizationFailed: boolean;
        readonly isMachineAlreadyRegistered: boolean;
        readonly isNameExceedMaxChar: boolean;
        readonly isUnexpectedDidError: boolean;
        readonly isUnsufficientTokensInPot: boolean;
        readonly type: 'AuthorizationFailed' | 'MachineAlreadyRegistered' | 'NameExceedMaxChar' | 'UnexpectedDidError' | 'UnsufficientTokensInPot';
    }
    /** @name SpRuntimeMultiSignature (395) */
    interface SpRuntimeMultiSignature extends Enum {
        readonly isEd25519: boolean;
        readonly asEd25519: SpCoreEd25519Signature;
        readonly isSr25519: boolean;
        readonly asSr25519: SpCoreSr25519Signature;
        readonly isEcdsa: boolean;
        readonly asEcdsa: SpCoreEcdsaSignature;
        readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
    }
    /** @name SpCoreEd25519Signature (396) */
    interface SpCoreEd25519Signature extends U8aFixed {
    }
    /** @name SpCoreSr25519Signature (398) */
    interface SpCoreSr25519Signature extends U8aFixed {
    }
    /** @name SpCoreEcdsaSignature (399) */
    interface SpCoreEcdsaSignature extends U8aFixed {
    }
    /** @name FrameSystemExtensionsCheckSpecVersion (402) */
    type FrameSystemExtensionsCheckSpecVersion = Null;
    /** @name FrameSystemExtensionsCheckTxVersion (403) */
    type FrameSystemExtensionsCheckTxVersion = Null;
    /** @name FrameSystemExtensionsCheckGenesis (404) */
    type FrameSystemExtensionsCheckGenesis = Null;
    /** @name FrameSystemExtensionsCheckNonce (407) */
    interface FrameSystemExtensionsCheckNonce extends Compact<u32> {
    }
    /** @name FrameSystemExtensionsCheckWeight (408) */
    type FrameSystemExtensionsCheckWeight = Null;
    /** @name PalletTransactionPaymentChargeTransactionPayment (409) */
    interface PalletTransactionPaymentChargeTransactionPayment extends Compact<u128> {
    }
    /** @name PeaqDevRuntimeRuntime (411) */
    type PeaqDevRuntimeRuntime = Null;
}
