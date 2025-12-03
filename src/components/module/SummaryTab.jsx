import React, { useState, useEffect } from 'react';
import { Sparkles, Save } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SummaryTab({ initialSummary }) {
  const [summary, setSummary] = useState(initialSummary);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (summary !== initialSummary) {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        }, 800);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [summary, initialSummary]);

  const handleRegenerate = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Regenerating summary...',
      success: 'Summary updated!',
      error: 'Failed to regenerate'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Executive Summary</h3>
        <button 
          onClick={handleRegenerate}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <Sparkles size={12} /> Re-run AI
        </button>
      </div>

      <div className="relative group">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full min-h-[300px] p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs text-slate-400">
          {isSaving ? (
            <span className="flex items-center gap-1 text-blue-500"><Save size={12} className="animate-pulse" /> Saving...</span>
          ) : lastSaved ? (
            <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          ) : null}
          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
            {summary.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>
    </div>
  );
}
