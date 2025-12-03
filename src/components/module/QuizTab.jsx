import React, { useState } from 'react';
import { Play, Clock, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function QuizTab({ initialQuestions }) {
  const [expandedId, setExpandedId] = useState(initialQuestions[0]?.id);
  const [timerMode, setTimerMode] = useState('off'); // off, 30s, 60s

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quiz Set</h3>
          <p className="text-sm text-slate-500">{initialQuestions.length} questions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {['off', '30s', '60s'].map((mode) => (
              <button
                key={mode}
                onClick={() => setTimerMode(mode)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timerMode === mode 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {mode === 'off' ? 'No Timer' : mode}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            <Play size={16} /> Preview Quiz
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {initialQuestions.map((q, index) => (
          <div 
            key={q.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all"
          >
            <button 
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  {index + 1}
                </span>
                <span className="font-medium text-slate-900 dark:text-white line-clamp-1">
                  {q.question}
                </span>
              </div>
              {expandedId === q.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            <AnimatePresence>
              {expandedId === q.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100 dark:border-slate-700"
                >
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question</label>
                      <input 
                        defaultValue={q.question}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Options</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 cursor-pointer",
                              i === q.correct 
                                ? "border-green-500 bg-green-50 text-green-600" 
                                : "border-slate-300 dark:border-slate-600"
                            )}>
                              {i === q.correct && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                            </div>
                            <input 
                              defaultValue={opt}
                              className={cn(
                                "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors",
                                i === q.correct
                                  ? "bg-green-50/50 border-green-200 dark:border-green-900/30 text-green-900 dark:text-green-100"
                                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:border-blue-500"
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
