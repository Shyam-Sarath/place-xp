import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Impact from '@/components/sections/Impact';
import WhyJoin from '@/components/sections/WhyJoin';
import Events from '@/components/sections/Events';
import Recruitment from '@/components/sections/Recruitment';
import Gallery from '@/components/sections/Gallery';
import Team from '@/components/sections/Team';
import Footer from '@/components/sections/Footer';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';

export default async function Home() {
  let data: EventRow[] = [];
  try {
    if (!isSupabaseConfigured()) {
      return renderHome(data);
    }
    const supabase = await createClient();
    const { data: eventsData, error } = await supabase.from('events').select('*');
    if (!error && eventsData) {
      // Active (upcoming/ongoing) events first, soonest first; past events
      // last, most-recently-happened first.
      data = [...(eventsData as EventRow[])].sort((a, b) => {
        const aPast = a.status === 'past';
        const bPast = b.status === 'past';
        if (aPast !== bPast) return aPast ? 1 : -1;
        const aTime = a.event_date ? new Date(a.event_date).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.event_date ? new Date(b.event_date).getTime() : Number.POSITIVE_INFINITY;
        return aPast ? bTime - aTime : aTime - bTime;
      });
    }
  } catch (err) {
    console.warn('Supabase is not configured or could not be reached. Local fallback to empty events list.', err);
  }

  return renderHome(data);
}

function renderHome(data: EventRow[]) {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Impact />
      <WhyJoin />
      <Events events={(data ?? []) as EventRow[]} />
      <Recruitment />
      <Gallery />
      <Team />
      <Footer />
    </main>
  );
}
