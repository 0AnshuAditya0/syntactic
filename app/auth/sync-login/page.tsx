'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Smartphone, Key } from 'lucide-react';

export default function SyncLoginPage() {

  const [username, setUsername] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call sync-login API
      const response = await fetch('/api/auth/sync-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, privateKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to the magic link URL to verify session
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      // Fallback (should not happen with new API)
      throw new Error('No redirect URL received');

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Sync Login</h1>
          <p className="text-muted-foreground">
            Login from any device using your username and private key
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privateKey">Private Key</Label>
              <div className="relative">
                <Input
                  id="privateKey"
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="32-character key"
                  required
                  className="font-mono pr-10"
                  autoComplete="off"
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                The 32-character key you received when you created your account
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Sync Login'}
            </Button>
          </form>

          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Lost your private key?{' '}
              <a href="/auth/recover-key" className="text-primary hover:underline">
                Recover it
              </a>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Or use{' '}
              <a href="/auth/login" className="text-primary hover:underline">
                standard login
              </a>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Why Sync Login?
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Login instantly from any device</li>
            <li>• No need to check email</li>
            <li>• Your code files sync automatically</li>
            <li>• Works even if you forget your password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
