'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatCard } from '../ui/StatCard';
import { ActivityItem } from '../ui/ActivityItem';
import { useDAOTreasury, useProposalsList } from '@/lib/hooks';
import { formatTokenAmount, ethToUSD, formatUSD } from '@/lib/utils';
import { usePublicClient } from 'wagmi';

export const DAOHome: React.FC = () => {
  const router = useRouter();
  const { data: proposals = [] } = useProposalsList();
  const { ethBalance } = useDAOTreasury();

  const proposalsCount = proposals.length;
  const activeProposals = proposalsCount;
  const treasuryUSD = ethBalance ? ethToUSD(ethBalance) : 0;

  return (
    <div className="animate-in fade-in duration-500 text-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Proposals" 
          value={`${activeProposals} total proposal${activeProposals !== 1 ? 's' : ''}`}
          sub="On-chain governance" 
        />
        <StatCard 
          title="Treasury" 
          value={formatUSD(treasuryUSD)}
          sub={`${ethBalance ? formatTokenAmount(ethBalance, 18, 4) : '0'} ETH`}
        />
        <StatCard 
          title="Network" 
          value="Sepolia Testnet" 
          sub="Ethereum L1" 
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 min-w-0">
        <section className="mb-10">
          <h2 className="text-[28px] font-bold tracking-tight mb-4">Open Proposals</h2>
          <p className="text-[15px] text-black leading-relaxed max-w-2xl">
            Proposals are created by the community and work as the consensus mechanism. Learn more about them{' '}
            <a href="#" className="text-cyan-500 hover:underline font-medium">here</a>.
          </p>
        </section>

        <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden mb-12">
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-black hover:text-white transition-all cursor-pointer group">
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center border border-black p-1">
                <img 
                  src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Ghost" 
                  alt="Ghost" 
                  className="w-full h-full rounded" 
                />
              </div>
              <div>
                <h4 className="font-bold text-[16px]">
                  Removal of SAB Member Kyllian Hprivakos...
                </h4>
                <div className="text-[11px] text-black group-hover:text-white font-semibold uppercase tracking-wider mt-0.5">
                  By Ghost • 4 votes • Ends in 3 days
                </div>
              </div>
            </div>
            <div className="flex items-center text-cyan-500 font-bold text-[13px] mt-4 sm:mt-0">
              VOTE <ChevronRight size={18} className="ml-1" strokeWidth={3} />
            </div>
          </div>
          <button 
            onClick={() => router.push('/proposals')}
            className="w-full py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-500 border-t border-black hover:bg-black hover:text-white transition-colors"
          >
            View All Proposals
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/proposals'}
            className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition"
          >
            See All Proposals & Vote
          </button>
        </div>
      </div>

      <aside className="w-full lg:w-[320px] shrink-0">
        <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-6">
          Latest Activity
        </h3>
        <div className="space-y-6">
          <ActivityItem 
            user="HouseBuck" 
            action="voted on" 
            target="Removal of SAB Member..." 
            time="2 days ago" 
            seed="1" 
          />
          <ActivityItem 
            user="Mods" 
            action="voted on" 
            target="Removal of SAB Member..." 
            time="2 days ago" 
            seed="2" 
          />
          <ActivityItem 
            user="DCLCars" 
            action="voted on" 
            target="Proposal #24" 
            time="3 days ago" 
            seed="3" 
          />
        </div>
      </aside>
    </div>
  </div>
  );
};
