import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  EventRow,
  EventTimelineStep,
  Announcement,
  Resource,
  MeetingLink,
  FAQ,
  EventOrganizer,
  Profile,
} from '@/types/database';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import EventDashboardClient from './EventDashboardClient';

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?role=participant');

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single<EventRow>();

  if (!event) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  const isStaff = profile?.role === 'organizer' || profile?.role === 'admin';

  if (!isStaff) {
    const { data: registration } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!registration) redirect(`/events/${slug}`);
  }

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
    <main className="relative min-h-screen">
      <Navbar />
      <EventDashboardClient
        event={event}
        userId={user.id}
        timeline={(timeline ?? []) as EventTimelineStep[]}
        announcements={(announcements ?? []) as Announcement[]}
        resources={(resources ?? []) as Resource[]}
        meetingLinks={(meetingLinks ?? []) as MeetingLink[]}
        faqs={(faqs ?? []) as FAQ[]}
        organizers={(organizers ?? []) as EventOrganizer[]}
      />
      <Footer />
    </main>
  );
}