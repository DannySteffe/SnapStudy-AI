import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, PlayCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: "Upload Your Lesson",
    desc: "Text, PDF, or paste content."
  },
  {
    icon: Zap,
    title: "AI Generates Pack",
    desc: "Summary, concepts, flashcards, quizzes."
  },
  {
    icon: PlayCircle,
    title: "Start Learning",
    desc: "Track progress, engage, iterate."
  }
];

export default function Walkthrough() {
  return (
    <section className="py-20 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
