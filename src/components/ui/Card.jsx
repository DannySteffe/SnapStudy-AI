import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({ className, children, hoverable = false, ...props }, ref) => {
  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable ? {
    whileHover: { y: -4, transition: { duration: 0.2 } }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6",
        hoverable && "cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-colors",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("font-bold text-lg text-slate-900 dark:text-white leading-none tracking-tight", className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("flex items-center pt-4 mt-4 border-t border-slate-100 dark:border-slate-700", className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
