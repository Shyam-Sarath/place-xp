import { createClient } from '@/lib/supabase/server';
import type { AnnouncementWithEvent, EventRow } from '@/types/database';
import AnnouncementsTable from '@/components/admin/AnnouncementsTable';

export const metadata = {
  title: 'Announcements — Place XP Admin',
};

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const [{ data: announcements }, { data: events }] = await Promise.all([
    supabase
      .from('announcements')
      .select('*, events(id, slug, title)')
      .order('created_at', { ascending: false }),
    supabase.from('events').select('*').order('event_date', { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Announcements</h1>
        <p className="text-sm text-text-muted mt-1">{(announcements ?? []).length} total across all events</p>
      </div>

      <AnnouncementsTable
        announcements={(announcements ?? []) as AnnouncementWithEvent[]}
        events={(events ?? []) as EventRow[]}
      />
    </div>
  );
}
