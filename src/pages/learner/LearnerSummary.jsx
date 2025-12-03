import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function LearnerSummary({ content, onComplete }) {
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onComplete();
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [onComplete]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="p-8 md:p-12 relative group">
        <Button 
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </Button>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Executive Summary</h2>
        <div className="prose dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          {content.split('\n').map((para, i) => (
            <p key={i} className="mb-6 last:mb-0">{para}</p>
          ))}
        </div>
        
        {/* Scroll Trigger */}
        <div ref={bottomRef} className="h-4 w-full" />
      </Card>
      
      <p className="text-center text-sm text-slate-400 italic">
        Scroll to the bottom to complete this section
      </p>
    </div>
  );
}
