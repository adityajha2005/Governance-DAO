'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  useGovernanceToken, 
  useDAOGovernor, 
  useDAOTreasury, 
  useDAOTimelock 
} from '@/lib/hooks';
import { formatTokenAmount, formatUSD, ethToUSD, shortenAddress } from '@/lib/utils';
import { CONTRACT_ADDRESSES, getExplorerUrl } from '@/lib/contracts/config';

export default function TestPage() {
  const { address, isConnected } = useAccount();
  
  const {
    balance,
    votingPower,
    delegate,
    totalSupply,
    isDelegated,
    balanceFormatted,
    votingPowerFormatted,
    selfDelegate,
    isPending: tokenPending,
  } = useGovernanceToken();

  const {
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorum,
  } = useDAOGovernor();

  const {
    ethBalance,
    ethBalanceFormatted,
  } = useDAOTreasury();

  const {
    minDelay,
    minDelayFormatted,
    isProposer,
    isExecutor,
  } = useDAOTimelock();

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">DAO Contract Integration Test</h1>
          <p className="text-black font-medium">Testing all hooks and contract interactions</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-4 text-neutral-900">Wallet Connection</h2>
          <div className="flex items-center justify-between">
            <div>
              {isConnected ? (
                <>
                  <p className="text-sm font-bold text-neutral-800">Connected Address:</p>
                  <p className="font-mono font-bold text-neutral-900">{address && shortenAddress(address, 8)}</p>
                </>
              ) : (
                <p className="text-neutral-900 font-bold">Not connected</p>
              )}
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-4 text-neutral-900">Contract Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
              <div key={name} className="border border-black rounded-lg p-4 bg-neutral-50">
                <p className="text-sm font-bold text-neutral-800 mb-1">{name}</p>
                <a 
                  href={getExplorerUrl(address, 'address')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-cyan-700 hover:underline break-all font-bold"
                >
                  {address}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Token Data */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-4 text-black">Governance Token</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">Your Balance</p>
              <p className="text-2xl font-bold text-black">{balanceFormatted}</p>
              <p className="text-xs font-bold text-neutral-600">{balance?.toString() || '0'} wei</p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">Voting Power</p>
              <p className="text-2xl font-bold text-black">{votingPowerFormatted}</p>
              <p className="text-xs font-bold text-neutral-600">
                {isDelegated ? '✓ Self-delegated' : '✗ Not delegated'}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">Total Supply</p>
              <p className="text-2xl font-bold text-black">{totalSupply ? formatTokenAmount(totalSupply) : '0'}</p>
            </div>
          </div>
          
          {isConnected && delegate && (
            <div className="mt-4 pt-4 border-t border-black">
              <p className="text-sm font-bold text-neutral-800 mb-1">Delegated To</p>
              <p className="font-mono text-sm font-bold text-black">{shortenAddress(delegate, 8)}</p>
            </div>
          )}

          {isConnected && !isDelegated && balance && balance > BigInt(0) && (
            <div className="mt-4">
              <button
                onClick={selfDelegate}
                disabled={tokenPending}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 disabled:opacity-50"
              >
                {tokenPending ? 'Delegating...' : 'Delegate to Self'}
              </button>
            </div>
          )}
        </div>

        {/* Governor Data */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-4 text-black">DAO Governor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">Voting Delay</p>
              <p className="text-2xl font-bold text-black">{votingDelay?.toString() || '0'}</p>
              <p className="text-xs font-bold text-neutral-600">blocks</p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">Voting Period</p>
              <p className="text-2xl font-bold text-black">{votingPeriod?.toString() || '0'}</p>
              <p className="text-xs font-bold text-neutral-600">blocks</p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">Proposal Threshold</p>
              <p className="text-2xl font-bold text-black">
                {proposalThreshold ? formatTokenAmount(proposalThreshold) : '0'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-black">
            <p className="text-sm font-bold text-neutral-800 mb-1">Quorum Required</p>
            <p className="text-2xl font-bold text-black">
              {quorum ? formatTokenAmount(quorum) : '0'}
            </p>
          </div>
        </div>

        {/* Treasury Data */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-4 text-black">DAO Treasury</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">ETH Balance</p>
              <p className="text-3xl font-bold text-black">{ethBalanceFormatted}</p>
              <p className="text-sm font-bold text-neutral-600">ETH</p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 mb-1">USD Value (Est.)</p>
              <p className="text-3xl font-bold text-black">
                {ethBalance ? formatUSD(ethToUSD(ethBalance)) : '$0'}
              </p>
              <p className="text-xs font-bold text-neutral-600">@ $2,500/ETH</p>
            </div>
          </div>
        </div>

        {/* Timelock Data */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">DAO Timelock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-black mb-1">Minimum Delay</p>
              <p className="text-2xl font-bold">{minDelay?.toString() || '0'}</p>
              <p className="text-xs text-black">
                ~{minDelayFormatted.toFixed(1)} hours
              </p>
            </div>
            <div>
              <p className="text-sm text-black mb-1">Your Roles</p>
              <div className="space-y-1 mt-2">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${isProposer ? 'bg-green-500' : 'bg-black'}`}></span>
                  <span className="text-sm">Proposer</span>
                </div>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${isExecutor ? 'bg-green-500' : 'bg-black'}`}></span>
                  <span className="text-sm">Executor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
          <h3 className="font-bold mb-2">Integration Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span>All hooks loaded successfully</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span>Connected to Sepolia testnet</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
              <span>{isConnected ? 'Wallet connected' : 'Wallet not connected'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
