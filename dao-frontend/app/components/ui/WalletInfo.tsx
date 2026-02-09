'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useGovernanceToken } from '@/lib/hooks';
import { formatTokenAmount, shortenAddress } from '@/lib/utils';

export const WalletInfo: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { balance, votingPower, isDelegated } = useGovernanceToken();

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Connect Wallet</h3>
          <Wallet className="text-cyan-500" size={24} />
        </div>
        <p className="text-sm text-black mb-4">
          Connect your wallet to participate in governance
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Your Wallet</h3>
        <Wallet className="text-cyan-500" size={24} />
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-black mb-1">Address</p>
          <p className="font-mono text-sm">{address && shortenAddress(address, 6)}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-black mb-1">Token Balance</p>
            <p className="font-bold text-lg">{formatTokenAmount(balance, 18, 2)}</p>
          </div>
          
          <div>
            <p className="text-xs text-black mb-1">Voting Power</p>
            <p className="font-bold text-lg">{formatTokenAmount(votingPower, 18, 2)}</p>
          </div>
        </div>

        {!isDelegated && votingPower === BigInt(0) && balance && balance > BigInt(0) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ Delegate your tokens to yourself to enable voting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
