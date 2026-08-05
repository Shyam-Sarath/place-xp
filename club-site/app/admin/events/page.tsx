import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';

export const metadata = {
  title: 'Manage Events — Place XP Admin',
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  ongoing: 'bg-status-success/15 text-status-success border-status-success/30',
  past: 'bg-bg-elevated text-text-muted border-border-default',
};

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: regs } = await supabase.from('registrations').select('event_id');
  const countMap = new Map<string, number>();
  (regs ?? []).forEach((r) => countMap.set(r.event_id, (countMap.get(r.event_id) ?? 0) + 1));

  const allEvents = (events ?? []) as EventRow[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Events</h1>
          <p className="text-sm text-text-muted mt-1">{allEvents.length} total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {allEvents.length > 0 ? (
        <div className="rounded-2xl border border-border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-divider text-left text-xs text-text-muted">
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Visibility</th>
                <th className="px-5 py-3 font-medium">Registered</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map((event) => (
                <tr key={event.id} className="border-b border-border-divider last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/events/${event.slug}/edit`} className="font-medium text-text-primary hover:text-orange-500 transition-colors">
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${STATUS_COLORS[event.status] ?? ''}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-text-muted">
                    {event.archived ? 'Archived' : event.published ? 'Published' : 'Draft'}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{countMap.get(event.id) ?? 0}</td>
                  <td className="px-5 py-4 text-text-muted text-xs">
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-default py-16 text-center">
          <p className="text-sm text-text-muted">No events yet — create your first one.</p>
        </div>
      )}
    </div>
  );
}
