import { createBrowserClient } from '@supabase/ssr';

// Use this inside Client Components ('use client' files).
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase client could not be created because NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in your environment variables.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
