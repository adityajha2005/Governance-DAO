import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  desc: string;
  status: string;
  amount: string;
  gradient: string;
  initial: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  name, 
  desc, 
  status, 
  amount, 
  gradient, 
  initial 
}) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
    <div className={`h-40 bg-gradient-to-br ${gradient} relative p-6`}>
      <span className="absolute top-4 right-4 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[9px] font-bold uppercase tracking-widest border border-white/50">
        {status}
      </span>
      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-800 text-lg border border-gray-100/50">
        {initial}
      </div>
    </div>
    <div className="p-6">
      <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-500 transition-colors">
        {name}
      </h4>
      <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
        {desc}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <div>
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest block mb-0.5">
            Grant Total
          </span>
          <span className="font-bold text-sm tracking-tight">{amount}</span>
        </div>
        <button className="text-cyan-500 text-[11px] font-bold uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center">
          Details <ArrowRight size={12} className="ml-1" />
        </button>
      </div>
    </div>
  </div>
);
