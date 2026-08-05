'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import type {
  EventRow,
  EventTimelineStep,
  Announcement,
  Resource,
  MeetingLink,
  FAQ,
  EventOrganizer,
} from '@/types/database';
import EventForm from '@/components/admin/EventForm';
import AdminTimelineEditor from '@/components/admin/AdminTimelineEditor';
import AdminAnnouncementsEditor from '@/components/admin/AdminAnnouncementsEditor';
import AdminResourcesEditor from '@/components/admin/AdminResourcesEditor';
import AdminMeetingLinksEditor from '@/components/admin/AdminMeetingLinksEditor';
import AdminFAQsEditor from '@/components/admin/AdminFAQsEditor';
import AdminOrganizersEditor from '@/components/admin/AdminOrganizersEditor';

interface Props {
  event: EventRow;
  timeline: EventTimelineStep[];
  announcements: Announcement[];
  resources: Resource[];
  meetingLinks: MeetingLink[];
  faqs: FAQ[];
  organizers: EventOrganizer[];
}

export default function AdminEventEditorClient({
  event,
  timeline,
  announcements,
  resources,
  meetingLinks,
  faqs,
  organizers,
}: Props) {
  const tabs: { key: string; label: string; count?: number }[] = [
    { key: 'details', label: 'Details' },
    { key: 'timeline', label: 'Timeline', count: timeline.length },
    { key: 'announcements', label: 'Announcements', count: announcements.length },
    { key: 'resources', label: 'Resources', count: resources.length },
    { key: 'meeting', label: 'Meeting Links', count: meetingLinks.length },
    { key: 'faqs', label: 'FAQs', count: faqs.length },
    { key: 'organizers', label: 'Organizers', count: organizers.length },
  ];

  const [tab, setTab] = useState('details');

  return (
    <div>
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
            {typeof count === 'number' && count > 0 && <span className="ml-1.5 text-xs text-orange-500">{count}</span>}
            {tab === key && (
              <motion.div layoutId="admin-editor-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 gradient-cta" />
            )}
          </button>
        ))}
      </div>

      {tab === 'details' && <EventForm event={event} />}
      {tab === 'timeline' && <AdminTimelineEditor eventId={event.id} steps={timeline} />}
      {tab === 'announcements' && <AdminAnnouncementsEditor eventId={event.id} announcements={announcements} />}
      {tab === 'resources' && <AdminResourcesEditor eventId={event.id} resources={resources} />}
      {tab === 'meeting' && <AdminMeetingLinksEditor eventId={event.id} links={meetingLinks} />}
      {tab === 'faqs' && <AdminFAQsEditor eventId={event.id} faqs={faqs} />}
      {tab === 'organizers' && <AdminOrganizersEditor eventId={event.id} organizers={organizers} />}
    </div>
  );
}
