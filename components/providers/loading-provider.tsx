'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage?: string;
  setLoadingMessage: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setLoadingMessage(undefined);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 border-4 border-[#F29F67] border-t-transparent rounded-full animate-spin"></div>
            {loadingMessage && (
              <p className="text-[#1E1E2C] dark:text-white font-medium text-center">
                {loadingMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
