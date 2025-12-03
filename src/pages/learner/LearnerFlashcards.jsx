import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

export default function LearnerFlashcards({ flashcards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState(new Set());
  const [showLearned, setShowLearned] = useState(true);

  // Filter cards based on "Show Learned" toggle
  const filteredCards = showLearned 
    ? flashcards 
    : flashcards.filter((_, index) => !learnedCards.has(index));

  // If filtered list is empty but original isn't, show a message or reset
  const activeCard = filteredCards[currentIndex] || filteredCards[0];
  
  // Map back to original index for tracking learned status
  const originalIndex = flashcards.findIndex(c => c.id === activeCard?.id);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 200);
  };

  const toggleLearned = (e) => {
    e.stopPropagation();
    const newSet = new Set(learnedCards);
    if (newSet.has(originalIndex)) {
      newSet.delete(originalIndex);
    } else {
      newSet.add(originalIndex);
    }
    setLearnedCards(newSet);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCards.length]);

  // Check completion
  useEffect(() => {
    if (learnedCards.size === flashcards.length) {
      onComplete();
    }
  }, [learnedCards, flashcards.length, onComplete]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [showLearned]);

  if (!activeCard) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All caught up!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">You've marked all cards as learned.</p>
        <Button 
          variant="ghost"
          onClick={() => setShowLearned(true)}
        >
          Review all cards
        </Button>
      </div>
    );
  }

  const isLearned = learnedCards.has(originalIndex);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      {/* Header & Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Flashcards</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {learnedCards.size} of {flashcards.length} learned
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLearned(!showLearned)}
            className={cn(
              !showLearned && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            )}
          >
            <Filter size={14} className="mr-2" />
            {showLearned ? 'Show All' : 'Unlearned Only'}
          </Button>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {filteredCards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${(learnedCards.size / flashcards.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Card Area */}
      <div className="relative w-full max-w-2xl aspect-[3/2] perspective-1000 mb-8 group">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={() => setIsFlipped(!isFlipped)}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x;
            if (swipe < -100) handleNext();
            else if (swipe > 100) handlePrev();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-10 text-center">
            <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-blue-500 uppercase">Question</span>
            <h4 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight select-none">
              {activeCard.front}
            </h4>
            <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
              <RotateCw size={14} /> Tap or Space to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 dark:bg-blue-700 rounded-3xl shadow-xl border border-blue-500 dark:border-blue-600 flex flex-col items-center justify-center p-10 text-center text-white">
            <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-blue-200 uppercase">Answer</span>
            <p className="text-xl md:text-2xl font-medium leading-relaxed select-none">
              {activeCard.back}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <Button 
          variant="secondary"
          size="icon"
          onClick={handlePrev}
          className="rounded-full w-14 h-14"
          aria-label="Previous card"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <Button
          variant={isLearned ? "success" : "secondary"}
          size="lg"
          onClick={toggleLearned}
          className={cn(
            "rounded-full px-8",
            isLearned && "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-slate-900"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mr-2",
            isLearned ? "border-white bg-transparent" : "border-slate-300 dark:border-slate-500"
          )}>
            {isLearned && <CheckCircle size={14} />}
          </div>
          {isLearned ? 'Learned' : 'Mark as Learned'}
        </Button>

        <Button 
          variant="secondary"
          size="icon"
          onClick={handleNext}
          className="rounded-full w-14 h-14"
          aria-label="Next card"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
      
      <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">
        Use <kbd className="font-sans bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">←</kbd> <kbd className="font-sans bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">→</kbd> to navigate, <kbd className="font-sans bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Space</kbd> to flip
      </p>
    </div>
  );
}
