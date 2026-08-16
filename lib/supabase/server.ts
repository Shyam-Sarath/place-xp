import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

if (typeof globalThis.WebSocket === 'undefined') {
  try {
    globalThis.WebSocket = require('ws');
  } catch {
    // ignore
  }
}

// Use this inside Server Components, route handlers, and Server Actions.
// Always call this fresh for each request — never cache/share the client.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
