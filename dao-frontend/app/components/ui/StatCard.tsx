import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, sub }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">{title}</h3>
    <div className="text-[22px] font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{sub}</div>
  </div>
);
