import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  required, 
  disabled 
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <select 
      value={value} 
      onChange={onChange} 
      required={required} 
      disabled={disabled}
      className="px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all disabled:bg-slate-100"
    >
      <option value="">-- Sélectionner --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);