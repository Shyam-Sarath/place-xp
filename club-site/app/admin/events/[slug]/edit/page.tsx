import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  EventRow,
  EventTimelineStep,
  Announcement,
  Resource,
  MeetingLink,
  FAQ,
  EventOrganizer,
} from '@/types/database';
import AdminEventEditorClient from './AdminEventEditorClient';

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single<EventRow>();

  if (!event) notFound();

  const [{ data: timeline }, { data: announcements }, { data: resources }, { data: meetingLinks }, { data: faqs }, { data: organizers }] =
    await Promise.all([
      supabase.from('event_timeline').select('*').eq('event_id', event.id),
      supabase.from('announcements').select('*').eq('event_id', event.id),
      supabase.from('resources').select('*').eq('event_id', event.id),
      supabase.from('meeting_links').select('*').eq('event_id', event.id),
      supabase.from('faqs').select('*').eq('event_id', event.id),
      supabase.from('event_organizers').select('*').eq('event_id', event.id),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">{event.title}</h1>
      <AdminEventEditorClient
        event={event}
        timeline={(timeline ?? []) as EventTimelineStep[]}
        announcements={(announcements ?? []) as Announcement[]}
        resources={(resources ?? []) as Resource[]}
        meetingLinks={(meetingLinks ?? []) as MeetingLink[]}
        faqs={(faqs ?? []) as FAQ[]}
        organizers={(organizers ?? []) as EventOrganizer[]}
      />
    </div>
  );
}
