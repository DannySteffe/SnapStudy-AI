import React, { useState } from 'react';
import { X, Plus, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConceptsTab({ initialConcepts }) {
  const [concepts, setConcepts] = useState(initialConcepts);
  const [newConcept, setNewConcept] = useState('');

  const handleAdd = (e) => {
    if (e.key === 'Enter' && newConcept.trim()) {
      setConcepts([...concepts, newConcept.trim()]);
      setNewConcept('');
    }
  };

  const handleDelete = (index) => {
    setConcepts(concepts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Key Concepts</h3>
        <span className="text-xs text-slate-500">{concepts.length} items</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {concepts.map((concept, index) => (
            <motion.div
              key={`${concept}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <GripVertical size={14} className="text-slate-300 cursor-move" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{concept}</span>
              <button 
                onClick={() => handleDelete(index)}
                className="p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={newConcept}
            onChange={(e) => setNewConcept(e.target.value)}
            onKeyDown={handleAdd}
            placeholder="Add concept..."
            className="pl-3 pr-8 py-2 bg-transparent border border-dashed border-slate-300 dark:border-slate-600 rounded-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-32 focus:w-48"
          />
          <Plus size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
