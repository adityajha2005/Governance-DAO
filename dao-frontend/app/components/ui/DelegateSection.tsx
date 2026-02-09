'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGovernanceToken } from '@/lib/hooks';
import { formatTokenAmount } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';

export const DelegateSection: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { balance, votingPower, isDelegated, selfDelegate, isPending, isConfirmed } = useGovernanceToken();
  const [error, setError] = useState<string>('');

  const handleDelegate = async () => {
    try {
      setError('');
      await selfDelegate();
    } catch (err: any) {
      setError(err.message || 'Failed to delegate');
    }
  };

  if (!isConnected) {
    return null;
  }

  // If already delegated or no balance, don't show
  if (isDelegated || !balance || balance === BigInt(0)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
      <h3 className="font-bold text-lg mb-2">Enable Voting</h3>
      <p className="text-sm text-black mb-4">
        You have {formatTokenAmount(balance, 18, 2)} tokens but no voting power. 
        Delegate to yourself to participate in governance.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {isConfirmed && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center">
          <CheckCircle size={16} className="mr-2" />
          Successfully delegated! Your voting power is now active.
        </div>
      )}

      <button
        onClick={handleDelegate}
        disabled={isPending}
        className="w-full px-4 py-3 bg-cyan-500 text-white rounded-lg font-bold text-sm hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" size={16} />
            Delegating...
          </>
        ) : (
          'Delegate to Self'
        )}
      </button>
    </div>
  );
};
