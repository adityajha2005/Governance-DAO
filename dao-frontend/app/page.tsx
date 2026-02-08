"use client";
import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SubNav } from './components/layout/SubNav';
import { Footer } from './components/layout/Footer';
import { DAOHome } from './components/sections/DAOHome';
import { ProposalsView } from './components/sections/ProposalsView';
import { TransparencyView } from './components/sections/TransparencyView';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Standard Next.js / React pattern for smooth scrolling to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#16141a] font-sans antialiased">
      <Header onHomeClick={() => setActiveTab('home')} />
      <SubNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {activeTab === 'home' && <DAOHome onNav={setActiveTab} />}
        {activeTab === 'proposals' && <ProposalsView />}
        {activeTab === 'treasury' && <TransparencyView />}
      </main>

      <Footer />
    </div>
  );
};

export default App;