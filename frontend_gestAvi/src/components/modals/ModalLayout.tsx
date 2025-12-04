import React from 'react';
import { X } from 'lucide-react';

interface ModalLayoutProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({ 
  title, 
  children, 
  onSubmit, 
  onClose, 
  submitLabel 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-rose-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {children}
          <button 
            type="submit" 
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};