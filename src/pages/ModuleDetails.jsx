import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Lightbulb, Layers, HelpCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/Navbar';
import ModuleHeader from '../components/module/ModuleHeader';
import SummaryTab from '../components/module/SummaryTab';
import ConceptsTab from '../components/module/ConceptsTab';
import FlashcardsTab from '../components/module/FlashcardsTab';
import QuizTab from '../components/module/QuizTab';
import { cn } from '../lib/utils';

// Mock Data
const mockModule = {
  id: 1,
  title: "Introduction to React Hooks",
  status: "completed",
  summary: "React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 to solve problems with code reuse and complex component logic. The most common hooks are useState for managing state and useEffect for handling side effects like data fetching or subscriptions. Hooks must only be called at the top level of a function component.",
  concepts: ["useState", "useEffect", "Custom Hooks", "Rules of Hooks", "Dependency Array"],
  flashcards: [
    { id: 1, front: "What is useState?", back: "A Hook that lets you add React state to function components." },
    { id: 2, front: "What is useEffect?", back: "A Hook that lets you perform side effects in function components." },
    { id: 3, front: "What are the Rules of Hooks?", back: "Only call Hooks at the top level. Only call Hooks from React function components." }
  ],
  quiz: [
    { id: 1, question: "What is the primary rule of Hooks?", options: ["Only call at top level", "Call inside loops", "Call in class components", "Call conditionally"], correct: 0 },
    { id: 2, question: "Which hook is used for side effects?", options: ["useState", "useReducer", "useEffect", "useContext"], correct: 2 },
    { id: 3, question: "Can you use Hooks in class components?", options: ["Yes", "No", "Only with a wrapper", "Sometimes"], correct: 1 }
  ]
};

const tabs = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'concepts', label: 'Key Concepts', icon: Lightbulb },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz Set', icon: HelpCircle }
];

export default function ModuleDetails() {
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('summary');
  
  // In a real app, fetch data based on ID
  const moduleData = {
    ...mockModule,
    title: `${mockModule.title} (ID: ${id})` // Show ID to verify navigation
  }; 

  const handleRegenerate = () => {
    toast.info("Regenerating all module assets...");
    setTimeout(() => toast.success("Regeneration complete!"), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Toaster position="bottom-right" theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <div className="pt-20">
        <ModuleHeader 
          title={moduleData.title} 
          status={moduleData.status} 
          onRegenerate={handleRegenerate} 
        />

        <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-32 h-fit space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm"
              >
                {activeTab === 'summary' && <SummaryTab initialSummary={moduleData.summary} />}
                {activeTab === 'concepts' && <ConceptsTab initialConcepts={moduleData.concepts} />}
                {activeTab === 'flashcards' && <FlashcardsTab initialCards={moduleData.flashcards} />}
                {activeTab === 'quiz' && <QuizTab initialQuestions={moduleData.quiz} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
