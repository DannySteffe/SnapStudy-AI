import React from 'react';
import { CheckCircle, Circle, FileText, Lightbulb, Layers, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

const sections = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'concepts', label: 'Key Concepts', icon: Lightbulb },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle }
];

export default function LearnerSidebar({ activeSection, onSectionChange, progress }) {
  const navigate = useNavigate();
  const overallProgress = Math.round(
    (Object.values(progress).filter(Boolean).length / sections.length) * 100
  );

  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto z-30">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-6 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>
        
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">
          Introduction to React Hooks
        </h1>

        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * overallProgress) / 100}
                className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
              {overallProgress}%
            </span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-white">Progress</p>
            <p>{Object.values(progress).filter(Boolean).length} of {sections.length} completed</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isCompleted = progress[section.id];

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"} />
                {section.label}
              </div>
              {isCompleted ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-slate-300 dark:text-slate-600" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
