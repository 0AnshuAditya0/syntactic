'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { AvatarUpload } from '@/components/profile/avatar-upload';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    display_name: '',
    bio: '',
    website_url: '',
    github_username: '',
    twitter_username: '',
  });

  // Preferences form
  const [preferencesForm, setPreferencesForm] = useState({
    editor_theme: 'vs-dark',
    editor_font_size: 14,
    reading_mode: 'auto',
    email_notifications: true,
    show_line_numbers: true,
    auto_save: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }

    if (profile) {
      setProfileForm({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        website_url: profile.website_url || '',
        github_username: profile.github_username || '',
        twitter_username: profile.twitter_username || '',
      });

      // Fetch preferences
      fetchPreferences();
    }
  }, [user, profile, authLoading]);

  async function fetchPreferences() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreferencesForm({
          editor_theme: data.editor_theme,
          editor_font_size: data.editor_font_size,
          reading_mode: data.reading_mode,
          email_notifications: data.email_notifications,
          show_line_numbers: data.show_line_numbers,
          auto_save: data.auto_save,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileForm.display_name || null,
          bio: profileForm.bio || null,
          website_url: profileForm.website_url || null,
          github_username: profileForm.github_username || null,
          twitter_username: profileForm.twitter_username || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePreferencesUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(preferencesForm)
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage('Preferences updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {message && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="mb-8 flex justify-center">
                <AvatarUpload
                  url={profile?.avatar_url || null}
                  onUpload={async (url) => {
                    // Update profile with new avatar URL
                    const { error } = await supabase
                      .from('profiles')
                      .update({ avatar_url: url })
                      .eq('id', user.id);
                    
                    if (error) {
                      setError(error.message);
                    } else {
                      // Refresh profile
                      window.location.reload();
                    }
                  }}
                />
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Public Profile</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile?.username || ''}
                        disabled
                        className="bg-gray-100 dark:bg-gray-900"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Username cannot be changed
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                        placeholder="Your display name"
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                        maxLength={500}
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {profileForm.bio.length}/500 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="website_url">Website</Label>
                      <Input
                        id="website_url"
                        type="url"
                        value={profileForm.website_url}
                        onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="github_username">GitHub Username</Label>
                        <Input
                          id="github_username"
                          value={profileForm.github_username}
                          onChange={(e) => setProfileForm({ ...profileForm, github_username: e.target.value })}
                          placeholder="username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitter_username">Twitter Username</Label>
                        <Input
                          id="twitter_username"
                          value={profileForm.twitter_username}
                          onChange={(e) => setProfileForm({ ...profileForm, twitter_username: e.target.value })}
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Editor Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="editor_theme">Editor Theme</Label>
                      <select
                        id="editor_theme"
                        value={preferencesForm.editor_theme}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, editor_theme: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="vs-dark">VS Dark</option>
                        <option value="vs-light">VS Light</option>
                        <option value="hc-black">High Contrast</option>
                        <option value="github-dark">GitHub Dark</option>
                        <option value="monokai">Monokai</option>
                        <option value="dracula">Dracula</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="editor_font_size">Font Size: {preferencesForm.editor_font_size}px</Label>
                      <input
                        id="editor_font_size"
                        type="range"
                        min="10"
                        max="24"
                        value={preferencesForm.editor_font_size}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, editor_font_size: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reading_mode">Reading Mode</Label>
                      <select
                        id="reading_mode"
                        value={preferencesForm.reading_mode}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, reading_mode: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferencesForm.show_line_numbers}
                          onChange={(e) => setPreferencesForm({ ...preferencesForm, show_line_numbers: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Show line numbers</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferencesForm.auto_save}
                          onChange={(e) => setPreferencesForm({ ...preferencesForm, auto_save: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Auto-save code files</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferencesForm.email_notifications}
                          onChange={(e) => setPreferencesForm({ ...preferencesForm, email_notifications: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Email notifications</span>
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
