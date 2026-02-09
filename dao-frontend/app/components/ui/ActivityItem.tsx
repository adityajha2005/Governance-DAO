import React from 'react';

interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
  seed: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ user, action, target, time, seed }) => (
  <div className="flex space-x-4 group">
    <img 
      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
      className="w-9 h-9 rounded-full bg-white border border-black" 
      alt="" 
    />
    <div className="flex-1 min-w-0 text-black">
      <p className="text-[13px] leading-[1.5]">
        <span className="font-bold hover:underline cursor-pointer">{user}</span> {action}{' '}
        <span className="font-bold cursor-pointer hover:text-cyan-500">{target}</span>
      </p>
      <span className="text-[11px] text-black font-bold uppercase tracking-wider">{time}</span>
    </div>
  </div>
);
