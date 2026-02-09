'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useDAOGovernor, useGovernanceToken } from '@/lib/hooks';
import { CONTRACT_ADDRESSES, getExplorerUrl } from '@/lib/contracts/config';
import { parseEther } from 'viem';
import { ArrowLeft, CheckCircle, Loader2, Info } from 'lucide-react';
import { formatTokenAmount } from '@/lib/utils';

export default function CreateProposalPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createProposal, isPending, isConfirmed, hash, proposalThreshold } = useDAOGovernor();
  const { votingPower, selfDelegate, isDelegated } = useGovernanceToken();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposalType, setProposalType] = useState<'transfer' | 'custom'>('transfer');
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  const [targetAddress, setTargetAddress] = useState('');
  const [calldata, setCalldata] = useState('0x');
  const [value, setValue] = useState('0');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const hasEnoughVotingPower = votingPower && proposalThreshold && votingPower >= proposalThreshold;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!hasEnoughVotingPower) {
      setError(`You need at least ${formatTokenAmount(proposalThreshold)} voting power to create a proposal`);
      return;
    }

    if (!title || !description) {
      setError('Please provide a title and description');
      return;
    }

    try {
      let targets: `0x${string}`[];
      let values: bigint[];
      let calldatas: `0x${string}`[];

      if (proposalType === 'transfer') {
        if (!recipient || !amount) {
          setError('Please provide recipient address and amount');
          return;
        }
        
        // Validate recipient address
        const cleanRecipient = recipient.trim();
        if (!cleanRecipient.startsWith('0x')) {
          setError('Recipient address must start with 0x');
          return;
        }
        if (cleanRecipient.length !== 42) {
          setError(`Recipient address must be 42 characters (current: ${cleanRecipient.length}). Format: 0x followed by 40 hex characters`);
          return;
        }
        
        targets = [cleanRecipient as `0x${string}`];
        values = [parseEther(amount)];
        calldatas = ['0x'];
      } else {
        if (!targetAddress) {
          setError('Please provide target address');
          return;
        }
        
        const cleanTarget = targetAddress.trim();
        if (!cleanTarget.startsWith('0x')) {
          setError('Target address must start with 0x');
          return;
        }
        if (cleanTarget.length !== 42) {
          setError(`Target address must be 42 characters (current: ${cleanTarget.length}). Format: 0x followed by 40 hex characters`);
          return;
        }
        
        targets = [cleanTarget as `0x${string}`];
        values = [parseEther(value)];
        calldatas = [calldata as `0x${string}`];
      }

      const fullDescription = `# ${title}\n\n${description}\n\n---\nProposed by: ${address}`;

      await createProposal(targets, values, calldatas, fullDescription);
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      if (err.message.includes('User rejected')) {
        setError('Transaction was rejected in wallet');
      } else if (err.message.includes('insufficient')) {
        setError('Insufficient gas or tokens');
      } else {
        setError(err.shortMessage || err.message || 'Failed to create proposal');
      }
    }
  };

  React.useEffect(() => {
    if (isConfirmed && hash) {
      setSuccess(true);
      
      const timer = setTimeout(() => {
        router.push('/proposals');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, hash, router]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-black mb-6">
              You need to connect your wallet to create a proposal
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-black hover:text-black mb-4 font-bold"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2 text-black">Create Proposal</h1>
          <p className="text-black font-medium">
            Submit a new proposal for the DAO to vote on
          </p>
        </div>

        {/* Voting Power Check */}
        {!hasEnoughVotingPower && (
          <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start">
              <Info className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2">Insufficient Voting Power</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  You need at least <strong>{formatTokenAmount(proposalThreshold)}</strong> voting power to create proposals.
                  Your current voting power: <strong>{formatTokenAmount(votingPower)}</strong>
                </p>
                {!isDelegated && (
                  <button
                    onClick={selfDelegate}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold text-sm hover:bg-yellow-700"
                  >
                    Delegate to Enable Voting Power
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                Proposal Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., Fund Community Event in District 42"
                disabled={!hasEnoughVotingPower || isPending}
                maxLength={120}
              />
              <p className="text-xs text-black mt-1">{title.length}/120 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-2 text-black">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
                placeholder="Detailed description of your proposal...&#10;&#10;What problem does it solve?&#10;What are the benefits?&#10;What is the expected outcome?"
                disabled={!hasEnoughVotingPower || isPending}
              />
              <p className="text-xs text-black mt-1">Supports Markdown formatting</p>
            </div>

            {/* Proposal Type */}
            <div>
              <label className="block text-sm font-bold mb-3 text-black">
                Proposal Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setProposalType('transfer')}
                  disabled={!hasEnoughVotingPower || isPending}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    proposalType === 'transfer'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-black hover:border-black'
                  } ${!hasEnoughVotingPower ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-bold mb-1">Treasury Transfer</div>
                  <div className="text-xs text-black">Send ETH from treasury</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setProposalType('custom')}
                  disabled={!hasEnoughVotingPower || isPending}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    proposalType === 'custom'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-black hover:border-black'
                  } ${!hasEnoughVotingPower ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-bold mb-1">Custom Action</div>
                  <div className="text-xs text-black">Advanced: custom calldata</div>
                </button>
              </div>
            </div>

            {/* Transfer Type Fields */}
            {proposalType === 'transfer' && (
              <>
                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    Recipient Address *
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    disabled={!hasEnoughVotingPower || isPending}
                  />
                  <p className="text-xs text-black mt-1">
                    Ethereum address (42 characters starting with 0x). You can use your own wallet address for testing.
                  </p>
                  {address && (
                    <button
                      type="button"
                      onClick={() => setRecipient(address)}
                      className="text-xs text-cyan-600 hover:underline mt-1"
                      disabled={!hasEnoughVotingPower || isPending}
                    >
                      Use my address: {address.slice(0, 10)}...{address.slice(-8)}
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    Amount (ETH) *
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0.1"
                    disabled={!hasEnoughVotingPower || isPending}
                  />
                  <p className="text-xs text-black mt-1">Amount in ETH to send from treasury</p>
                </div>
              </>
            )}

            {/* Custom Type Fields */}
            {proposalType === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    Target Contract Address *
                  </label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    disabled={!hasEnoughVotingPower || isPending}
                  />
                  <p className="text-xs text-black mt-1">
                    Contract address to interact with (42 characters starting with 0x)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    Calldata
                  </label>
                  <input
                    type="text"
                    value={calldata}
                    onChange={(e) => setCalldata(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                    placeholder="0x"
                    disabled={!hasEnoughVotingPower || isPending}
                  />
                  <p className="text-xs text-black mt-1">
                    Encoded function call (leave as 0x for simple transfer)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-black">
                    Value (ETH)
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0"
                    disabled={!hasEnoughVotingPower || isPending}
                  />
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Transaction Pending Message */}
            {isPending && !isConfirmed && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center text-blue-600 mb-2">
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  <span className="font-bold">Waiting for confirmation...</span>
                </div>
                <p className="text-sm text-blue-700">
                  Please confirm the transaction in your wallet and wait for it to be mined.
                </p>
                {hash && (
                  <a
                    href={getExplorerUrl(hash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-600 hover:underline mt-2 block"
                  >
                    View transaction on Etherscan →
                  </a>
                )}
              </div>
            )}

            {/* Success Message */}
            {isConfirmed && hash && success && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center text-green-600 mb-2">
                  <CheckCircle size={18} className="mr-2" />
                  <span className="font-bold">Proposal Created Successfully!</span>
                </div>
                <p className="text-sm text-green-700 mb-2">
                  Your proposal has been submitted to the DAO and is now on-chain!
                </p>
                <p className="text-sm text-green-700 mb-2">
                  🔄 Redirecting to proposals page in 3 seconds...
                </p>
                <div className="flex gap-3">
                  <a
                    href={getExplorerUrl(hash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-600 hover:underline font-semibold"
                  >
                    View transaction on Etherscan →
                  </a>
                  <button
                    onClick={() => router.push('/proposals')}
                    className="text-sm text-cyan-600 hover:underline font-semibold"
                  >
                    View proposals now →
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!hasEnoughVotingPower || isPending || (isConfirmed && success)}
              className="w-full px-6 py-4 bg-cyan-500 text-white rounded-lg font-bold text-lg hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPending && !isConfirmed ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {hash ? 'Confirming Transaction...' : 'Confirm in Wallet...'}
                </>
              ) : isConfirmed && success ? (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Proposal Created!
                </>
              ) : (
                'Submit Proposal'
              )}
            </button>

            <p className="text-xs text-black text-center">
              {isPending 
                ? '⏳ Waiting for blockchain confirmation...' 
                : 'By submitting, your proposal will enter a voting delay period before voting begins.'
              }
            </p>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-3">How Proposals Work</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Proposal is created and enters a <strong>voting delay</strong> period</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>After delay, voting period begins (token holders can vote)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>If quorum is reached and votes pass, proposal succeeds</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Successful proposals are queued in the timelock</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">5.</span>
              <span>After timelock delay, proposal can be executed</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
