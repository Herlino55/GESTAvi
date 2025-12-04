import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
};