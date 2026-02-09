'use client';
import React, { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/proposals', label: 'Proposals' },
    { href: '/treasury', label: 'Treasury' },
    { href: '/create-proposal', label: 'Create', icon: <Plus size={14} className="mr-1" /> },
    { href: '/test', label: 'Debug' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-black sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-12">
            <Link 
              href="/"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
                  <path d="M22 11L33 30H11L22 11Z" fill="white"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-black">Gov</span>
                <span className="text-[9px] text-cyan-600 font-semibold uppercase tracking-wider">DAO</span>
              </div>
            </Link>
            
            <nav className="hidden lg:flex space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center ${
                    pathname === link.href 
                      ? 'bg-cyan-50 text-cyan-600' 
                      : 'text-black hover:bg-cyan-50 hover:text-cyan-600'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
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
            
            <button 
              className="lg:hidden p-2 text-black hover:bg-cyan-50 rounded-lg transition-all border border-transparent active:border-cyan-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-black animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={closeMenu}
                className={`px-4 py-4 rounded-xl text-base font-bold transition-all flex items-center ${
                  pathname === link.href 
                    ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' 
                    : 'text-black hover:bg-cyan-50 border border-transparent'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <ConnectButton 
                chainStatus="icon"
                showBalance={true}
                accountStatus="full"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

