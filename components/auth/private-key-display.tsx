'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, AlertTriangle } from 'lucide-react';
import { formatPrivateKey } from '@/lib/auth/private-key';

interface PrivateKeyDisplayProps {
  privateKey: string;
  username: string;
  onConfirm: () => void;
}

export function PrivateKeyDisplay({ privateKey, username, onConfirm }: PrivateKeyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadAsFile() {
    const blob = new Blob(
      [
        `Syntactic Private Key\n`,
        `======================\n\n`,
        `Username: ${username}\n`,
        `Private Key: ${privateKey}\n\n`,
        `IMPORTANT: Keep this key safe and secure!\n`,
        `You will need it to login from other devices.\n`,
        `If you lose this key, you can recover it using your recovery email.\n\n`,
        `Generated: ${new Date().toLocaleString()}\n`,
      ],
      { type: 'text/plain' }
    );
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntactic-private-key-${username}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleConfirm() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    onConfirm();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Warning Banner */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-700 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              Save Your Private Key!
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This is the <strong>ONLY TIME</strong> you will see this key. You need it to login from other devices.
              If you lose it, you can recover it using your recovery email, but it's best to save it now.
            </p>
          </div>
        </div>
      </div>

      {/* Private Key Display */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-center">Your Private Key</h2>
        <p className="text-center text-muted-foreground">
          Username: <span className="font-mono font-semibold">{username}</span>
        </p>
        
        <div className="p-6 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-center font-mono text-2xl font-bold tracking-wider break-all select-all">
            {formatPrivateKey(privateKey)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>

          <Button
            onClick={downloadAsFile}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download as File
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          How to use your private key:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Save it in a secure password manager (recommended)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Or download the text file and store it safely</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Use it with your username to login from any device</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>If lost, you can recover it via your recovery email</span>
          </li>
        </ul>
      </div>

      {/* Confirmation */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">
            I have saved my private key in a secure location
          </span>
        </label>

        <Button
          onClick={handleConfirm}
          disabled={!confirmed}
          className="w-full"
          size="lg"
        >
          {confirmed ? 'Continue to Syntactic' : 'Please confirm you saved your key'}
        </Button>
      </div>
    </div>
  );
}
