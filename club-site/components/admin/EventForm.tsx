'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Archive, ArchiveRestore, Eye, EyeOff, Copy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import MagneticButton from '@/components/ui/MagneticButton';
import FileUploadInput from '@/components/admin/FileUploadInput';
import type { EventRow } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';
const textareaClasses = `${inputClasses} resize-y min-h-[90px]`;
const labelClasses = 'block text-xs font-medium text-text-muted mb-1.5';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function EventForm({ event }: { event?: EventRow }) {
  const router = useRouter();
  const isEdit = !!event;

  const [loading, setLoading] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(event?.title ?? '');
  const [slug, setSlug] = useState(event?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState(event?.category ?? '');
  const [shortDescription, setShortDescription] = useState(event?.short_description ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [objectives, setObjectives] = useState(event?.objectives ?? '');
  const [speakerInfo, setSpeakerInfo] = useState(event?.speaker_info ?? '');
  const [venue, setVenue] = useState(event?.venue ?? '');
  const [eventDate, setEventDate] = useState(event?.event_date ?? '');
  const [eventTime, setEventTime] = useState(event?.event_time ?? '');
  const [registrationDeadline, setRegistrationDeadline] = useState(
    event?.registration_deadline ? event.registration_deadline.slice(0, 16) : ''
  );
  const [seatsTotal, setSeatsTotal] = useState(event?.seats_total?.toString() ?? '');
  const [bannerUrl, setBannerUrl] = useState<string | null>(event?.banner_url ?? null);
  const [rules, setRules] = useState(event?.rules ?? '');
  const [requirements, setRequirements] = useState(event?.requirements ?? '');
  const [status, setStatus] = useState(event?.status ?? 'upcoming');

  function buildPayload() {
    return {
      title,
      slug,
      category: category || null,
      short_description: shortDescription || null,
      description: description || null,
      objectives: objectives || null,
      speaker_info: speakerInfo || null,
      venue: venue || null,
      event_date: eventDate || null,
      event_time: eventTime || null,
      registration_deadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : null,
      seats_total: seatsTotal ? parseInt(seatsTotal, 10) : null,
      banner_url: bannerUrl,
      rules: rules || null,
      requirements: requirements || null,
      status,
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    if (isEdit) {
      const { error: updateError } = await supabase.from('events').update(buildPayload()).eq('id', event.id);
      setLoading(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      router.push(`/admin/events/${slug}/edit`);
      router.refresh();
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: created, error: insertError } = await supabase
        .from('events')
        .insert({ ...buildPayload(), created_by: user?.id })
        .select()
        .single();
      setLoading(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
      router.push(`/admin/events/${created.slug}/edit`);
    }
  }

  async function handleDelete() {
    if (!event) return;
    if (!confirm(`Permanently delete "${event.title}"? This can't be undone.`)) return;
    setBusyAction('delete');
    const supabase = createClient();
    const { error: deleteError } = await supabase.from('events').delete().eq('id', event.id);
    setBusyAction(null);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push('/admin/events');
  }

  async function handleTogglePublished() {
    if (!event) return;
    setBusyAction('publish');
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('events')
      .update({ published: !event.published })
      .eq('id', event.id);
    setBusyAction(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
  }

  async function handleToggleArchived() {
    if (!event) return;
    setBusyAction('archive');
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('events')
      .update({ archived: !event.archived })
      .eq('id', event.id);
    setBusyAction(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
  }

  async function handleDuplicate() {
    if (!event) return;
    setBusyAction('duplicate');
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let newSlug = `${event.slug}-copy`;
    let attempt = 1;
    // Keep trying until we find a free slug (cheap client-side approach for a small events table).
    while (true) {
      const { data: existing } = await supabase.from('events').select('id').eq('slug', newSlug).maybeSingle();
      if (!existing) break;
      attempt += 1;
      newSlug = `${event.slug}-copy-${attempt}`;
    }

    const { id, created_at, ...rest } = event;
    void id;
    void created_at;

    const { data: created, error: dupError } = await supabase
      .from('events')
      .insert({ ...rest, slug: newSlug, title: `${event.title} (Copy)`, published: false, created_by: user?.id })
      .select()
      .single();

    setBusyAction(null);
    if (dupError) {
      setError(dupError.message);
      return;
    }
    router.push(`/admin/events/${created.slug}/edit`);
  }

  return (
    <div className="max-w-3xl">
      {isEdit && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={handleTogglePublished}
            disabled={busyAction !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-elevated/50 border border-border-default text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-60"
          >
            {busyAction === 'publish' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : event.published ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {event.published ? 'Unpublish' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={handleToggleArchived}
            disabled={busyAction !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-elevated/50 border border-border-default text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-60"
          >
            {busyAction === 'archive' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : event.archived ? (
              <ArchiveRestore className="w-3.5 h-3.5" />
            ) : (
              <Archive className="w-3.5 h-3.5" />
            )}
            {event.archived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            type="button"
            onClick={handleDuplicate}
            disabled={busyAction !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-elevated/50 border border-border-default text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-60"
          >
            {busyAction === 'duplicate' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
            Duplicate
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busyAction !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-status-error/10 border border-status-error/30 text-xs text-status-error hover:bg-status-error/20 transition-colors disabled:opacity-60 ml-auto"
          >
            {busyAction === 'delete' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClasses}>Event Name</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>URL slug</label>
          <input
            required
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            className={inputClasses}
          />
          <p className="text-xs text-text-muted mt-1">/events/{slug || 'your-slug'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Category</label>
            <input
              type="text"
              placeholder="Hackathon, Workshop..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputClasses}>
              <option value="upcoming">Upcoming (automated)</option><option value="ongoing">Ongoing</option><option value="past">Past Event</option>
            </select>
            <p className="text-xs text-text-muted mt-1">Upcoming changes to Ongoing after the deadline and Past after the event date.</p>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Short description</label>
          <input
            type="text"
            placeholder="One line shown on event cards"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Banner Image</label>
          <FileUploadInput
            bucket="event-banners"
            folder={slug || 'unsorted'}
            value={bannerUrl}
            onChange={setBannerUrl}
            accept="image/*"
          />
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={textareaClasses} />
        </div>

        <div>
          <label className={labelClasses}>Objectives</label>
          <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} className={textareaClasses} />
        </div>

        <div>
          <label className={labelClasses}>Speaker info</label>
          <textarea value={speakerInfo} onChange={(e) => setSpeakerInfo(e.target.value)} className={textareaClasses} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Venue</label>
            <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Time</label>
            <input
              type="text"
              placeholder="10:00 AM - 4:00 PM"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Date</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Registration deadline</label>
            <input
              type="datetime-local"
              value={registrationDeadline}
              onChange={(e) => setRegistrationDeadline(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Max participants</label>
          <input
            type="number"
            min={0}
            value={seatsTotal}
            onChange={(e) => setSeatsTotal(e.target.value)}
            className={`${inputClasses} max-w-[160px]`}
          />
        </div>

        <div>
          <label className={labelClasses}>Rules</label>
          <textarea value={rules} onChange={(e) => setRules(e.target.value)} className={textareaClasses} />
        </div>

        <div>
          <label className={labelClasses}>Requirements</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className={textareaClasses} />
        </div>

        {error && <p className="text-sm text-status-error">{error}</p>}

        <MagneticButton strength={0.1}>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-cta text-white text-sm font-medium transition-all duration-300 hover:shadow-orange-glow disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Event'}
          </button>
        </MagneticButton>
      </form>
    </div>
  );
}
