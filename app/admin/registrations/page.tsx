import { createClient } from '@/lib/supabase/server';
import type { RegistrationWithEvent, EventRow } from '@/types/database';
import RegistrationsTable from '@/components/admin/RegistrationsTable';

export const metadata = {
  title: 'Registrations — Place XP Admin',
};

export default async function AdminRegistrationsPage() {
  const supabase = await createClient();

  const [{ data: registrations }, { data: events }] = await Promise.all([
    supabase
      .from('registrations')
      .select('*, events(id, slug, title, status, event_date)')
      .order('registered_at', { ascending: false }),
    supabase.from('events').select('*').order('event_date', { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Registrations</h1>
        <p className="text-sm text-text-muted mt-1">{(registrations ?? []).length} total across all events</p>
      </div>

      <RegistrationsTable
        registrations={(registrations ?? []) as RegistrationWithEvent[]}
        events={(events ?? []) as EventRow[]}
      />
    </div>
  );
}
