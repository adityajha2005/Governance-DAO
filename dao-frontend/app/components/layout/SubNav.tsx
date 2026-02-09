'use client';

import React, { useState } from 'react';
import { Search, Home, FileText, Wallet, X } from 'lucide-react';

interface SubNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'proposals', label: 'Proposals', icon: FileText },
  { id: 'treasury', label: 'Treasury', icon: Wallet }
];

export const SubNav: React.FC<SubNavProps> = ({ activeTab, onTabChange }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  
  return (
    <div className="bg-white border-b border-black">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <nav className="flex space-x-2 h-full items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'text-cyan-600 bg-cyan-50' 
                      : 'text-black hover:text-black hover:bg-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-3">
            {searchOpen ? (
              <div className="flex items-center space-x-2 animate-in slide-in-from-right-5 duration-200">
                <input
                  type="text"
                  placeholder="Search proposals, projects..."
                  className="w-64 px-4 py-2 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  autoFocus
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-black hover:text-black hover:bg-white rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 text-black hover:text-black hover:bg-white rounded-lg transition-all"
              >
                <Search size={18} />
                <span className="text-sm font-medium hidden md:inline">Search</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
