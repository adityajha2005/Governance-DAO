'use client';
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => (
  <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex justify-between items-center h-20">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-12">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={onHomeClick}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
                <path d="M22 11L33 30H11L22 11Z" fill="white"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-gray-900">Decentraland</span>
              <span className="text-[9px] text-cyan-600 font-semibold uppercase tracking-wider">DAO</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex space-x-1">
            <a href="#" className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-all">Governance</a>
            <a href="#" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">Docs</a>
          </nav>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:flex p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
          </button>
          
          <button className="hidden md:flex p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
            <User size={20} />
          </button>
          
          <div className="hidden md:block">
            <ConnectButton 
              chainStatus="icon"
              showBalance={false}
            />
          </div>
          
          <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  </header>
);
