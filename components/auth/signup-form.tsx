'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { linkAnonymousFiles, getOrCreateSessionId } from '@/lib/auth/session';

interface SignupFormProps {
  onSuccess?: (privateKey: string, userId: string) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    recoveryEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          recoveryEmail: formData.recoveryEmail || formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Link anonymous files if session exists
      const sessionId = getOrCreateSessionId();
      if (sessionId) {
        await linkAnonymousFiles(data.userId, sessionId);
      }

      // Call success callback with private key
      if (onSuccess) {
        onSuccess(data.privateKey, data.userId);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="johndoe"
          required
          minLength={3}
          maxLength={30}
          pattern="[a-zA-Z0-9_-]+"
          title="Only letters, numbers, hyphens, and underscores"
        />
        <p className="text-xs text-muted-foreground">
          3-30 characters. Letters, numbers, hyphens, and underscores only.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          required
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">
          At least 8 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recoveryEmail">Recovery Email (optional)</Label>
        <Input
          id="recoveryEmail"
          type="email"
          value={formData.recoveryEmail}
          onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
          placeholder="recovery@example.com"
        />
        <p className="text-xs text-muted-foreground">
          Used to recover your private key if lost. Defaults to your main email.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <a href="/auth/login" className="text-primary hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
