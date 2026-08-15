'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { EventRow } from '@/types/database';

// Cycles through the brand's existing card accent treatment (see the
// original hardcoded Events.tsx) so real data keeps the same look.
const ACCENTS = [
  { accent: '#F89A4A', gradient: 'from-orange-500/20 to-orange-600/5' },
  { accent: '#4E84F5', gradient: 'from-blue-500/20 to-blue-600/5' },
  { accent: '#2ECC71', gradient: 'from-green-500/20 to-green-600/5' },
];

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Live Now',
  past: 'Completed',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Date TBA';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function EventCard({
  event,
  index = 0,
  href,
}: {
  event: EventRow;
  index?: number;
  href?: string;
}) {
  const { accent, gradient } = ACCENTS[index % ACCENTS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08 }}
      className="group rounded-2xl overflow-hidden glass hover:border-white/15 transition-all duration-500"
    >
      <Link href={href ?? `/events/${event.slug}`}>
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {event.banner_url ? (
            // Supabase Storage URLs are dynamic, so a plain <img> avoids
            // next/image remote-pattern config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.banner_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold opacity-10" style={{ color: accent }}>
                {(event.category ?? event.title).charAt(0)}
              </span>
            </div>
          )}
          <span
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
          >
            {event.category ?? 'Event'}
          </span>
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-white backdrop-blur-sm">
            {STATUS_LABEL[event.status] ?? event.status}
          </span>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-white transition-colors">
            {event.title}
          </h3>
          {event.short_description && (
            <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
              {event.short_description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.event_date)}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {event.venue}
              </span>
            )}
            {event.seats_total != null && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {event.seats_total} seats
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
