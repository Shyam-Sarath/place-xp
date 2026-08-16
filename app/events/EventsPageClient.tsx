'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { EventRow, EventStatus } from '@/types/database';
import EventCard from '@/components/events/EventCard';

const TABS: { key: EventStatus; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'past', label: 'Past' },
];

export default function EventsPageClient({ events }: { events: EventRow[] }) {
  const [tab, setTab] = useState<EventStatus>('upcoming');

  const filtered = useMemo(() => events.filter((e) => e.status === tab), [events, tab]);

  return (
    <section className="pt-36 md:pt-44 pb-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
          >
            All Events
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Everything <span className="text-orange-500">happening</span> at Place XP
          </motion.h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-border-divider">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                tab === key ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
              {tab === key && (
                <motion.div
                  layoutId="events-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 gradient-cta"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl py-20 text-center">
            <p className="text-text-muted">
              No {tab} events right now — check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
