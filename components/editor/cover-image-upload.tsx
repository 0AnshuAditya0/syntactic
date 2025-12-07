'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface CoverImageUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function CoverImageUpload({ url, onUpload, onRemove }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      setError('');

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Check file size (max 5MB for covers)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be smaller than 5MB.');
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className={`relative aspect-video rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${!url ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
        onClick={() => !url && fileInputRef.current?.click()}
      >
        {url ? (
          <>
            <img
              src={url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/80 hover:bg-white text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8" />
            )}
            <span className="text-sm">
              {uploading ? 'Uploading...' : 'Click to upload cover image'}
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        id="cover-upload"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        ref={fileInputRef}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
