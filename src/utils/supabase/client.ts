// Supabase Client Configuration for KUIMARISHA AI
// This file creates a singleton Supabase client for the frontend

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database-supabase';

// Supabase project configuration
// These will be provided after Supabase project setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey && !supabaseAnonKey.includes('placeholder');

if (!isConfigured) {
  console.log('🎮 Kuimarisha AI - Running in DEMO mode');
  console.log('📖 To enable database persistence, see QUICK_SETUP_GUIDE.md');
}

// Create Supabase client (with placeholder values for development)
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'kuimarisha-ai-mobile',
      },
    },
  }
);

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper to get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Helper to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return !!session;
};

// Auth state change listener
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Sign out helper
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export default supabase;