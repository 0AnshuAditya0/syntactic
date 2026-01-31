'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { Language } from '@/lib/playground/templates';
import { useAuth } from '@/hooks/useAuth';

interface SaveDialogProps {
  code: string;
  language: Language;
  onSaved: (fileId: string) => void;
}

export function SaveDialog({ code, language, onSaved }: SaveDialogProps) {

  const { user } = useAuth();
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4 text-center">
        <h3 className="font-semibold">Sign in to Save</h3>
        <p className="text-sm text-muted-foreground">
          You need to be logged in to save your code snippets to your profile.
        </p>
        <Button asChild className="w-full bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C]">
          <a href="/auth/login">Login / Sign Up</a>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!filename.trim()) {
      setError('Filename is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const fileData = {
        user_id: user.id,
        filename: filename.trim(),
        language,
        code,
        description: description.trim() || null,
        is_public: isPublic,
      };

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
