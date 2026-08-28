'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import MagneticButton from '@/components/ui/MagneticButton';
import EventsCarousel from '@/components/events/EventsCarousel';
import type { EventRow } from '@/types/database';

export default function Events({ events }: { events: EventRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper id="events" className="py-32 md:py-40 relative bg-bg-secondary">
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
              Featured Events
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              What&apos;s <span className="text-orange-500">happening</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MagneticButton strength={0.15}>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-default text-sm text-text-secondary hover:text-orange-500 hover:border-orange-500/40 transition-colors group"
              >
                View all events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Events Carousel */}
        {events.length > 0 ? (
          <EventsCarousel events={events} />
        ) : (
          <div className="glass rounded-2xl py-20 text-center">
            <p className="text-text-muted">New events are on the way — check back soon.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
