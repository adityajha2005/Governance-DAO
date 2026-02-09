'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBlockNumber } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/config';
import { ABIS } from '../contracts/abis';
import { Address, encodeAbiParameters, keccak256, toHex } from 'viem';
import { Proposal, ProposalState } from '../types/contracts';
import { useEffect, useState } from 'react';

export function useDAOGovernor() {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const { data: votingDelay } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOGovernor,
    abi: ABIS.DAOGovernor,
    functionName: 'votingDelay',
  });

  const { data: votingPeriod } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOGovernor,
    abi: ABIS.DAOGovernor,
    functionName: 'votingPeriod',
  });

  const { data: proposalThreshold } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOGovernor,
    abi: ABIS.DAOGovernor,
    functionName: 'proposalThreshold',
  });

  const { data: quorum } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOGovernor,
    abi: ABIS.DAOGovernor,
    functionName: 'quorum',
    args: [BigInt(0)],
  });

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const getProposalState = async (proposalId: bigint): Promise<ProposalState> => {
    return ProposalState.Active; 
  };

  const createProposal = async (
    targets: Address[],
    values: bigint[],
    calldatas: `0x${string}`[],
    description: string
  ) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACT_ADDRESSES.DAOGovernor,
      abi: ABIS.DAOGovernor,
      functionName: 'propose',
      args: [targets, values, calldatas, description],
    });
  };

  const castVote = async (proposalId: bigint, support: number) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACT_ADDRESSES.DAOGovernor,
      abi: ABIS.DAOGovernor,
      functionName: 'castVote',
      args: [proposalId, support],
    });
  };

  const castVoteWithReason = async (proposalId: bigint, support: number, reason: string) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACT_ADDRESSES.DAOGovernor,
      abi: ABIS.DAOGovernor,
      functionName: 'castVoteWithReason',
      args: [proposalId, support, reason],
    });
  };

  // Queue a proposal
  const queueProposal = async (
    targets: Address[],
    values: bigint[],
    calldatas: `0x${string}`[],
    descriptionHash: `0x${string}`
  ) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACT_ADDRESSES.DAOGovernor,
      abi: ABIS.DAOGovernor,
      functionName: 'queue',
      args: [targets, values, calldatas, descriptionHash],
    });
  };

  // Execute a proposal
  const executeProposal = async (
    targets: Address[],
    values: bigint[],
    calldatas: `0x${string}`[],
    descriptionHash: `0x${string}`
  ) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACT_ADDRESSES.DAOGovernor,
      abi: ABIS.DAOGovernor,
      functionName: 'execute',
      args: [targets, values, calldatas, descriptionHash],
    });
  };

  // Cancel a proposal
  const cancelProposal = async (
    targets: Address[],
    values: bigint[],
    calldatas: `0x${string}`[],
    descriptionHash: `0x${string}`
  ) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: CONTRACT_ADDRESSES.DAOGovernor,
      abi: ABIS.DAOGovernor,
      functionName: 'cancel',
      args: [targets, values, calldatas, descriptionHash],
    });
  };

  // Helper: Hash proposal description
  const hashProposal = (
    targets: Address[],
    values: bigint[],
    calldatas: `0x${string}`[],
    description: string
  ): `0x${string}` => {
    const descriptionHash = keccak256(toHex(description));
    return keccak256(
      encodeAbiParameters(
        [
          { type: 'address[]' },
          { type: 'uint256[]' },
          { type: 'bytes[]' },
          { type: 'bytes32' },
        ],
        [targets, values, calldatas, descriptionHash]
      )
    );
  };

  return {
    // Data
    votingDelay: votingDelay as bigint | undefined,
    votingPeriod: votingPeriod as bigint | undefined,
    proposalThreshold: proposalThreshold as bigint | undefined,
    quorum: quorum as bigint | undefined,
    proposals,

    // Actions
    createProposal,
    castVote,
    castVoteWithReason,
    queueProposal,
    executeProposal,
    cancelProposal,
    getProposalState,
    hashProposal,

    // Transaction state
    isPending: isPending || isConfirming,
    isConfirmed,
    hash,
  };
}
