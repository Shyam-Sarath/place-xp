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
import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('event_date', { ascending: true })
    .limit(3);

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
