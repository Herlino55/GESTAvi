import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required, 
  min, 
  max, 
  disabled 
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      required={required} 
      min={min} 
      max={max} 
      disabled={disabled}
      className="px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
    />
  </div>
);