'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import MagneticButton from '@/components/ui/MagneticButton';

// Editable events data
const events = [
  {
    title: 'Code Sprint 2025',
    date: 'Coming Soon',
    location: 'VIT Chennai Campus',
    category: 'Hackathon',
    description: 'A 24-hour coding marathon where teams build innovative solutions to real-world problems. Open to all years.',
    gradient: 'from-orange-500/20 to-orange-600/5',
    accent: '#F89A4A',
  },
  {
    title: 'Tech Talk Series',
    date: 'Coming Soon',
    location: 'Online + Offline',
    category: 'Workshop',
    description: 'Industry experts share insights on emerging technologies, career paths, and interview strategies.',
    gradient: 'from-blue-500/20 to-blue-600/5',
    accent: '#4E84F5',
  },
  {
    title: 'Mock Interview Drive',
    date: 'Coming Soon',
    location: 'VIT Chennai Campus',
    category: 'Career Prep',
    description: 'Practice with real interview panels. Get feedback on your technical and communication skills.',
    gradient: 'from-green-500/20 to-green-600/5',
    accent: '#2ECC71',
  },
];

export default function Events() {
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
              <a href="#" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors group">
                View all events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.article
              key={event.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="group rounded-2xl overflow-hidden glass hover:border-white/15 transition-all duration-500"
            >
              {/* Event image area — gradient placeholder */}
              <div className={`relative h-48 bg-gradient-to-br ${event.gradient} overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-6xl font-bold opacity-10"
                    style={{ color: event.accent }}
                  >
                    {event.category.charAt(0)}
                  </span>
                </div>
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${event.accent}20`, color: event.accent, border: `1px solid ${event.accent}40` }}
                >
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-white transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-muted pt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
