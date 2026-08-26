import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import GalleryPageClient from './GalleryPageClient';

export const metadata = {
  title: 'Gallery — Place XP',
  description: 'Explore snaps and memories from our workshops, hackathons, orientations, and collaborative sprints.',
};

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <GalleryPageClient />
      <Footer />
    </main>
  );
}
