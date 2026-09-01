import type { EventRow, EventStatus } from '@/types/database';

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  past: 'Past Event',
};

/**
 * Derives an event's status purely from its dates, so it's always accurate
 * without an admin ever having to flip a status field by hand:
 *
 *  - upcoming: registration is still open (deadline hasn't passed yet)
 *  - ongoing:  registration has closed but the event itself hasn't happened yet
 *  - past:     the event date has passed
 *
 * Falls back to the event date when no registration deadline is set, and
 * defaults to "upcoming" when neither date is set yet (e.g. a draft).
 */
export function getEventStatus(
  event: Pick<EventRow, 'event_date' | 'registration_deadline'> & { status?: EventStatus },
  now: Date = new Date()
): EventStatus {
  // Manually selected ongoing/past statuses are authoritative. Upcoming is
  // the only status that follows the deadline/date automation.
  if (event.status === 'past') return 'past';
  if (event.status === 'ongoing' && (!event.event_date || now < new Date(event.event_date))) return 'ongoing';
  const eventDate = event.event_date ? new Date(event.event_date) : null;
  if (eventDate && now >= eventDate) return 'past';

  const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
  const effectiveDeadline = deadline ?? eventDate;
  if (effectiveDeadline && now >= effectiveDeadline) return 'ongoing';

  return 'upcoming';
}

/**
 * Sorts events with the "active" ones (upcoming/ongoing) first — soonest
 * first — followed by past events, most recently happened first.
 */
export function sortEventsByStatus<T extends Pick<EventRow, 'event_date' | 'registration_deadline'>>(
  events: T[],
  now: Date = new Date()
): T[] {
  return [...events].sort((a, b) => {
    const isPastA = getEventStatus(a, now) === 'past';
    const isPastB = getEventStatus(b, now) === 'past';
    if (isPastA !== isPastB) return isPastA ? 1 : -1;

    const dateA = a.event_date ? new Date(a.event_date).getTime() : Number.POSITIVE_INFINITY;
    const dateB = b.event_date ? new Date(b.event_date).getTime() : Number.POSITIVE_INFINITY;
    return isPastA ? dateB - dateA : dateA - dateB;
  });
}
