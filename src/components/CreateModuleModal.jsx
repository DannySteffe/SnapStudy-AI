import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Module" maxWidth="max-w-2xl">
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!title.trim() || !content.trim()}
            >
              <FileText size={18} className="mr-2" />
              Generate Learning Assets
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
