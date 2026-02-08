'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { ImageCropModal } from './image-crop-modal';

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ url, onUpload }: AvatarUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setError('');

      if (!user) {
        throw new Error('You must be logged in to upload an avatar.');
      }

      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image must be smaller than 2MB.');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image.');
      }

      // Create preview URL and show crop modal
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);

    } catch (error: any) {
      console.error('File selection error:', error);
      setError(error.message || 'An error occurred');
    }
  }

  async function uploadCroppedImage(croppedBlob: Blob) {
    try {
      setUploading(true);
      setError('');
      console.log('Uploading cropped image via API route...');

      // Convert blob to file
      const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      // Upload via API route
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { url } = await response.json();
      console.log('Upload successful, URL:', url);
      
      onUpload(url);
    } catch (error: any) {
      console.error('Avatar Upload Flow Error:', error);
      setError(error.message || 'An unknown error occurred');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploading(false);
    }
  }

  return (
    <>
      <ImageCropModal
        open={cropModalOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={uploadCroppedImage}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            {url ? (
              <Image
                src={url}
                alt="Avatar"
                fill
                sizes="128px"
                className="object-cover"
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
          onChange={handleFileSelect}
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
    </>
  );
}
