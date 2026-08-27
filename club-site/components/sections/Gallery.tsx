'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Masonry from '@/components/reactbits/Masonry';

// Gradient placeholders for gallery items — no AI images per user request
const galleryItems = [
  { title: 'Workshop Session', gradient: 'from-blue-600/30 via-blue-800/20 to-bg-card', span: 'col-span-2 row-span-2' },
  { title: 'Hackathon 2024', gradient: 'from-orange-500/25 via-orange-700/15 to-bg-card', span: '' },
  { title: 'Team Building', gradient: 'from-green-500/20 via-green-800/10 to-bg-card', span: '' },
  { title: 'Code Sprint', gradient: 'from-purple-500/25 via-purple-800/15 to-bg-card', span: '' },
  { title: 'Industry Visit', gradient: 'from-blue-400/25 via-blue-700/15 to-bg-card', span: '' },
  { title: 'Award Ceremony', gradient: 'from-orange-400/30 via-orange-600/15 to-bg-card', span: 'col-span-2' },
];

const masonryData = [
  { id: 1, image: '/images/1.jpeg', height: 400 },
  { id: 2, image: '/images/2.jpeg', height: 500 },
  { id: 6, image: '/images/6.jpeg', height: 450 },
  { id: 9, image: '/images/9.jpeg', height: 550 },
  { id: 10, image: '/images/10.jpeg', height: 600},
  { id: 7, image: '/images/7.jpeg', height: 550 },
  { id: 8, image: '/images/8.jpeg', height: 350 },
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper id="gallery" className="py-32 md:py-40 relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/video1.mp4"
        autoPlay
        muted
        loop
        playsInline
/>

<div className="absolute inset-0 bg-black/60" />
      <div className="max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
            >
              Gallery
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Moments that <span className="text-orange-500">define us</span>
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            href="#"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors group"
          >
            View full gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* Gallery Interactive Component */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Masonry data={masonryData} columns={4} gap={20} />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
