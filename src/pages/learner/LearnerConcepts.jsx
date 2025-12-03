import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export default function LearnerConcepts({ concepts, onComplete }) {
  const [viewedConcepts, setViewedConcepts] = useState(new Set());

  const handleConceptClick = (concept) => {
    const newSet = new Set(viewedConcepts);
    newSet.add(concept);
    setViewedConcepts(newSet);
  };

  useEffect(() => {
    if (viewedConcepts.size === concepts.length) {
      onComplete();
    }
  }, [viewedConcepts, concepts.length, onComplete]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Key Concepts</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Tap each concept to mark it as reviewed.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {concepts.map((concept, index) => {
          const isViewed = viewedConcepts.has(concept);
          return (
            <motion.button
              key={index}
              onClick={() => handleConceptClick(concept)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-6 py-3 rounded-full text-lg font-medium transition-all duration-300
                ${isViewed 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {concept}
                <AnimatePresence>
                  {isViewed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Check size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(viewedConcepts.size / concepts.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
