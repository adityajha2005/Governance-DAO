import React from 'react';

interface AllocationBarProps {
  label: string;
  percent: number;
  color: string;
}

export const AllocationBar: React.FC<AllocationBarProps> = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[13px] mb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="font-bold text-gray-900">{percent}%</span>
    </div>
    <div className="w-full h-2 bg-gray-50 rounded-full border border-gray-100">
      <div 
        className={`${color} h-full rounded-full transition-all duration-1000`} 
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);
