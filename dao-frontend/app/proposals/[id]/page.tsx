'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { usePublicClient, useAccount } from 'wagmi';
import { keccak256, toHex } from 'viem';
import { CONTRACT_ADDRESSES, DEPLOYMENT_BLOCK } from '@/lib/contracts/config';
import { ABIS } from '@/lib/contracts/abis';
import { useDAOGovernor, useProposalsList } from '@/lib/hooks';

interface ProposalDetails {
  proposalId: bigint;
  proposer: string;
  description: string;
  targets: string[];
  values: bigint[];
  calldatas: string[];
  voteStart: bigint;
  voteEnd: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  state: number;
}

export default function ProposalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params?.id as string;
  
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { castVote, queueProposal, executeProposal, isPending, isConfirmed, hash } = useDAOGovernor();
  const { data: allProposals = [] } = useProposalsList();
  
  const [proposal, setProposal] = useState<ProposalDetails | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [actionType, setActionType] = useState<string>('');

  useEffect(() => {
    async function fetchProposalDetails() {
      if (!publicClient || !proposalId) return;

      try {
        setLoading(true);

        const state = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.DAOGovernor,
          abi: ABIS.DAOGovernor,
          functionName: 'state',
          args: [BigInt(proposalId)],
        }) as number;

        const [againstVotes, forVotes, abstainVotes] = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.DAOGovernor,
          abi: ABIS.DAOGovernor,
          functionName: 'proposalVotes',
          args: [BigInt(proposalId)],
        }) as [bigint, bigint, bigint];

        const cachedProposal = allProposals.find(p => p.proposalId.toString() === proposalId);

        if (cachedProposal) {
          setProposal({
            ...cachedProposal,
            forVotes,
            againstVotes,
            abstainVotes,
            state,
          });
        }

        if (address) {
          const voted = await publicClient.readContract({
            address: CONTRACT_ADDRESSES.DAOGovernor,
            abi: ABIS.DAOGovernor,
            functionName: 'hasVoted',
            args: [BigInt(proposalId), address],
          }) as boolean;
          setHasVoted(voted);
        }
      } catch (error) {
        console.error('Error fetching proposal:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposalDetails();
  }, [publicClient, proposalId, address]);

  useEffect(() => {
    if (isConfirmed && (voting || executing)) {
      setVoting(false);
      setExecuting(false);
      setTimeout(() => window.location.reload(), 2000);
    }
  }, [isConfirmed, voting, executing]);

  const handleVote = async (support: number, type: string) => {
    if (!proposal || hasVoted) return;
    try {
      setVoting(true);
      setActionType(`Vote ${type}`);
      await castVote(proposal.proposalId, support);
    } catch (error) {
      console.error('Error voting:', error);
      setVoting(false);
    }
  };

  const handleQueue = async () => {
    if (!proposal) return;
    try {
      setExecuting(true);
      setActionType('Queue');
      const descriptionHash = keccak256(toHex(proposal.description));
      await queueProposal(
        proposal.targets as any[],
        proposal.values,
        proposal.calldatas as any[],
        descriptionHash
      );
    } catch (error) {
      console.error('Error queueing:', error);
      setExecuting(false);
    }
  };

  const handleExecute = async () => {
    if (!proposal) return;
    try {
      setExecuting(true);
      setActionType('Execute');
      const descriptionHash = keccak256(toHex(proposal.description));
      await executeProposal(
        proposal.targets as any[],
        proposal.values,
        proposal.calldatas as any[],
        descriptionHash
      );
    } catch (error) {
      console.error('Error executing:', error);
      setExecuting(false);
    }
  };

  const getStateLabel = (state: number) => {
    const labels = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
    return labels[state] || 'Unknown';
  };

  const getStateColor = (state: number) => {
    const colors = {
      0: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      1: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      2: 'bg-black text-white border-black',
      3: 'bg-red-100 text-red-800 border-red-200',
      4: 'bg-green-100 text-green-800 border-green-200',
      5: 'bg-blue-100 text-blue-800 border-blue-200',
      6: 'bg-orange-100 text-orange-800 border-orange-200',
      7: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[state as keyof typeof colors] || 'bg-black text-white';
  };

  const formatVotes = (votes: bigint) => {
    return (Number(votes) / 1e18).toFixed(2);
  };

  const getTotalVotes = () => {
    if (!proposal) return BigInt(0);
    return proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
  };

  const getVotePercentage = (votes: bigint) => {
    const total = getTotalVotes();
    if (total === BigInt(0)) return 0;
    return (Number(votes) * 100 / Number(total)).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Proposal Not Found</h1>
          <button onClick={() => router.push('/proposals')} className="text-cyan-500 hover:underline">
            ← Back to Proposals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => router.push('/proposals')}
          className="flex items-center text-black hover:text-black mb-6 font-bold"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Proposals
        </button>

        <div className="bg-white rounded-xl border border-black shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Proposal #{proposalId}</h1>
              <p className="text-black">
                Proposed by <span className="font-mono">{proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStateColor(proposal.state)}`}>
              {getStateLabel(proposal.state)}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-black whitespace-pre-wrap">{proposal.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-black mb-1">Vote Start Block</p>
              <p className="text-lg font-bold">#{proposal.voteStart.toString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-black mb-1">Vote End Block</p>
              <p className="text-lg font-bold">#{proposal.voteEnd.toString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Vote Results</h2>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-green-700">For</span>
                <span className="text-black">{formatVotes(proposal.forVotes)} votes ({getVotePercentage(proposal.forVotes)}%)</span>
              </div>
              <div className="w-full bg-black rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all" 
                  style={{ width: `${getVotePercentage(proposal.forVotes)}%` }}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-red-700">Against</span>
                <span className="text-black">{formatVotes(proposal.againstVotes)} votes ({getVotePercentage(proposal.againstVotes)}%)</span>
              </div>
              <div className="w-full bg-black rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all" 
                  style={{ width: `${getVotePercentage(proposal.againstVotes)}%` }}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-black">Abstain</span>
                <span className="text-black">{formatVotes(proposal.abstainVotes)} votes ({getVotePercentage(proposal.abstainVotes)}%)</span>
              </div>
              <div className="w-full bg-black rounded-full h-3">
                <div 
                  className="bg-black h-3 rounded-full transition-all" 
                  style={{ width: `${getVotePercentage(proposal.abstainVotes)}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-black mt-4">
              Total votes: {formatVotes(getTotalVotes())}
            </p>
          </div>

          <div className="border-t pt-6">
            {proposal.state === 1 && !hasVoted && !voting && (
              <div className="flex gap-3">
                <button 
                  onClick={() => handleVote(1, 'For')}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                >
                  Vote For
                </button>
                <button 
                  onClick={() => handleVote(0, 'Against')}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                >
                  Vote Against
                </button>
                <button 
                  onClick={() => handleVote(2, 'Abstain')}
                  className="px-6 py-3 bg-black text-black rounded-lg font-bold hover:bg-black transition"
                >
                  Abstain
                </button>
              </div>
            )}

            {hasVoted && proposal.state === 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <CheckCircle className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="font-semibold text-blue-900">You have voted on this proposal</p>
              </div>
            )}

            {proposal.state === 4 && !executing && (
              <button 
                onClick={handleQueue}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
              >
                Queue Proposal
              </button>
            )}

            {proposal.state === 5 && !executing && (
              <button 
                onClick={handleExecute}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition"
              >
                Execute Proposal
              </button>
            )}

            {(voting || executing) && (
              <div className="text-center py-4">
                <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                <p className="text-black">
                  {isPending ? `Confirm ${actionType} in wallet...` : 
                   isConfirmed ? `✅ ${actionType} confirmed! Refreshing...` : 
                   `Processing ${actionType}...`}
                </p>
                {hash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-500 hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    View on Etherscan <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}

            {proposal.state === 7 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <CheckCircle className="mx-auto mb-2 text-purple-600" size={32} />
                <p className="text-lg font-bold text-purple-900">Proposal Executed</p>
                <p className="text-sm text-purple-600">This proposal has been successfully executed on-chain</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Proposal Actions</h2>
          <div className="space-y-3">
            {proposal.targets.map((target, i) => (
              <div key={i} className="bg-white rounded-lg p-4 font-mono text-sm">
                <p className="text-black mb-1">Target #{i + 1}</p>
                <p className="text-black mb-2">{target}</p>
                <p className="text-black mb-1">Value: {proposal.values[i].toString()} wei</p>
                <p className="text-black mb-1">Calldata:</p>
                <p className="text-black break-all text-xs">{proposal.calldatas[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
