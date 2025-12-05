import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon: Icon, 
  disabled, 
  className = "", 
  type = "button" 
}) => {
  const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const styles = {
    primary: "bg-[#32782B] text-white hover:bg-[#32902B] focus:ring-[#32782B]",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`${base} ${styles[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />} 
      {children}
    </button>
  );
};