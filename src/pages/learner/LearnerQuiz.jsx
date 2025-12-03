import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Timer, ArrowRight, RefreshCw, BookOpen, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';
import { Button } from '../../components/ui/Button';

export default function LearnerQuiz({ questions, onComplete, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question

  // Timer logic
  useEffect(() => {
    if (showResults) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults]);

  const handleOptionSelect = (index) => {
    if (!isLocked) {
      setSelectedOption(index);
    }
  };

  const handleLockAnswer = () => {
    if (selectedOption === null) return;
    
    setIsLocked(true);
    const isCorrect = selectedOption === questions[currentIndex].correct;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399']
      });
    }

    setAnswers([...answers, { questionId: questions[currentIndex].id, selected: selectedOption, correct: isCorrect }]);

    // Auto advance after delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsLocked(false);
      } else {
        setShowResults(true);
        onComplete(score + (isCorrect ? 1 : 0));
        if ((score + (isCorrect ? 1 : 0)) / questions.length > 0.7) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
      }
    }, 1500);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLocked || showResults) return;
      
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < questions[currentIndex].options.length) {
          setSelectedOption(index);
        }
      }
      if (e.key === 'Enter' && selectedOption !== null) {
        handleLockAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedOption, isLocked, showResults]);

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-700 text-center"
        >
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                <motion.circle 
                  cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className={cn("transition-all duration-1000", percentage >= 70 ? "text-green-500" : "text-yellow-500")}
                  strokeDasharray={377}
                  initial={{ strokeDashoffset: 377 }}
                  animate={{ strokeDashoffset: 377 - (377 * percentage) / 100 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
                <span className="text-xs text-slate-500 uppercase font-bold">Score</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {percentage >= 70 ? "Great Job!" : "Keep Practicing!"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            You got {score} out of {questions.length} questions correct.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
              <div className="text-xs font-medium text-green-700 dark:text-green-300">Correct</div>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{questions.length - score}</div>
              <div className="text-xs font-medium text-red-700 dark:text-red-300">Incorrect</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              onClick={() => {
                setScore(0);
                setCurrentIndex(0);
                setAnswers([]);
                setShowResults(false);
                setTimeLeft(questions.length * 60);
              }}
            >
              <RefreshCw size={18} className="mr-2" /> Retry Quiz
            </Button>
            <Button 
              onClick={onExit}
            >
              <BookOpen size={18} className="mr-2" /> Revisit Concepts
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onExit} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
          <div className="flex-1 max-w-md h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ml-4", timeLeft < 10 ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
          <Timer size={16} />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {currentQuestion.question}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === currentQuestion.correct;
                  const showCorrect = isLocked && isCorrect;
                  const showWrong = isLocked && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isLocked}
                      animate={showWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "relative w-full p-5 rounded-xl border-2 text-left transition-all duration-200 group",
                        showCorrect 
                          ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200"
                          : showWrong
                            ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200"
                            : isSelected
                              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-4 font-medium text-lg">
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors",
                            showCorrect ? "bg-green-500 border-green-500 text-white" :
                            showWrong ? "bg-red-500 border-red-500 text-white" :
                            isSelected ? "bg-blue-500 border-blue-500 text-white" :
                            "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500"
                          )}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </span>
                        {showCorrect && <CheckCircle className="text-green-600 dark:text-green-400" />}
                        {showWrong && <XCircle className="text-red-600 dark:text-red-400" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto flex justify-end">
          <Button
            onClick={handleLockAnswer}
            disabled={selectedOption === null || isLocked}
            isLoading={isLocked}
            size="lg"
            className="w-full sm:w-auto text-lg"
          >
            {isLocked ? 'Processing...' : 'Lock Answer'}
            {!isLocked && <ArrowRight size={20} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
