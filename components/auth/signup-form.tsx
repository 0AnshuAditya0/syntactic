'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Github, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { PrivateKeyModal } from '@/components/auth/private-key-modal';

export function SignupForm() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');

  // Effect to check if user is logged in but might need a key?
  // Actually, we want to auto-generate AFTER signup.
  // We can add a button "Generate My Key" or do it automatically.
  // Given the flow: "Signup" -> "OAuth" -> "Welcome".
  
  useEffect(() => {
    // If we land here and are logged in, we can check if we should generate a key.
    // However, usually this form is for UNLOGGED users.
    // If logged in, we might show "You are already logged in".
  }, [user]);

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/signup`, // We redirect back to signup to show the key? Or a dedicated welcome page.
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error('Signup failed', { description: error.message });
      setLoading(false);
    }
  };

  // If user is logged in (from redirect), try to generate key if they don't have one?
  // We'll add a separate useEffect or button for that flow.
  
  return (
    <>
      <div className="grid gap-4">
        <Button
          variant="outline"
          className="w-full h-11 justify-start gap-4 hover:bg-white dark:hover:bg-gray-800"
          onClick={() => handleOAuthSignup('google')}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 justify-start gap-4 hover:bg-white dark:hover:bg-gray-800"
          onClick={() => handleOAuthSignup('github')}
          disabled={loading}
        >
          <Github className="w-5 h-5" />
          Sign up with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Secure Registration
            </span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
          We use Google/GitHub for secure identity verification.
        </p>
      </div>

      {showKeyModal && (
        <PrivateKeyModal 
          privateKey={generatedKey} 
          onClose={() => setShowKeyModal(false)}
        />
      )}
    </>
  );
}
