import { useUi } from '@/stores/ui';
import { useEffect, useState } from 'react';

export const ToastNotification = () => {
  const { toast, hideToast } = useUi();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(toast.show);
  }, [toast.show]);

  if (!show) return null;

  const colorClasses = {
    success: 'bg-green-600',
    info: 'bg-blue-600',
    error: 'bg-red-600',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`${colorClasses[toast.type]} text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 min-w-[300px] max-w-md`}
      >
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={hideToast}
          className="text-white/80 hover:text-white transition-colors font-medium"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};