'use client';
import React from 'react';
import { Menu, Bell, User, Plus } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export const Header: React.FC = () => (
  <header className="bg-white/95 backdrop-blur-md border-b border-black sticky top-0 z-50 shadow-sm">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex justify-between items-center h-20">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-12">
          <Link 
            href="/"
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
                <path d="M22 11L33 30H11L22 11Z" fill="white"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-black">Decentraland</span>
              <span className="text-[9px] text-cyan-600 font-semibold uppercase tracking-wider">DAO</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex space-x-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-black hover:bg-cyan-50 hover:text-cyan-600 transition-all">Home</Link>
            <Link href="/proposals" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-black hover:bg-cyan-50 hover:text-cyan-600 transition-all">Proposals</Link>
            <Link href="/treasury" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-black hover:bg-cyan-50 hover:text-cyan-600 transition-all">Treasury</Link>
            <Link href="/create-proposal" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-black hover:bg-cyan-50 hover:text-cyan-600 transition-all flex items-center">
              <Plus size={14} className="mr-1" />
              Create
            </Link>
            <Link href="/test" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-black hover:bg-cyan-50 hover:text-cyan-600 transition-all">Debug</Link>
          </nav>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <ConnectButton 
              chainStatus="icon"
              showBalance={false}
            />
          </div>
          
          <button className="lg:hidden p-2 text-black hover:bg-white rounded-lg transition-all">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  </header>
);
