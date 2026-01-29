'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'active' | 'paused' | 'completed' | 'todo' | 'in_progress' | 'done' }) {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    paused: { variant: 'warning' as const, label: 'Paused' },
    completed: { variant: 'info' as const, label: 'Completed' },
    todo: { variant: 'default' as const, label: 'To Do' },
    in_progress: { variant: 'warning' as const, label: 'In Progress' },
    done: { variant: 'success' as const, label: 'Done' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
