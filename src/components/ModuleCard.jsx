import React, { useState } from 'react';
import { MoreVertical, Eye, Edit2, RefreshCw, Trash2, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    icon: Clock
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Loader2,
    animate: true
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2
  }
};

export default function ModuleCard({ module, onDelete, onRegenerate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const status = statusConfig[module.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5", status.color)}>
          <StatusIcon size={14} className={cn(status.animate && "animate-spin")} />
          {status.label}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, originTR: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-10"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                  <Eye size={14} /> View
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => { onRegenerate(module.id); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                >
                  <RefreshCw size={14} /> Regenerate
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                <button 
                  onClick={() => { onDelete(module.id); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {module.title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
        {module.description || "No description provided."}
      </p>

      <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
        <span>Created {module.date}</span>
      </div>
    </motion.div>
  );
}
