'use client';

import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/config';
import { ABIS } from '../contracts/abis';
import { Address } from 'viem';

export function useDAOTimelock() {
  const { address } = useAccount();

  // Read minimum delay
  const { data: minDelay } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOTimelock,
    abi: ABIS.DAOTimelock,
    functionName: 'getMinDelay',
  });

  // Check if address has proposer role
  const { data: isProposer } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOTimelock,
    abi: ABIS.DAOTimelock,
    functionName: 'hasRole',
    args: address
      ? [
          '0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1' as `0x${string}`, // PROPOSER_ROLE
          address,
        ]
      : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Check if address has executor role
  const { data: isExecutor } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOTimelock,
    abi: ABIS.DAOTimelock,
    functionName: 'hasRole',
    args: address
      ? [
          '0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63' as `0x${string}`, // EXECUTOR_ROLE
          address,
        ]
      : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Check if address has admin role
  const { data: isAdmin } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOTimelock,
    abi: ABIS.DAOTimelock,
    functionName: 'hasRole',
    args: address
      ? [
          '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`, // DEFAULT_ADMIN_ROLE
          address,
        ]
      : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    // Data
    minDelay: minDelay as bigint | undefined,
    isProposer: isProposer as boolean | undefined,
    isExecutor: isExecutor as boolean | undefined,
    isAdmin: isAdmin as boolean | undefined,

    // Formatted data
    minDelayFormatted: minDelay ? Number(minDelay) / 3600 : 0, // Convert to hours
  };
}
