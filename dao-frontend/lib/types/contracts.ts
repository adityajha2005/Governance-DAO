import { Address } from 'viem';

export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

export interface Proposal {
  id: bigint;
  proposalId: string;
  proposer: Address;
  targets: Address[];
  values: bigint[];
  calldatas: string[];
  description: string;
  state: ProposalState;
  votesFor: bigint;
  votesAgainst: bigint;
  votesAbstain: bigint;
  startBlock: bigint;
  endBlock: bigint;
  eta?: bigint;
}

export interface Vote {
  proposalId: bigint;
  voter: Address;
  support: number; // 0 = Against, 1 = For, 2 = Abstain
  weight: bigint;
  reason?: string;
}

export interface TreasuryAllocation {
  category: string;
  amount: bigint;
  percentage: number;
  color: string;
}

export interface GovernanceStats {
  totalSupply: bigint;
  totalVotingPower: bigint;
  activeProposals: number;
  totalProposals: number;
  treasuryBalance: bigint;
  participationRate: number;
}

export interface UserGovernanceData {
  tokenBalance: bigint;
  votingPower: bigint;
  delegatedTo: Address;
  proposalsVoted: number;
  proposalsCreated: number;
}

export const PROPOSAL_STATE_LABELS: Record<ProposalState, string> = {
  [ProposalState.Pending]: 'Pending',
  [ProposalState.Active]: 'Active',
  [ProposalState.Canceled]: 'Canceled',
  [ProposalState.Defeated]: 'Defeated',
  [ProposalState.Succeeded]: 'Succeeded',
  [ProposalState.Queued]: 'Queued',
  [ProposalState.Expired]: 'Expired',
  [ProposalState.Executed]: 'Executed',
};

export const PROPOSAL_STATE_COLORS: Record<ProposalState, string> = {
  [ProposalState.Pending]: 'text-yellow-500',
  [ProposalState.Active]: 'text-cyan-500',
  [ProposalState.Canceled]: 'text-gray-500',
  [ProposalState.Defeated]: 'text-red-500',
  [ProposalState.Succeeded]: 'text-green-500',
  [ProposalState.Queued]: 'text-blue-500',
  [ProposalState.Expired]: 'text-orange-500',
  [ProposalState.Executed]: 'text-purple-500',
};
