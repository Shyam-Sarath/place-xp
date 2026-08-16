import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { EventRow, Profile } from '@/types/database';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import MagneticButton from '@/components/ui/MagneticButton';
import EventRegisterAction from '@/components/events/EventRegisterAction';

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Date TBA';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single<EventRow>();

  if (!event) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  let alreadyRegistered = false;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single<Profile>();
    profile = profileData;

    const { data: registrationData } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();
    alreadyRegistered = !!registrationData;
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-32">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-orange-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>

          {/* Banner */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden glass mb-10">
            {event.banner_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.banner_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500/15 to-blue-600/10">
                <span className="text-8xl font-bold opacity-10 text-orange-500">
                  {(event.category ?? event.title).charAt(0)}
                </span>
              </div>
            )}
            {event.category && (
              <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500/20 text-orange-500 border border-orange-500/40">
                {event.category}
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="md:col-span-2 space-y-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {event.title}
                </h1>
                {event.short_description && (
                  <p className="text-text-secondary leading-relaxed">{event.short_description}</p>
                )}
              </div>

              {event.description && (
                <div>
                  <h2 className="text-lg font-semibold text-text-primary mb-3">About the event</h2>
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

              {event.speaker_info && (
                <div>
                  <h2 className="text-lg font-semibold text-text-primary mb-3">Speakers</h2>
                  <p className="text-text-body leading-relaxed whitespace-pre-line">
                    {event.speaker_info}
                  </p>
                </div>
              )}

              {event.rules && (
                <div>
                  <h2 className="text-lg font-semibold text-text-primary mb-3">Rules</h2>
                  <p className="text-text-body leading-relaxed whitespace-pre-line">
                    {event.rules}
                  </p>
                </div>
              )}

              {event.requirements && (
                <div>
                  <h2 className="text-lg font-semibold text-text-primary mb-3">Requirements</h2>
                  <p className="text-text-body leading-relaxed whitespace-pre-line">
                    {event.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="glass-strong rounded-2xl p-6 h-fit space-y-5 sticky top-28">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="text-sm text-text-secondary">{formatDate(event.event_date)}</span>
              </div>
              {event.event_time && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-text-secondary">{event.event_time}</span>
                </div>
              )}
              {event.venue && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-text-secondary">{event.venue}</span>
                </div>
              )}
              {event.seats_total != null && (
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-text-secondary">{event.seats_total} seats</span>
                </div>
              )}

              <div className="pt-2 border-t border-border-divider">
                {user ? (
                  <EventRegisterAction
                    event={event}
                    userId={user.id}
                    userEmail={user.email ?? ''}
                    profile={profile}
                    alreadyRegistered={alreadyRegistered}
                  />
                ) : (
                  <MagneticButton strength={0.1} className="w-full">
                    <Link
                      href="/login?role=participant"
                      className="block w-full text-center px-5 py-3 rounded-xl gradient-cta text-white text-sm font-medium transition-all duration-300 hover:shadow-orange-glow hover:scale-[1.02]"
                    >
                      Log In to Register
                    </Link>
                  </MagneticButton>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
