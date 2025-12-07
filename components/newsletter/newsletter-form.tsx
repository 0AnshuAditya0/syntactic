'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already subscribed!');
        } else {
          throw error;
        }
      } else {
        toast.success('Subscribed successfully!');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-[#F29F67]/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#F29F67]/20 rounded-lg text-[#F29F67]">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg text-[#1E1E2C]">Subscribe to the newsletter</h3>
      </div>
      <p className="text-gray-700 mb-6 text-sm">
        Get the latest posts and updates delivered directly to your inbox. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C] font-semibold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
}
