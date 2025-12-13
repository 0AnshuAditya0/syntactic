'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/auth/signup-form';
import { PrivateKeyModal } from '@/components/auth/private-key-modal'; // Assuming file name
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // If user lands here AND is logged in (after OAuth callback), preserve to generate key
  useEffect(() => {
    async function checkAndGenerateKey() {
      if (!loading && user) {
        // User is logged in.
        // Call API to generate key if not exists
        try {
          setIsGenerating(true);
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
          });
          
          if (res.status === 409) {
            // Already has key
            // Simply redirect to home
            router.replace('/playground');
            return;
          }

          const data = await res.json();
          if (data.success && data.private_key) {
            setGeneratedKey(data.private_key);
          } else if (data.error) {
            // Might be error or just 'already exists'
            // console.error(data.error);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsGenerating(false);
        }
      }
    }

    if (user && !loading && !generatedKey) {
      checkAndGenerateKey();
    }
  }, [user, loading, router, generatedKey]);

  const handleKeyConfirmed = () => {
     router.push('/playground');
  };

  if (loading || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F29F67]" />
      </div>
    );
  }

  // If we have a key, show modal
  if (generatedKey) {
    return (
      <div className="min-h-screen bg-black/90">
        <PrivateKeyModal 
          privateKey={generatedKey} 
          onClose={handleKeyConfirmed}
        />
      </div>
    );
  }

  // If logged in but no key generated (implied already had one or error), we likely redirected above.
  // But if just sitting here:
  if (user) {
    return null; // or loader
  }

  // Standard Signup View
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">
              Join Syntactic and start coding
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
