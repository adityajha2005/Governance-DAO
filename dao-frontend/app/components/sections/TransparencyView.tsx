import React from 'react';
import { PieChart, BarChart3, Wallet } from 'lucide-react';
import { AllocationBar } from '../ui/AllocationBar';
import { ChartBar } from '../ui/ChartBar';

export const TransparencyView: React.FC = () => (
  <div className="animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-[32px] font-bold tracking-tight mb-10 text-[#16141a]">
      DAO Treasury
    </h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-6 flex items-center">
          <PieChart size={20} className="mr-2 text-cyan-500" /> Asset Allocation
        </h3>
        <div className="space-y-6">
          <AllocationBar label="ETH" percent={65} color="bg-cyan-500" />
          <AllocationBar label="USDC" percent={20} color="bg-gray-400" />
          <AllocationBar label="Other Assets" percent={15} color="bg-black" />
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500 mb-6 border border-cyan-100">
          <Wallet size={32} />
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-500 uppercase tracking-widest text-[11px]">
          Total Treasury Value
        </h3>
        <div className="text-[44px] font-bold text-gray-900 tracking-tight leading-none">
          $7,189,283
        </div>
        <p className="text-sm text-gray-400 mt-4 max-w-[240px]">
          Managed by DAO governance via timelock contract
        </p>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-lg flex items-center">
          <BarChart3 size={20} className="mr-2 text-cyan-500" /> Treasury Activity
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          USD (Estimated)
        </span>
      </div>
      <div className="h-64 flex items-end justify-between space-x-3 px-2">
        <ChartBar height="40%" label="Nov" val="$240k" />
        <ChartBar height="60%" label="Dec" val="$310k" />
        <ChartBar height="55%" label="Jan" val="$280k" />
        <ChartBar height="85%" label="Feb" val="$420k" active />
        <ChartBar height="20%" label="Mar" val="-" />
        <ChartBar height="15%" label="Apr" val="-" />
      </div>
    </div>
  </div>
);
