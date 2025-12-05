// src/contexts/UiContext.tsx
import { createContext, useContext, useState, useCallback, ReactNode, FC } from 'react';

// Types
interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface UiState {
  isLoading: boolean;
  toast: Toast;
}

interface UiContextType extends UiState {
  showLoader: () => void;
  hideLoader: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

// Context
const UiContext = createContext<UiContextType | undefined>(undefined);

// Provider
export const UiProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: '',
    type: 'info',
  });

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({
      message,
      type,
      show: true,
    });

    // Masquer automatiquement après 5 secondes
    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'info',
      });
    }, 5000);
  }, []);

  const hideToast = useCallback(() => {
    setToast({
      show: false,
      message: '',
      type: 'info',
    });
  }, []);

  const value: UiContextType = {
    isLoading,
    toast,
    showLoader,
    hideLoader,
    showToast,
    hideToast,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

// Hook personnalisé
export const useUi = (): UiContextType => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUi doit être utilisé à l\'intérieur d\'un UiProvider');
  }
  return context;
};