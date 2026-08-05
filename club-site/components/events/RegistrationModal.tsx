'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import MagneticButton from '@/components/ui/MagneticButton';
import type { EventRow, Profile } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

interface Props {
  event: EventRow;
  userId: string;
  userEmail: string;
  profile: Profile | null;
  onClose: () => void;
  onRegistered: () => void;
}

export default function RegistrationModal({ event, userId, userEmail, profile, onClose, onRegistered }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [regNo, setRegNo] = useState(profile?.reg_no ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [department, setDepartment] = useState(profile?.department ?? '');
  const [year, setYear] = useState(profile?.year ?? '');
  const [section, setSection] = useState(profile?.section ?? '');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from('registrations').insert({
      event_id: event.id,
      user_id: userId,
      full_name: fullName,
      reg_no: regNo,
      email: userEmail,
      phone,
      department,
      year,
      section,
    });

    setLoading(false);

    if (insertError) {
      if (insertError.code === '23505') {
        setError('You\'re already registered for this event.');
      } else {
        setError(insertError.message);
      }
      return;
    }

    setDone(true);
    onRegistered();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {done ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-status-success mx-auto" />
              <h3 className="text-xl font-semibold text-text-primary">Successfully Registered!</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                You can now access your Event Dashboard, where updates, resources and
                announcements for <span className="text-text-secondary">{event.title}</span> will
                show up.
              </p>
              <MagneticButton strength={0.1} className="w-full pt-2">
                <a
                  href={`/dashboard/events/${event.slug}`}
                  className="block w-full text-center px-5 py-3 rounded-xl gradient-cta text-white text-sm font-medium transition-all duration-300 hover:shadow-orange-glow"
                >
                  Go to Event Dashboard
                </a>
              </MagneticButton>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-text-primary mb-1">Register</h3>
              <p className="text-sm text-text-muted mb-6">{event.title}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClasses}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="Reg. number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" disabled>Year</option>
                    <option value="1">I</option>
                    <option value="2">II</option>
                    <option value="3">III</option>
                    <option value="4">IV</option>
                  </select>
                  <input
                    required
                    type="text"
                    placeholder="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Dept."
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <input
                  disabled
                  type="email"
                  value={userEmail}
                  className={`${inputClasses} opacity-60`}
                />

                {error && <p className="text-sm text-status-error">{error}</p>}

                <MagneticButton strength={0.1} className="w-full">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl gradient-cta text-white text-sm font-medium transition-all duration-300 hover:shadow-orange-glow disabled:opacity-60"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirm Registration
                  </button>
                </MagneticButton>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
