import React from 'react';
import { Plus } from 'lucide-react';
import { ProposalRow } from '../ui/ProposalRow';

export const ProposalsView: React.FC = () => (
  <div className="animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
      <div>
        <h2 className="text-[32px] font-bold tracking-tight mb-2">Proposals</h2>
        <p className="text-[15px] text-[#676370]">
          Explore and vote on community-driven initiatives.
        </p>
      </div>
      <div className="flex space-x-3">
        <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] font-bold uppercase tracking-wider hover:bg-gray-50">
          Filters
        </button>
        <button className="px-5 py-2.5 bg-cyan-500 text-white rounded-lg text-[13px] font-bold uppercase tracking-wider shadow-md hover:bg-cyan-600 transition flex items-center">
          <Plus size={16} className="mr-2" /> Submit Proposal
        </button>
      </div>
    </div>
    
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        <ProposalRow 
          id="12" 
          title="Implement Multi-Sig for Community Grants Treasury" 
          meta="Governance • By 0xDA...21 • Active" 
          progress={85} 
          status="Passing" 
          color="text-cyan-500" 
          barColor="bg-cyan-500" 
        />
        <ProposalRow 
          id="11" 
          title="Grant: Metaverse Fashion Week 2026 Production" 
          meta="Grant • By FashionDAO • Active" 
          progress={40} 
          status="Voting" 
          color="text-gray-500" 
          barColor="bg-gray-400" 
        />
        <ProposalRow 
          id="10" 
          title="Add Core Unit: Decentralized Content Curation" 
          meta="Core Unit • By CuratorDAO • Active" 
          progress={92} 
          status="Passing" 
          color="text-cyan-500" 
          barColor="bg-cyan-500" 
        />
      </div>
    </div>
  </div>
);
