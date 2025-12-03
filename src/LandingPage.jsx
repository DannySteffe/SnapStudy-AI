import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Walkthrough from './components/Walkthrough';
import { useTheme } from './hooks/useTheme';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-blue-500/30">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Walkthrough />
      </main>
    </div>
  );
}
