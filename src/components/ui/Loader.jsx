import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
}

export function Spinner({ size = "md", className }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div 
      className={cn(
        "rounded-full border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 animate-spin",
        sizes[size],
        className
      )} 
    />
  );
}
