import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileText, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const steps = [
  { id: 'parsing', label: 'Parsing Content' },
  { id: 'summary', label: 'Generating Summary' },
  { id: 'concepts', label: 'Extracting Concepts' },
  { id: 'flashcards', label: 'Creating Flashcards' },
  { id: 'quiz', label: 'Building Quiz' }
];

export default function CreateModuleModal({ isOpen, onClose, onGenerate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-save draft simulation
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(() => {
        // In a real app, save to local storage or backend
        console.log('Draft saved');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, content]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      toast.success(`File "${file.name}" uploaded`);
      // Simulate reading file
      setContent(`[Content from ${file.name}]`);
    } else {
      toast.error('Invalid file type. Please upload a PDF.');
    }
  };

  const handleGenerate = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsGenerating(true);
    setCurrentStep(0);

    // Simulate AI pipeline
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s per step
    }

    onGenerate({
      title,
      description: content.slice(0, 100) + '...',
      date: 'Just now',
      status: 'completed'
    });

    toast.success('Module generated successfully!');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsGenerating(false);
    setCurrentStep(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Module</h2>
          {!isGenerating && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </div>
              </div>
              
              <div className="w-full max-w-md space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300",
                      index < currentStep ? "bg-green-500 text-white" :
                      index === currentStep ? "bg-blue-500 text-white animate-pulse" :
                      "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    )}>
                      {index < currentStep ? <Check size={14} /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      index <= currentStep ? "text-slate-900 dark:text-white" : "text-slate-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Module Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Quantum Physics"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Content <span className="text-red-500">*</span>
                </label>
                <div 
                  className="relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your lesson text here, or drag & drop a PDF..."
                    className="w-full h-48 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-slate-400">
                    {title || content ? <span className="text-green-500">Saved 3s ago</span> : null}
                    <span>{content.length} chars</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Supported: Text, PDF (Drag & Drop)</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <UploadCloud size={14} /> Upload File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isGenerating && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!title.trim() || !content.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <FileText size={18} /> Generate Learning Assets
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
