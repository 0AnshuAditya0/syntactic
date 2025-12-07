'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { Language } from '@/lib/playground/templates';

interface SaveDialogProps {
  code: string;
  language: Language;
  onSaved: (fileId: string) => void;
}

export function SaveDialog({ code, language, onSaved }: SaveDialogProps) {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!filename.trim()) {
      setError('Filename is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const fileData: Record<string, unknown> = {
        filename: filename.trim(),
        language,
        code,
        description: description.trim() || null,
        is_public: isPublic,
      };

      if (user) {
        fileData.user_id = user.id;
      } else {
        // Anonymous user - set session ID and expiry
        const sessionId = localStorage.getItem('playground_session') || 
          Math.random().toString(36).substring(7);
        localStorage.setItem('playground_session', sessionId);
        
        fileData.session_id = sessionId;
        // expires_at will be set by trigger (1 hour)
      }

      const { data, error: saveError } = await supabase
        .from('code_files')
        .insert(fileData)
        .select()
        .single();

      if (saveError) throw saveError;

      onSaved(data.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save file');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold">Save Code</h3>
      
      <div className="space-y-2">
        <Label htmlFor="filename">Filename</Label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="my-code.js"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this code do?"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is-public"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="is-public" className="cursor-pointer">
          Make public (others can view)
        </Label>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save
          </>
        )}
      </Button>
    </div>
  );
}
