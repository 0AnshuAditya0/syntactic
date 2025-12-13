'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setLoadingMessage(undefined);
    }
  };

  // Automatic Page Transition on Route Change
  useEffect(() => {
    // When path changes, we force loading to be true (if it wasn't already)
    // and then fade it out after a delay.
    setIsLoading(true);
    
    // Smooth transition out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500ms delay as requested

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
             {/* Cat Animation Container */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 bg-white/5 backdrop-blur-sm">
              <img 
                src="/cat_ani.gif" 
                alt="Loading..." 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Optional Loading Text if message is present, or default */}
            <p className="text-white text-lg font-medium tracking-wide animate-pulse">
              {loadingMessage || 'Loading...'}
            </p>
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
