import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm, { type AuthRole } from '@/components/auth/AuthForm';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata = {
  title: 'Log In — Place XP',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole: AuthRole = role === 'admin' ? 'admin' : 'participant';

  if (!isSupabaseConfigured()) {
    return <AuthenticationUnavailable />;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already signed in — skip straight to the right place instead of
  // showing the login form again.
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    redirect(profile?.role === 'organizer' || profile?.role === 'admin' ? '/admin' : '/');
  }

  return (
    <main className="min-h-screen gradient-hero flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background glow, consistent with Hero section */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-blue-glow rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <Image
            src="/logo.png"
            alt="Place XP Logo"
            width={44}
            height={44}
            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-semibold text-text-primary tracking-tight">
            Place <span className="text-orange-500">XP</span>
          </span>
        </Link>

        <div className="glass-strong rounded-2xl p-8 md:p-10">
          <h1 className="text-2xl font-bold text-text-primary mb-1 text-center">
            Login / Create Account
          </h1>
          <p className="text-sm text-text-muted text-center mb-8">
            Pick your role below, then log in or create an account.
          </p>
          <AuthForm defaultRole={defaultRole} />
        </div>
      </div>
    </main>
  );
}

function AuthenticationUnavailable() {
  return (
    <main className="min-h-screen gradient-hero flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-blue-glow rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md glass-strong rounded-2xl p-8 md:p-10 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-3">Authentication unavailable</h1>
        <p className="text-sm text-text-muted leading-relaxed mb-6">
          This environment has not been connected to the club&apos;s authentication service yet.
        </p>
        <Link href="/" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
          Return to the homepage
        </Link>
      </div>
    </main>
  );
}
