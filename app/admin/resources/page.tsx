import { createClient } from '@/lib/supabase/server';
import type { EventRow, ResourceWithEvent } from '@/types/database';
import ResourcesTable from '@/components/admin/ResourcesTable';

export const metadata = {
  title: 'Resources — Place XP Admin',
};

export default async function AdminResourcesPage() {
  const supabase = await createClient();

  const [{ data: resources }, { data: events }] = await Promise.all([
    supabase
      .from('resources')
      .select('*, events(id, slug, title)')
      .order('uploaded_at', { ascending: false }),
    supabase.from('events').select('*').order('event_date', { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Resources</h1>
        <p className="text-sm text-text-muted mt-1">{(resources ?? []).length} uploaded across all events</p>
      </div>

      <ResourcesTable
        resources={(resources ?? []) as ResourceWithEvent[]}
        events={(events ?? []) as EventRow[]}
      />
    </div>
  );
}
