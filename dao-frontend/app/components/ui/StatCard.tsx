import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, sub }) => (
  <div className="bg-white p-6 rounded-lg border border-black shadow-sm">
    <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.1em] mb-3">{title}</h3>
    <div className="text-[22px] font-bold text-black mb-1">{value}</div>
    <div className="text-[10px] text-black font-bold uppercase tracking-wider">{sub}</div>
  </div>
);
