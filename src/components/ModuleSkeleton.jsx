import React from 'react';

export default function ModuleSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
      <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  );
}
