'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/config';
import { ABIS } from '../contracts/abis';
import { Address, formatUnits, parseUnits } from 'viem';

export function useGovernanceToken() {
  const { address } = useAccount();
  
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken,
    abi: ABIS.GovernanceToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: votingPower, refetch: refetchVotingPower } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken,
    abi: ABIS.GovernanceToken,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: delegate } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken,
    abi: ABIS.GovernanceToken,
    functionName: 'delegates',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.GovernanceToken,
    abi: ABIS.GovernanceToken,
    functionName: 'totalSupply',
  });

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const delegateVotes = async (delegatee: Address) => {
    if (!address) throw new Error('Wallet not connected');
    
    writeContract({
      address: CONTRACT_ADDRESSES.GovernanceToken,
      abi: ABIS.GovernanceToken,
      functionName: 'delegate',
      args: [delegatee],
    });
  };

  const selfDelegate = async () => {
    if (!address) throw new Error('Wallet not connected');
    return delegateVotes(address);
  };

  const transfer = async (to: Address, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const parsedAmount = parseUnits(amount, 18);
    writeContract({
      address: CONTRACT_ADDRESSES.GovernanceToken,
      abi: ABIS.GovernanceToken,
      functionName: 'transfer',
      args: [to, parsedAmount],
    });
  };

  const refetch = () => {
    refetchBalance();
    refetchVotingPower();
  };

  return {
    // Data
    balance: balance as bigint | undefined,
    votingPower: votingPower as bigint | undefined,
    delegate: delegate as Address | undefined,
    totalSupply: totalSupply as bigint | undefined,
    isDelegated: delegate === address,
    
    // Formatted data
    balanceFormatted: balance ? formatUnits(balance as bigint, 18) : '0',
    votingPowerFormatted: votingPower ? formatUnits(votingPower as bigint, 18) : '0',
    totalSupplyFormatted: totalSupply ? formatUnits(totalSupply as bigint, 18) : '0',
    
    // Actions
    delegateVotes,
    selfDelegate,
    transfer,
    refetch,
    
    // Transaction state
    isPending: isPending || isConfirming,
    isConfirmed,
    hash,
  };
}
