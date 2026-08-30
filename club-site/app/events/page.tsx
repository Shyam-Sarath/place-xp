import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import EventsPageClient from './EventsPageClient';

export const metadata = {
  title: 'Events — Place XP',
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('[EventsPage] Error fetching events from Supabase:', error);
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <EventsPageClient events={(data ?? []) as EventRow[]} />
      <Footer />
    </main>
  );
}
