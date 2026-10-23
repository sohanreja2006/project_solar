import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://iufrsiklwexbcfucllba.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZnJzaWtsd2V4YmNmdWNsbGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDQwMTQsImV4cCI6MjEwODE4MDAxNH0.nDhgsPk44b4cKmMM_p0eMCpBDBMN5eZE7UIzEuRRk5c';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

