'use client';

import React from 'react';
import { Github, MessageCircle, BookOpen, Twitter, Send } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="mt-20 border-t border-black bg-gradient-to-b from-white to-white py-16">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
                <path d="M22 11L33 30H11L22 11Z" fill="white"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-black">Gov</span>
              <span className="text-[9px] text-cyan-600 font-semibold uppercase tracking-wider">DAO</span>
            </div>
          </div>
          <p className="text-sm text-black max-w-md leading-relaxed mb-6">
            A decentralized autonomous organization empowering the Gov community to shape the future of the metaverse through transparent governance.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="p-2.5 bg-white border border-black rounded-lg text-black hover:text-cyan-500 hover:border-cyan-200 hover:bg-cyan-50 transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2.5 bg-white border border-black rounded-lg text-black hover:text-cyan-500 hover:border-cyan-200 hover:bg-cyan-50 transition-all">
              <Github size={18} />
            </a>
            <a href="#" className="p-2.5 bg-white border border-black rounded-lg text-black hover:text-cyan-500 hover:border-cyan-200 hover:bg-cyan-50 transition-all">
              <MessageCircle size={18} />
            </a>
            <a href="#" className="p-2.5 bg-white border border-black rounded-lg text-black hover:text-cyan-500 hover:border-cyan-200 hover:bg-cyan-50 transition-all">
              <Send size={18} />
            </a>
          </div>
        </div>
        
        {/* Resources */}
        <div>
          <h3 className="font-bold text-sm text-black mb-4 uppercase tracking-wider">Resources</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-black hover:text-cyan-500 transition-colors flex items-center space-x-2"><BookOpen size={14} /><span>Documentation</span></a></li>
            <li><a href="#" className="text-sm text-black hover:text-cyan-500 transition-colors">Smart Contracts</a></li>
            <li><a href="#" className="text-sm text-black hover:text-cyan-500 transition-colors">Governance Guide</a></li>
          </ul>
        </div>
        
        {/* Community */}
        <div>
          <h3 className="font-bold text-sm text-black mb-4 uppercase tracking-wider">Community</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-black hover:text-cyan-500 transition-colors">Discord</a></li>
            <li><a href="#" className="text-sm text-black hover:text-cyan-500 transition-colors">Forum</a></li>
            <li><a href="#" className="text-sm text-black hover:text-cyan-500 transition-colors">Governance</a></li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="pt-8 border-t border-black flex flex-col md:flex-row justify-between items-center text-black">
        <p className="text-xs font-medium mb-4 md:mb-0">
          © 2026 Gov DAO. All rights reserved.
        </p>
        <div className="flex space-x-6 text-xs font-medium">
          <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);
