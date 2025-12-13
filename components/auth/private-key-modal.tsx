'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

interface PrivateKeyModalProps {
  privateKey: string;
  onClose: () => void;
}

export function PrivateKeyModal({ privateKey, onClose }: PrivateKeyModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(privateKey);
    setCopied(true);
    toast.success('Private key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([`SYNTACTIC PRIVATE KEY\n\nKey: ${privateKey}\n\nKEEP THIS FILE SECURE. DO NOT SHARE.`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'syntactic-key.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#1E1E2C] border border-[#F29F67]/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Save Your Private Key</h2>
          <p className="text-gray-400 text-sm">
            This is the <strong>ONLY</strong> time your key will be shown. You will need it to login on public devices.
          </p>
        </div>

        <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="font-mono text-xl sm:text-2xl text-[#F29F67] break-all text-center tracking-wider bg-black/20 p-4 rounded-lg border border-[#F29F67]/10">
            {privateKey}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-xs text-yellow-500/80 text-center">
            ⚠️ If you lose this key, you will lose access to public device logins. It cannot be recovered.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-transparent text-[#F29F67] focus:ring-[#F29F67] focus:ring-offset-0"
              />
            </div>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              I have explicitly saved this key in a secure location and understand it cannot be recovered.
            </span>
          </label>

          <Button
            onClick={onClose}
            disabled={!confirmed}
            className="w-full bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C] font-bold py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I've Saved My Key
          </Button>
        </div>
      </div>
    </div>
  );
}
