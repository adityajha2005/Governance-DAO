'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useDAOGovernor, useGovernanceToken } from '@/lib/hooks';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';
import { parseEther, encodeFunctionData } from 'viem';
import { ABIS } from '@/lib/contracts/abis';

export const CreateProposalForm: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { createProposal, isPending, isConfirmed, hash, proposalThreshold } = useDAOGovernor();
  const { balance, votingPower } = useGovernanceToken();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [value, setValue] = useState('0');
  const [error, setError] = useState('');

  const hasEnoughTokens = votingPower && proposalThreshold && votingPower >= proposalThreshold;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (!hasEnoughTokens) {
      setError(`You need at least ${proposalThreshold?.toString()} tokens to create a proposal`);
      return;
    }

    if (!title || !description) {
      setError('Please provide a title and description');
      return;
    }

    try {
      // Simple example: transfer ETH from treasury
      const targets = [targetAddress || CONTRACT_ADDRESSES.DAOTreasury] as `0x${string}`[];
      const values = [parseEther(value)];
      const calldatas = ['0x'] as `0x${string}`[];
      const fullDescription = `# ${title}\n\n${description}`;

      await createProposal(targets, values, calldatas, fullDescription);
    } catch (err: any) {
      setError(err.message || 'Failed to create proposal');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <p className="text-black">Connect your wallet to create proposals</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Proposal</h2>

      {!hasEnoughTokens && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ You need at least {proposalThreshold?.toString()} voting power to create a proposal.
            Your current voting power: {votingPower?.toString()}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Proposal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g., Allocate funds for community event"
            disabled={!hasEnoughTokens}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Detailed description of your proposal..."
            disabled={!hasEnoughTokens}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Target Address (Optional)</label>
            <input
              type="text"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
              placeholder="0x..."
              disabled={!hasEnoughTokens}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">ETH Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="0.0"
              disabled={!hasEnoughTokens}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {isConfirmed && hash && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            ✓ Proposal created successfully! Transaction: {hash.slice(0, 10)}...
          </div>
        )}

        <button
          type="submit"
          disabled={!hasEnoughTokens || isPending}
          className="w-full px-6 py-4 bg-cyan-500 text-white rounded-lg font-bold text-sm hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating Proposal...' : 'Create Proposal'}
        </button>
      </form>
    </div>
  );
};
