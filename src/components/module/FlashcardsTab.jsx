import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Edit2 } from 'lucide-react';

export default function FlashcardsTab({ initialCards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % initialCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + initialCards.length) % initialCards.length);
  };

  const currentCard = initialCards[currentIndex];

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Flashcards</h3>
        <span className="text-sm font-medium text-slate-500">
          {currentIndex + 1} / {initialCards.length}
        </span>
      </div>

      <div className="relative w-full max-w-2xl aspect-[3/2] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-10 text-center">
            <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-blue-500 uppercase">Question</span>
            <h4 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
              {currentCard.front}
            </h4>
            <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
              <RotateCw size={14} /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-50 dark:bg-slate-800 rounded-3xl shadow-xl border border-blue-100 dark:border-slate-700 flex flex-col items-center justify-center p-10 text-center">
            <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-green-600 uppercase">Answer</span>
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentCard.back}
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); /* Open edit modal */ }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:-translate-x-1"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:translate-x-1"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
