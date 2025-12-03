import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden min-h-[60vh] justify-center bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50">
       {/* Floating Icons Background */}
       <motion.div 
         animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-24 left-[15%] opacity-10 dark:opacity-20 text-blue-600 pointer-events-none"
       >
         <BookOpen size={64} />
       </motion.div>
       <motion.div 
         animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
         className="absolute top-32 right-[15%] opacity-10 dark:opacity-20 text-indigo-500 pointer-events-none"
       >
         <Sparkles size={72} />
       </motion.div>
       <motion.div 
         animate={{ y: [0, -10, 0] }} 
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
         className="absolute bottom-10 left-[20%] opacity-10 dark:opacity-20 text-purple-500 pointer-events-none"
       >
         <Brain size={56} />
       </motion.div>

       <motion.h1 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 relative z-10"
       >
         SnapStudy AI
       </motion.h1>
       
       <motion.p 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.1 }}
         className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed relative z-10"
       >
         Turn any lesson into interactive micro-learning. 
         <span className="block text-slate-500 dark:text-slate-400 mt-2 text-lg">Generate summaries, flashcards, and quizzes instantly.</span>
       </motion.p>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10"
       >
         <button 
           onClick={() => navigate('/dashboard')}
           className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 flex items-center justify-center gap-2"
         >
           Create Module <ArrowRight size={20} />
         </button>
         <button 
           onClick={() => navigate('/dashboard')}
           className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-8 py-4 font-semibold text-lg transition-all hover:-translate-y-1"
         >
           View Modules
         </button>
       </motion.div>
    </section>
  );
}
