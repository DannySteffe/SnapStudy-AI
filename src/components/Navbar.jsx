import React from 'react';
import { Sun, Moon, LayoutDashboard, BarChart2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white cursor-pointer" onClick={() => navigate('/')}>
        SnapStudy AI
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button
          onClick={() => navigate('/analytics')}
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <BarChart2 size={18} />
          Analytics
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-600" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>
    </nav>
  );
}
