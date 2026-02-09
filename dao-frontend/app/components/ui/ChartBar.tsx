import React from 'react';

interface ChartBarProps {
  height: string;
  label: string;
  val: string;
  active?: boolean;
}

export const ChartBar: React.FC<ChartBarProps> = ({ height, label, val, active }) => (
  <div className="flex-1 flex flex-col items-center group relative">
    <div 
      className={`w-full rounded-t-sm transition-all duration-700 cursor-help ${
        active ? 'bg-cyan-500' : 'bg-black text-white hover:bg-cyan-500/30'
      }`} 
      style={{ height }}
    >
      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1.5 rounded font-bold whitespace-nowrap z-10 pointer-events-none">
        {label}: {val}
      </div>
    </div>
    <span className="mt-3 text-[10px] font-bold text-black uppercase tracking-widest">
      {label}
    </span>
  </div>
);
