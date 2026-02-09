import React from 'react';

interface ProposalRowProps {
  id: string;
  title: string;
  meta: string;
  progress: number;
  status: string;
  color: string;
  barColor: string;
}

export const ProposalRow: React.FC<ProposalRowProps> = ({ 
  id, 
  title, 
  meta, 
  progress, 
  status, 
  color, 
  barColor 
}) => (
  <div className="p-6 flex items-center justify-between hover:bg-white transition-colors cursor-pointer group">
    <div className="flex items-center space-x-6">
      <div className="w-10 h-10 rounded bg-white flex items-center justify-center font-bold text-black text-xs border border-black">
        #{id}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-[17px] group-hover:text-cyan-500 transition-colors truncate">
          {title}
        </h4>
        <div className="text-[12px] text-black font-medium mt-1 uppercase tracking-tight">
          {meta}
        </div>
      </div>
    </div>
    <div className="text-right flex-shrink-0">
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${color}`}>
        {status}
      </div>
      <div className="w-24 h-1.5 bg-black text-white rounded-full overflow-hidden border border-white">
        <div 
          className={`${barColor} h-full transition-all duration-1000`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);
