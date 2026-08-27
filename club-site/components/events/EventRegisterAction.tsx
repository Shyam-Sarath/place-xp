'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import RegistrationModal from '@/components/events/RegistrationModal';
import type { EventRow, Profile } from '@/types/database';
import { getEventStatus } from '@/lib/eventStatus';

interface Props {
  event: EventRow;
  userId: string;
  userEmail: string;
  profile: Profile | null;
  alreadyRegistered: boolean;
}

export default function EventRegisterAction({ event, userId, userEmail, profile, alreadyRegistered }: Props) {
  const [registered, setRegistered] = useState(alreadyRegistered);
  const [modalOpen, setModalOpen] = useState(false);
  const past = getEventStatus(event) === 'past';

  if (past) {
    return <span className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-bg-elevated text-text-muted text-sm">Registration closed</span>;
  }

  if (registered) {
    return (
      <div className="text-center py-2 space-y-2">
        <span className="inline-flex items-center gap-2 text-sm text-status-success">
          <CheckCircle2 className="w-4 h-4" />
          You&apos;re registered
        </span>
        <Link href={`/dashboard/events/${event.slug}`} className="block text-xs text-orange-500 hover:text-orange-400 transition-colors">
          Open Event Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <MagneticButton strength={0.1} className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full text-center px-5 py-3 rounded-xl gradient-cta text-white text-sm font-medium transition-all duration-300 hover:shadow-orange-glow hover:scale-[1.02]"
        >
          Register
        </button>
      </MagneticButton>

      {modalOpen && (
        <RegistrationModal
          event={event}
          userId={userId}
          userEmail={userEmail}
          profile={profile}
          onClose={() => setModalOpen(false)}
          onRegistered={() => setRegistered(true)}
        />
      )}
    </>
  );
}
