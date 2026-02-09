'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { usePublicClient, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, DEPLOYMENT_BLOCK } from '@/lib/contracts/config';
import { ABIS } from '@/lib/contracts/abis';
import { useDAOGovernor, useProposalsList } from '@/lib/hooks';
import { ProposalEvent } from '@/lib/hooks/useProposalsList';

export default function ProposalsListPage() {
  const router = useRouter();
  const { data: proposals = [], isLoading, error } = useProposalsList();

  const getProposalStateLabel = (state: number) => {
    const labels = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
    return labels[state] || 'Unknown';
  };

  const getProposalStateColor = (state: number) => {
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

  const getProposalStateIcon = (state: number) => {
    switch (state) {
      case 0: return <Clock size={16} />;
      case 1: return <Loader2 size={16} className="animate-spin" />;
      case 2: return <XCircle size={16} />;
      case 3: return <XCircle size={16} />;
      case 4: return <CheckCircle size={16} />;
      case 5: return <Clock size={16} />;
      case 6: return <XCircle size={16} />;
      case 7: return <CheckCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-black hover:text-black mb-4 font-bold"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-black">All Proposals</h1>
              <p className="text-black font-medium">
                {isLoading ? 'Loading proposals...' : `${proposals.length} total proposals`}
              </p>
            </div>
            <button
              onClick={() => router.push('/create-proposal')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Create Proposal
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
              <Loader2 className="animate-spin mx-auto mb-4" size={48} />
              <p className="text-black">Loading proposals from blockchain...</p>
            </div>
          ) : proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard key={proposal.proposalId.toString()} proposal={proposal} />
            ))
          ) : (
            <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2">No Proposals Yet</h3>
              <p className="text-black mb-6">
                Be the first to create a proposal for the DAO!
              </p>
              <button
                onClick={() => router.push('/create-proposal')}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition inline-flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Create First Proposal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: ProposalEvent }) {
  const router = useRouter();
  const [state, setState] = useState<number>(1);
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { castVote, isPending, isConfirmed, hash } = useDAOGovernor();
  const [voting, setVoting] = useState(false);
  const [voteType, setVoteType] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<{ support: number; weight: bigint } | null>(null);
  const [voteStats, setVoteStats] = useState<{ for: bigint; against: bigint; abstain: bigint }>({
    for: BigInt(0),
    against: BigInt(0),
    abstain: BigInt(0),
  });

  useEffect(() => {
    async function fetchProposalState() {
      if (!publicClient) return;

      try {
        const stateResult = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.DAOGovernor,
          abi: ABIS.DAOGovernor,
          functionName: 'state',
          args: [proposal.proposalId],
        }) as number;

        setState(stateResult);
      } catch (error) {
        console.error('Error fetching proposal state:', error);
      }
    }

    fetchProposalState();
  }, [publicClient, proposal.proposalId]);

  useEffect(() => {
    async function fetchVoteStats() {
      if (!publicClient) return;

      try {
        const [againstVotes, forVotes, abstainVotes] = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.DAOGovernor,
          abi: ABIS.DAOGovernor,
          functionName: 'proposalVotes',
          args: [proposal.proposalId],
        }) as [bigint, bigint, bigint];

        setVoteStats({
          for: forVotes,
          against: againstVotes,
          abstain: abstainVotes,
        });
      } catch (error) {
        console.error('Error fetching vote stats:', error);
      }
    }

    fetchVoteStats();
  }, [publicClient, proposal.proposalId]);

  useEffect(() => {
    async function checkIfVoted() {
      if (!publicClient || !address) return;

      try {
        const receipt = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.DAOGovernor,
          abi: ABIS.DAOGovernor,
          functionName: 'hasVoted',
          args: [proposal.proposalId, address],
        }) as boolean;

        setHasVoted(receipt);

        if (receipt) {
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      }
    }

    checkIfVoted();
  }, [publicClient, address, proposal.proposalId]);

  useEffect(() => {
    if (isConfirmed && voting) {
      setVoting(false);
      setVoteType('');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isConfirmed, voting]);

  const handleVote = async (support: number, type: string) => {
    if (hasVoted) {
      alert('You have already voted on this proposal!');
      return;
    }

    try {
      setVoting(true);
      setVoteType(type);
      await castVote(proposal.proposalId, support);
    } catch (error: any) {
      console.error('Error voting:', error);
      if (error?.message?.includes('already cast')) {
        alert('You have already voted on this proposal!');
        setHasVoted(true);
      }
      setVoting(false);
      setVoteType('');
    }
  };

  const getProposalStateLabel = (state: number) => {
    const labels = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
    return labels[state] || 'Unknown';
  };

  const getProposalStateColor = (state: number) => {
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

  const getProposalStateIcon = (state: number) => {
    switch (state) {
      case 0: return <Clock size={16} />;
      case 1: return <Loader2 size={16} className="animate-spin" />;
      case 2: return <XCircle size={16} />;
      case 3: return <XCircle size={16} />;
      case 4: return <CheckCircle size={16} />;
      case 5: return <Clock size={16} />;
      case 6: return <XCircle size={16} />;
      case 7: return <CheckCircle size={16} />;
      default: return null;
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const formatProposalId = (id: bigint) => {
    const idStr = id.toString();
    if (idStr.length <= 10) return idStr;
    return `${idStr.slice(0, 6)}...${idStr.slice(-4)}`;
  };

  const shortenDescription = (desc: string, maxLength: number = 150) => {
    if (desc.length <= maxLength) return desc;
    return desc.slice(0, maxLength) + '...';
  };

  const formatVotes = (votes: bigint) => {
    return (Number(votes) / 1e18).toFixed(1);
  };

  const getTotalVotes = () => {
    return voteStats.for + voteStats.against + voteStats.abstain;
  };

  return (
    <div 
      className="bg-white rounded-xl border border-black shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/proposals/${proposal.proposalId.toString()}`)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-black">Proposal #{formatProposalId(proposal.proposalId)}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getProposalStateColor(state)}`}>
                {getProposalStateIcon(state)}
                {getProposalStateLabel(state)}
              </span>
            </div>
            <p className="text-black text-sm mb-3 font-medium">{shortenDescription(proposal.description)}</p>
            <div className="flex items-center gap-4 text-xs text-black font-bold">
              <span>By <span className="font-mono">{proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span></span>
              <span>•</span>
              <span>Block #{proposal.blockNumber.toString()}</span>
            </div>
          </div>
        </div>

        {getTotalVotes() > BigInt(0) && (
          <div className="mb-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-green-100 rounded-lg p-2 border border-green-200">
              <p className="text-green-900 font-bold">{formatVotes(voteStats.for)}</p>
              <p className="text-green-800 text-xs font-bold">For</p>
            </div>
            <div className="bg-red-100 rounded-lg p-2 border border-red-200">
              <p className="text-red-900 font-bold">{formatVotes(voteStats.against)}</p>
              <p className="text-red-800 text-xs font-bold">Against</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-2 border border-neutral-200">
              <p className="text-black font-bold">{formatVotes(voteStats.abstain)}</p>
              <p className="text-neutral-900 text-xs font-bold">Abstain</p>
            </div>
          </div>
        )}

        {state === 1 && (
          <div className="border-t border-black pt-4 mt-4" onClick={(e) => e.stopPropagation()}>
            {hasVoted ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <CheckCircle className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-sm font-semibold text-blue-900">You have already voted on this proposal</p>
                <p className="text-xs text-blue-600 mt-1">Each address can only vote once per proposal</p>
              </div>
            ) : voting ? (
              <div className="text-center py-4">
                <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                <p className="text-sm text-black">
                  {isPending ? `Confirm ${voteType} vote in wallet...` : 
                   isConfirmed ? `✅ Vote confirmed! Refreshing...` : 
                   `Processing ${voteType} vote...`}
                </p>
                {hash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-500 hover:underline mt-2 inline-block"
                  >
                    View transaction
                  </a>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => handleVote(1, 'For')}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={voting || hasVoted}
                >
                  Vote For
                </button>
                <button 
                  onClick={() => handleVote(0, 'Against')}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={voting || hasVoted}
                >
                  Vote Against
                </button>
                <button 
                  onClick={() => handleVote(2, 'Abstain')}
                  className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={voting || hasVoted}
                >
                  Abstain
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
