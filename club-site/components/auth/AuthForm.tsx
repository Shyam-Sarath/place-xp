'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Loader2, Mail, Lock, User, Hash, GraduationCap, Users, Phone, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import MagneticButton from '@/components/ui/MagneticButton';

const VIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/i;

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-3 pl-11 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

type Mode = 'login' | 'signup';
export type AuthRole = 'participant' | 'admin';

interface AuthFormProps {
  /** Which tab is active on first render — 'participant' unless the page
   *  was reached via a role-specific link (e.g. ?role=admin). The person
   *  can still switch tabs freely from here. */
  defaultRole?: AuthRole;
}

export default function AuthForm({ defaultRole = 'participant' }: AuthFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<AuthRole>(defaultRole);
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInbox, setCheckInbox] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [phone, setPhone] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!VIT_EMAIL_REGEX.test(email)) {
      setError('Please use your VIT student email (e.g. name2024@vitstudent.ac.in).');
      return;
    }

    const supabase = createClient();
    setLoading(true);

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            reg_no: regNo,
            department,
            year,
            section,
            phone,
            // Only used to pick which confirmation-email wording to show
            // below. Has no effect on the account's actual role — that's
            // decided server-side by handle_new_user() checking
            // admin_allowlist (see step11-admin-allowlist.sql), not by
            // anything sent from the browser.
            signup_intent: role,
          },
        },
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // If email confirmation is on (Supabase default), there's no session yet.
      if (!data.session) {
        setCheckInbox(true);
        return;
      }

      if (role === 'admin') {
        // Most signups land here as 'student' and need an existing admin
        // to promote them — but an allowlisted email is granted 'admin'
        // by the trigger immediately, so check what actually happened
        // rather than assuming.
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        if (profile?.role === 'organizer' || profile?.role === 'admin') {
          router.push('/admin');
          router.refresh();
          return;
        }

        setPendingApproval(true);
        return;
      }

      router.push('/');
      router.refresh();
      return;
    }

    const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', signInData.user.id)
      .single();

    const isStaff = profile?.role === 'organizer' || profile?.role === 'admin';

    // Admins and Participants have completely separate dashboards — an
    // account without staff access can't log in through the Admin page.
    if (role === 'admin' && !isStaff) {
      await supabase.auth.signOut();
      setLoading(false);
      setError('This account doesn\u2019t have Admin access. Switch to the Participant tab above.');
      return;
    }

    setLoading(false);
    router.push(role === 'admin' ? '/admin' : '/');
    router.refresh();
  }

  if (checkInbox) {
    return (
      <div className="text-center space-y-3 py-6">
        <h3 className="text-xl font-semibold text-text-primary">Check your inbox</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          We&apos;ve sent a confirmation link to <span className="text-orange-500">{email}</span>.
          Click it, then come back here and log in.
          {role === 'admin' &&
            ' If your email wasn\u2019t pre-approved for Admin access, an existing admin will still need to grant it before you can use the dashboard.'}
        </p>
        <button
          onClick={() => {
            setCheckInbox(false);
            setMode('login');
          }}
          className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
        >
          Back to login
        </button>
      </div>
    );
  }

  if (pendingApproval) {
    return (
      <div className="text-center space-y-3 py-6">
        <h3 className="text-xl font-semibold text-text-primary">Account created</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          An existing admin needs to grant you Admin access before you can use the dashboard.
          You can browse and register for events as a participant in the meantime.
        </p>
        <Link href="/" className="inline-block text-sm text-orange-500 hover:text-orange-400 transition-colors">
          Go to homepage
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Role Tabs — Participant vs Admin */}
      <div className="flex rounded-xl bg-bg-elevated/50 border border-border-default p-1 mb-3">
        {(
          [
            { value: 'participant' as AuthRole, label: 'Participant', icon: GraduationCap },
            { value: 'admin' as AuthRole, label: 'Admin', icon: ShieldCheck },
          ]
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setRole(value);
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              role === value
                ? 'bg-bg-primary text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-bg-elevated/50 border border-border-default p-1 mb-8">
        {(['login', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === m
                ? 'gradient-cta text-white shadow-orange-glow'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {m === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                required
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  required
                  type="text"
                  placeholder="Reg. number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  required
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="relative col-span-1">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={`${inputClasses} appearance-none pl-11`}
                >
                  <option value="" disabled>Year</option>
                  <option value="1">I</option>
                  <option value="2">II</option>
                  <option value="3">III</option>
                  <option value="4">IV</option>
                </select>
              </div>
              <div className="relative col-span-1">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  required
                  type="text"
                  placeholder="Section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className={`${inputClasses} pl-11`}
                />
              </div>
              <div className="relative col-span-1">
                <input
                  required
                  type="text"
                  placeholder="Dept."
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors"
                />
              </div>
            </div>
          </>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            required
            type="email"
            placeholder="name2024@vitstudent.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            required
            type="password"
            placeholder="Password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-status-error"
          >
            {error}
          </motion.p>
        )}

        <MagneticButton strength={0.1} className="w-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl gradient-cta text-white text-sm font-medium transition-all duration-300 hover:shadow-orange-glow hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </MagneticButton>

        <p className="text-xs text-text-muted text-center pt-1">
          Only @vitstudent.ac.in emails can register.
        </p>
      </form>
    </div>
  );
}
