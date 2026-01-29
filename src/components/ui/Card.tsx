'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-sm
          ${hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}
