'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type {
  EventRow,
  EventTimelineStep,
  Announcement,
  Resource,
  MeetingLink,
  FAQ,
  EventOrganizer,
} from '@/types/database';
import TimelineView from '@/components/dashboard/TimelineView';
import AnnouncementsView from '@/components/dashboard/AnnouncementsView';
import ResourcesView from '@/components/dashboard/ResourcesView';
import MeetingLinksView from '@/components/dashboard/MeetingLinksView';
import FAQsView from '@/components/dashboard/FAQsView';
import OrganizersView from '@/components/dashboard/OrganizersView';

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'Registration Open',
  ongoing: 'Live Now',
  past: 'Completed',
};

interface Props {
  event: EventRow;
  timeline: EventTimelineStep[];
  announcements: Announcement[];
  resources: Resource[];
  meetingLinks: MeetingLink[];
  faqs: FAQ[];
  organizers: EventOrganizer[];
}

export default function EventDashboardClient({
  event,
  timeline,
  announcements,
  resources,
  meetingLinks,
  faqs,
  organizers,
}: Props) {
  const tabs: {
    key: 'overview' | 'timeline' | 'announcements' | 'resources' | 'meeting' | 'faqs' | 'organizers';
    label: string;
    count?: number;
  }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'announcements', label: 'Announcements', count: announcements.length },
    { key: 'resources', label: 'Resources', count: resources.length },
    { key: 'meeting', label: 'Meeting Links', count: meetingLinks.length },
    { key: 'faqs', label: 'FAQs', count: faqs.length },
    { key: 'organizers', label: 'Organizers', count: organizers.length },
  ];

  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('overview');

  return (
    <section className="pt-36 md:pt-44 pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-500 border border-orange-500/30 mb-4">
            {STATUS_LABEL[event.status] ?? event.status}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted">
            {event.event_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(event.event_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
            {event.event_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {event.event_time}
              </span>
            )}
            {event.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.venue}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border-divider overflow-x-auto">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                tab === key ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
              {typeof count === 'number' && count > 0 && (
                <span className="ml-1.5 text-xs text-orange-500">{count}</span>
              )}
              {tab === key && (
                <motion.div
                  layoutId="dashboard-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 gradient-cta"
                />
              )}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {event.short_description && (
              <p className="text-text-secondary leading-relaxed">{event.short_description}</p>
            )}
            {event.description && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-3">About</h2>
                <p className="text-text-body leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}
            {event.objectives && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-3">Objectives</h2>
                <p className="text-text-body leading-relaxed whitespace-pre-line">
                  {event.objectives}
                </p>
              </div>
            )}
            {!event.short_description && !event.description && !event.objectives && (
              <div className="glass rounded-2xl py-16 text-center">
                <p className="text-text-muted">No overview details added yet.</p>
              </div>
            )}
          </div>
        )}
        {tab === 'timeline' && <TimelineView steps={timeline} />}
        {tab === 'announcements' && <AnnouncementsView announcements={announcements} />}
        {tab === 'resources' && <ResourcesView resources={resources} />}
        {tab === 'meeting' && <MeetingLinksView links={meetingLinks} />}
        {tab === 'faqs' && <FAQsView faqs={faqs} />}
        {tab === 'organizers' && <OrganizersView organizers={organizers} />}
      </div>
    </section>
  );
}
