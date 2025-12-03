import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import LearnerSidebar from './learner/LearnerSidebar';
import LearnerSummary from './learner/LearnerSummary';
import LearnerConcepts from './learner/LearnerConcepts';
import LearnerFlashcards from './learner/LearnerFlashcards';
import LearnerQuizStart from './learner/LearnerQuizStart';
import LearnerQuiz from './learner/LearnerQuiz';

// Mock Data
const mockModule = {
  id: 1,
  title: "Introduction to React Hooks",
  summary: `React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 to solve problems with code reuse and complex component logic.
  
  The most common hooks are useState for managing state and useEffect for handling side effects like data fetching or subscriptions. Hooks must only be called at the top level of a function component.
  
  Before Hooks, stateful logic was hard to reuse between components. Render props and higher-order components were the main patterns, but they often led to "wrapper hell". Hooks allow you to extract stateful logic from a component so it can be tested independently and reused.`,
  concepts: ["useState", "useEffect", "Custom Hooks", "Rules of Hooks", "Dependency Array", "useContext", "useReducer"],
  flashcards: [
    { id: 1, front: "What is useState?", back: "A Hook that lets you add React state to function components." },
    { id: 2, front: "What is useEffect?", back: "A Hook that lets you perform side effects in function components." },
    { id: 3, front: "What are the Rules of Hooks?", back: "Only call Hooks at the top level. Only call Hooks from React function components." },
    { id: 4, front: "What is a Custom Hook?", back: "A JavaScript function whose name starts with 'use' and that may call other Hooks." }
  ],
  quiz: [
    { id: 1, question: "What is the primary rule of Hooks?", options: ["Only call at top level", "Call inside loops", "Call in class components", "Call conditionally"], correct: 0 },
    { id: 2, question: "Which hook is used for side effects?", options: ["useState", "useReducer", "useEffect", "useContext"], correct: 2 },
    { id: 3, question: "Can you use Hooks in class components?", options: ["Yes", "No", "Only with a wrapper", "Sometimes"], correct: 1 },
    { id: 4, question: "What is the dependency array in useEffect?", options: ["A list of components", "A list of values that trigger re-run", "A list of errors", "A list of hooks"], correct: 1 }
  ]
};

export default function LearnerView() {
  const { id } = useParams();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('summary');
  const [quizStarted, setQuizStarted] = useState(false);
  const [progress, setProgress] = useState({
    summary: false,
    concepts: false,
    flashcards: false,
    quiz: false
  });

  const handleSectionComplete = (sectionId) => {
    setProgress(prev => ({ ...prev, [sectionId]: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans flex flex-col lg:flex-row">
      <Toaster position="bottom-right" theme={theme} />
      
      <LearnerSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        progress={progress}
      />

      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'summary' && (
                <LearnerSummary 
                  content={mockModule.summary} 
                  onComplete={() => handleSectionComplete('summary')} 
                />
              )}
              {activeSection === 'concepts' && (
                <LearnerConcepts 
                  concepts={mockModule.concepts} 
                  onComplete={() => handleSectionComplete('concepts')} 
                />
              )}
              {activeSection === 'flashcards' && (
                <LearnerFlashcards 
                  flashcards={mockModule.flashcards} 
                  onComplete={() => handleSectionComplete('flashcards')} 
                />
              )}
              {activeSection === 'quiz' && (
                !quizStarted ? (
                  <LearnerQuizStart onStart={() => setQuizStarted(true)} />
                ) : (
                  <LearnerQuiz 
                    questions={mockModule.quiz} 
                    onComplete={(score) => {
                      handleSectionComplete('quiz');
                      // Optional: Save score logic here
                    }}
                    onExit={() => setQuizStarted(false)}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
