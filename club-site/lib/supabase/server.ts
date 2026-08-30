import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import WebSocket from 'ws';

if (typeof globalThis.WebSocket === 'undefined') {
  try {
    globalThis.WebSocket = WebSocket as typeof globalThis.WebSocket;
  } catch {
    // ignore
  }
}

// Use this inside Server Components, route handlers, and Server Actions.
// Always call this fresh for each request — never cache/share the client.
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase client could not be created because NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in your environment variables.');
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component - safe to ignore because
            // proxy.ts refreshes the session on every navigation instead.
          }
        },
      },
    }
  );
}
