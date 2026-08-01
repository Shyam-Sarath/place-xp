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

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Impact />
      <WhyJoin />
      <Events />
      <Recruitment />
      <Gallery />
      <Team />
      <Footer />
    </main>
  );
}
