import { createClient } from '@/lib/supabase/server';
import type { Profile, RegistrationWithEvent } from '@/types/database';
import ParticipantsTable from '@/components/admin/ParticipantsTable';

export const metadata = {
  title: 'Participants — Place XP Admin',
};

export default async function AdminParticipantsPage() {
  const supabase = await createClient();

  const [{ data: participants }, { data: registrations }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false }),
    supabase
      .from('registrations')
      .select('*, events(id, slug, title, status, event_date)')
      .order('registered_at', { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Participants</h1>
        <p className="text-sm text-text-muted mt-1">{(participants ?? []).length} registered accounts</p>
      </div>

      <ParticipantsTable
        participants={(participants ?? []) as Profile[]}
        registrations={(registrations ?? []) as RegistrationWithEvent[]}
      />
    </div>
  );
}
