'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/auth/signup-form';
import { PrivateKeyDisplay } from '@/components/auth/private-key-display';


export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'key'>('form');
  const [privateKey, setPrivateKey] = useState('');

  const [username, setUsername] = useState('');

  function handleSignupSuccess(key: string) {
    setPrivateKey(key);

    
    // Extract username from form (we'll need to pass it)
    const usernameInput = document.querySelector<HTMLInputElement>('input[id="username"]');
    if (usernameInput) {
      setUsername(usernameInput.value);
    }
    
    setStep('key');
  }

  async function handleKeyConfirmed() {
    // Redirect to playground or home
    router.push('/playground');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'form' ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-muted-foreground">
                Join Syntactic and start coding
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <SignupForm onSuccess={handleSignupSuccess} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Account Created! 🎉</h1>
              <p className="text-muted-foreground">
                Save your private key to access your account from any device
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <PrivateKeyDisplay
                privateKey={privateKey}
                username={username}
                onConfirm={handleKeyConfirmed}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
