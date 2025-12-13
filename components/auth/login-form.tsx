'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';
import { Github, Mail, KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const router = useRouter();
  const { setTempSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [keyLogin, setKeyLogin] = useState({ identifier: '', key: '' });
  const [showKey, setShowKey] = useState(false);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error('Login failed', { description: error.message });
      setLoading(false);
    }
  };

  const handleKeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyLogin.identifier || !keyLogin.key) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      const res = await fetch('/api/auth/login-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: keyLogin.identifier,
          private_key: keyLogin.key.trim()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setTempSession(data.session_token, data.user, data.expires_at);
      toast.success('Login successful', { description: 'Temporary session active for 2 hours.' });
      router.push('/playground');

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow mixed case for legacy keys
    setKeyLogin(prev => ({ ...prev, key: e.target.value }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-white dark:bg-[#1E1E2C] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      
      {/* 1. Trusted Device (OAuth) */}
      <div className="flex-1 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-900/5">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2">My Device</h3>
          <p className="text-sm text-muted-foreground">
            Trusted personal device. Stay logged in for 30 days.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-4 hover:bg-white dark:hover:bg-gray-800"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-4 hover:bg-white dark:hover:bg-gray-800"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </div>
      </div>

      {/* 2. Public Device (Key) */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2">Public Device</h3>
          <p className="text-sm text-muted-foreground">
            Use your Private Key. Session expires in 2 hours.
          </p>
        </div>

        <form onSubmit={handleKeyLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="user@example.com"
                className="pl-9 font-mono"
                value={keyLogin.identifier}
                onChange={e => setKeyLogin({ ...keyLogin, identifier: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Private Key</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showKey ? "text" : "password"}
                placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                className="pl-9 pr-10 font-mono"
                value={keyLogin.key}
                onChange={handleKeyInput}
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-10 bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C] font-bold"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Temporary Session'}
          </Button>
          
          <div className="text-center">
            {/* Lost Key flow */}
            <span className="text-xs text-muted-foreground cursor-help" title="Lost keys cannot be recovered. Please contact support to reset.">
              Lost your key?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
