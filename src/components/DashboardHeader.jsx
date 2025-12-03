import React, { useState } from 'react';
import { Sun, Moon, User, LogOut, Settings, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardHeader({ theme, toggleTheme, onCreateClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SnapStudy AI
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
            Creator
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCreateClick}
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-semibold text-sm transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Create Module
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-400"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
            >
              <User size={20} className="text-slate-500 dark:text-slate-300" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Demo User</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">creator@snapstudy.ai</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                    <Settings size={16} /> Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
