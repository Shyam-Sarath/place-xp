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
    const { data: eventsData, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true })
      .limit(3);
    if (!error && eventsData) {
      data = eventsData as EventRow[];
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
