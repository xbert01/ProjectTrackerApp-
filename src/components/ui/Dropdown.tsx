'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'left', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[160px]
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            py-1
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div onClick={() => setIsOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export function DropdownItem({ children, onClick, variant = 'default', disabled }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left text-sm
        ${variant === 'danger'
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-colors
      `}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-gray-200 dark:border-gray-700" />;
}
