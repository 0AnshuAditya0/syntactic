'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ url, onUpload }: AvatarUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      setError('');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image must be smaller than 2MB.');
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
          {url ? (
            <img
              src={url}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-transparent"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Change Avatar'
          )}
        </Button>
        
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
