'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import { useRouter } from 'next/navigation';

export type UserType = 'oauth' | 'temp';

export interface TempUser {
  id: string;
  email?: string;
  username?: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  tempUser: TempUser | null;
  userType: UserType | null;
  sessionExpiresAt: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  setTempSession: (token: string, user: TempUser, expiresAt: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  tempUser: null,
  userType: null,
  sessionExpiresAt: null,
  loading: true,
  signOut: async () => {},
  isAuthenticated: false,
  setTempSession: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tempUser, setTempUser] = useState<TempUser | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      // 1. Check Supabase Auth (Persistent)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        if (mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } else {
        // 2. Check Temporary Session (Public Device)
        const tempToken = sessionStorage.getItem('syntactic_temp_token');
        const storedUser = sessionStorage.getItem('syntactic_temp_user');
        const storedExpiry = sessionStorage.getItem('syntactic_session_expires');

        if (tempToken && storedUser && storedExpiry) {
          const expires = new Date(storedExpiry).getTime();
          if (Date.now() < expires) {
            if (mounted) {
              setTempUser(JSON.parse(storedUser));
              setSessionExpiresAt(storedExpiry);
            }
          } else {
            // Expired
            sessionStorage.clear();
          }
        }
        
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    // Listen for Supabase Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        // Clear temp session if we log in permanently
        sessionStorage.clear();
        setTempUser(null);
        setSessionExpiresAt(null);
      } else {
        setUser(null);
        setProfile(null);
        // If Supabase flags logout, check if we have a valid temp session?
        // No, usually they are exclusive.
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) console.error('Fetch profile error:', error);
      if (data) setProfile(data);
    } catch (error) {
       console.error(error);
    } finally {
      // Don't set loading false here because initialization logic handles it mainly
    }
  }

  const setTempSession = (token: string, user: TempUser, expiresAt: string) => {
    sessionStorage.setItem('syntactic_temp_token', token);
    sessionStorage.setItem('syntactic_temp_user', JSON.stringify(user));
    sessionStorage.setItem('syntactic_session_expires', expiresAt);
    
    setTempUser(user);
    setSessionExpiresAt(expiresAt);
    // Ensure separate user state is clear
    setUser(null);
    setProfile(null);
  };

  async function signOut() {
    if (user) {
      await supabase.auth.signOut();
    }
    // Clear everything
    sessionStorage.clear();
    setUser(null);
    setProfile(null);
    setTempUser(null);
    setSessionExpiresAt(null);
    router.push('/auth/login');
  }

  // Determine effective authenticated user
  // Adapting profile for basic display if it's a temp user
  // This allows current components using 'profile' to might still work if we shim it?
  // But strictly, 'profile' is the DB profile. 'tempUser' has limited info.
  // We should update consumers. For now, profile is null for temp user.
  
  const isAuthenticated = !!(user || tempUser);
  const userType: UserType | null = user ? 'oauth' : (tempUser ? 'temp' : null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile, 
        tempUser, 
        userType,
        sessionExpiresAt, 
        loading, 
        signOut, 
        isAuthenticated,
        setTempSession 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
