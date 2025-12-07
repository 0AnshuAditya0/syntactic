'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Folder, File, Trash2, Eye, EyeOff } from 'lucide-react';
import { Language } from '@/lib/playground/templates';

interface CodeFile {
  id: string;
  filename: string;
  language: Language;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

interface FileTreeProps {
  onFileSelect: (file: CodeFile & { code: string }) => void;
}

export function FileTree({ onFileSelect }: FileTreeProps) {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('code_files')
        .select('id, filename, language, description, is_public, created_at')
        .order('created_at', { ascending: false });

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = localStorage.getItem('playground_session');
        if (sessionId) {
          query = query.eq('session_id', sessionId);
        } else {
          setFiles([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (file: CodeFile) => {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .select('code')
        .eq('id', file.id)
        .single();

      if (error) throw error;
      
      onFileSelect({ ...file, code: data.code });
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleDelete = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase
        .from('code_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      
      setFiles(files.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const togglePublic = async (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const { error } = await supabase
        .from('code_files')
        .update({ is_public: !file.is_public })
        .eq('id', file.id);

      if (error) throw error;

      setFiles(files.map(f => 
        f.id === file.id ? { ...f, is_public: !f.is_public } : f
      ));
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading files...</div>;
  }

  if (files.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No saved files yet. Save your code to see it here!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
        <Folder className="w-4 h-4" />
        <span>My Files ({files.length})</span>
      </div>
      
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => handleFileClick(file)}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <File className="w-4 h-4 flex-shrink-0 text-blue-600" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{file.filename}</div>
              {file.description && (
                <div className="text-xs text-muted-foreground truncate">
                  {file.description}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => togglePublic(file, e)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title={file.is_public ? 'Make private' : 'Make public'}
            >
              {file.is_public ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={(e) => handleDelete(file.id, e)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
