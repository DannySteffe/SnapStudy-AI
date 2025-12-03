import React from 'react';
import { ArrowLeft, Sparkles, Download, CheckCircle, Loader2, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { Button } from '../ui/Button';

export default function ModuleHeader({ title, status, onRegenerate }) {
  const navigate = useNavigate();

  const handleExport = () => {
    toast.success("Downloading PDF...");
  };

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate max-w-[300px] md:max-w-md">
                {title}
              </h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last edited just now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="success"
            size="sm"
            onClick={() => navigate(`/learn/1`)} // Hardcoded ID for demo
          >
            <ArrowRight size={16} className="mr-2" />
            Start Learning
          </Button>
          
          <Button 
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-transparent hover:bg-blue-100 dark:hover:bg-blue-900/40"
          >
            <Sparkles size={16} className="mr-2" />
            Regenerate
          </Button>
          
          <Button 
            variant="secondary"
            size="sm"
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    draft: { color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", icon: Clock, text: "Draft" },
    processing: { color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", icon: Loader2, text: "Processing", animate: true },
    completed: { color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle, text: "Completed" }
  };

  const { color, icon: Icon, text, animate } = config[status] || config.draft;

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5", color)}>
      <Icon size={12} className={cn(animate && "animate-spin")} />
      {text}
    </span>
  );
}
