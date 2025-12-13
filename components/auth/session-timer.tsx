'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function SessionTimer() {
  const { sessionExpiresAt, signOut } = useAuth();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!sessionExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(sessionExpiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        clearInterval(interval);
        signOut();
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }

      // Warning at 15 minutes
      if (diff < 15 * 60 * 1000 && !isWarning) {
        setIsWarning(true);
        toast.warning('Session expiring in 15 minutes!');
      }

      // Format time
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiresAt, signOut, router, isWarning]);

  if (!sessionExpiresAt) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border ${
      isWarning 
        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }`}>
      {isWarning ? <AlertTriangle size={12} /> : <Clock size={12} />}
      <span>{timeLeft}</span>
    </div>
  );
}
