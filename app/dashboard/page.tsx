import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import EventCard from '@/components/events/EventCard';

export const metadata = {
  title: 'My Events — Place XP',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?role=participant');

  const { data: registrations } = await supabase
    .from('registrations')
    .select('id, registered_at, events(*)')
    .eq('user_id', user.id)
    .order('registered_at', { ascending: false });

  const events = (registrations ?? [])
    .map((r) => r.events)
    .filter(Boolean) as unknown as EventRow[];

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-36 md:pt-44 pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4">
              My Events
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Everything you&apos;re <span className="text-orange-500">registered</span> for
            </h1>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} href={`/dashboard/events/${event.slug}`} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl py-20 text-center space-y-3">
              <p className="text-text-muted">You haven&apos;t registered for any events yet.</p>
              <Link href="/events" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                Browse events
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
