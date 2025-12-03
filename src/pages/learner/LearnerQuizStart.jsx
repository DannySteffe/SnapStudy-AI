import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function LearnerQuizStart({ onStart }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600 dark:text-blue-400">
          <Trophy size={48} />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to test your knowledge?
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          You've reviewed the summary, concepts, and flashcards. Take the quiz to solidify your understanding and earn your completion badge.
        </p>

        <Button
          onClick={onStart}
          size="lg"
          className="w-full sm:w-auto text-lg group"
        >
          Start Quiz
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
}
