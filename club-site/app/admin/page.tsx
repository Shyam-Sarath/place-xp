import Link from 'next/link';
import { CalendarDays, Users, TrendingUp, ClipboardList, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { EventRow, RegistrationWithEvent } from '@/types/database';

export const metadata = {
  title: 'Admin Dashboard — Place XP',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: events }, { count: registrationCount }, { count: participantCount }, { data: recentRegistrations }] =
    await Promise.all([
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('registrations').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabase
        .from('registrations')
        .select('*, events(id, slug, title, status, event_date)')
        .order('registered_at', { ascending: false })
        .limit(5),
    ]);

  const allEvents = (events ?? []) as EventRow[];
  const upcomingCount = allEvents.filter((e) => e.status === 'upcoming' && !e.archived).length;
  const recent = allEvents.slice(0, 5);
  const recentRegs = (recentRegistrations ?? []) as RegistrationWithEvent[];

  const stats = [
    { label: 'Total Events', value: allEvents.length, icon: CalendarDays },
    { label: 'Upcoming', value: upcomingCount, icon: TrendingUp },
    { label: 'Total Participants', value: participantCount ?? 0, icon: Users },
    { label: 'Total Registrations', value: registrationCount ?? 0, icon: ClipboardList },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Overview of everything happening at Place XP.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border-default bg-bg-elevated/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-text-muted">{label}</span>
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-2xl font-semibold text-text-primary">{value}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-text-primary">Recent Events</h2>
            <Link href="/admin/events" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
              View all
            </Link>
          </div>

          {recent.length > 0 ? (
            <div className="rounded-2xl border border-border-default overflow-hidden">
              {recent.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.slug}/edit`}
                  className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border-divider last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {event.status}
                      {!event.published && ' · draft'}
                      {event.archived && ' · archived'}
                    </p>
                  </div>
                  <span className="text-xs text-orange-500 shrink-0">Manage →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-default py-16 text-center">
              <p className="text-sm text-text-muted">No events yet — create your first one.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-text-primary">Recent Registrations</h2>
            <Link href="/admin/registrations" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
              View all
            </Link>
          </div>

          {recentRegs.length > 0 ? (
            <div className="rounded-2xl border border-border-default overflow-hidden">
              {recentRegs.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border-divider last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{r.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{r.events?.title ?? 'Deleted event'}</p>
                  </div>
                  <span className="text-xs text-text-muted shrink-0">{formatDate(r.registered_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-default py-16 text-center">
              <p className="text-sm text-text-muted">No registrations yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
