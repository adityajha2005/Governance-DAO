'use client';

import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES, DEPLOYMENT_BLOCK } from '../contracts/config';
import { ABIS } from '../contracts/abis';
import { getLogsInChunks } from '../utils/blockchain';

export interface ProposalEvent {
  proposalId: bigint;
  proposer: string;
  description: string;
  targets: string[];
  values: bigint[];
  calldatas: string[];
  voteStart: bigint;
  voteEnd: bigint;
  blockNumber: bigint;
}

export function useProposalsList() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['proposals-list', CONTRACT_ADDRESSES.DAOGovernor],
    queryFn: async () => {
      if (!publicClient) throw new Error('Public client not available');

      const proposalCreatedEvent = ABIS.DAOGovernor.find(
        (item: any) => item.type === 'event' && item.name === 'ProposalCreated'
      );

      if (!proposalCreatedEvent) throw new Error('ProposalCreated event not found');

      const currentBlock = await publicClient.getBlockNumber();
      
      const lookbackBlocks = BigInt(100000);
      const fromBlock = currentBlock > lookbackBlocks 
        ? currentBlock - lookbackBlocks 
        : DEPLOYMENT_BLOCK;
      
      const logs = await getLogsInChunks(publicClient as any, {
        address: CONTRACT_ADDRESSES.DAOGovernor,
        event: proposalCreatedEvent as any,
        fromBlock: fromBlock,
        toBlock: currentBlock,
      });

      const parsedProposals: ProposalEvent[] = logs.map((log: any) => ({
        proposalId: log.args.proposalId,
        proposer: log.args.proposer,
        description: log.args.description || 'No description',
        targets: log.args.targets,
        values: log.args.values,
        calldatas: log.args.calldatas,
        voteStart: log.args.voteStart,
        voteEnd: log.args.voteEnd,
        blockNumber: log.blockNumber,
      }));

      return parsedProposals.reverse();
    },
    enabled: !!publicClient,
    staleTime: 1000 * 60 * 60 * 3,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
