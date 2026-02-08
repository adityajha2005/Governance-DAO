import React from 'react';
import { ProjectCard } from '../ui/ProjectCard';

export const ProjectsView: React.FC = () => (
  <div className="animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-[32px] font-bold tracking-tight mb-8">Funded Projects</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectCard 
        name="Decentraland University" 
        desc="Creating a comprehensive onboarding curriculum for new creators and developers." 
        status="In Progress" 
        amount="$45,000" 
        gradient="from-cyan-50 to-white"
        initial="D"
      />
      <ProjectCard 
        name="Mobile SDK Bridge" 
        desc="Unity-based mobile implementation for interacting with Decentraland scenes." 
        status="Completed" 
        amount="$120,000" 
        gradient="from-gray-100 to-white"
        initial="M"
      />
      <ProjectCard 
        name="Scene Inspector 2.0" 
        desc="A suite of visual debugging tools for real-time scene optimization." 
        status="In Progress" 
        amount="$28,000" 
        gradient="from-cyan-100 to-gray-50"
        initial="S"
      />
    </div>
  </div>
);
