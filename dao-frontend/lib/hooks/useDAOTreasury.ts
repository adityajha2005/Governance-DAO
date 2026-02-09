'use client';

import { useAccount, useReadContract, useBalance } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/config';
import { ABIS } from '../contracts/abis';
import { formatEther } from 'viem';

export function useDAOTreasury() {
  const { address } = useAccount();

  // Get ETH balance
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: CONTRACT_ADDRESSES.DAOTreasury,
  });

  // Read treasury allocations (if you have this function)
  const { data: totalAllocated } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOTreasury,
    abi: ABIS.DAOTreasury,
    functionName: 'totalAllocated',
  });

  // Check if address is authorized spender
  const { data: isAuthorized } = useReadContract({
    address: CONTRACT_ADDRESSES.DAOTreasury,
    abi: ABIS.DAOTreasury,
    functionName: 'authorizedSpenders',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const refetch = () => {
    refetchEthBalance();
  };

  return {
    // Data
    ethBalance: ethBalance?.value,
    ethBalanceFormatted: ethBalance ? formatEther(ethBalance.value) : '0',
    totalAllocated: totalAllocated as bigint | undefined,
    isAuthorized: isAuthorized as boolean | undefined,

    // Actions
    refetch,
  };
}
