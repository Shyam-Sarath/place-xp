'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Megaphone, Pencil, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { AnnouncementWithEvent, EventRow } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

export default function AnnouncementsTable({
  announcements,
  events,
}: {
  announcements: AnnouncementWithEvent[];
  events: EventRow[];
}) {
  const router = useRouter();
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setEventId('');
    setTitle('');
    setContent('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!eventId || !title.trim()) {
      setError('Select an event and add a title.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const payload = {
      event_id: eventId,
      title: title.trim(),
      content: content.trim() || null,
    };

    if (editingId) {
      const { error: updateError } = await supabase.from('announcements').update(payload).eq('id', editingId);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('announcements').insert(payload);
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return;

    setBusyId(id);
    const supabase = createClient();
    await supabase.from('announcements').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  function handleEdit(item: AnnouncementWithEvent) {
    setEditingId(item.id);
    setEventId(item.event_id);
    setTitle(item.title);
    setContent(item.content ?? '');
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border-default p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className={`${inputClasses} appearance-none`}
            required
          >
            <option value="">Select event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <textarea
          placeholder="Announcement details"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${inputClasses} min-h-[110px] resize-y`}
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingId ? 'Save changes' : 'Create announcement'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      <div className="rounded-2xl border border-border-default overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-divider text-left text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Posted</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length > 0 ? (
              announcements.map((item) => (
                <tr key={item.id} className="border-b border-border-divider last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-4 text-text-secondary">{item.events?.title ?? 'Deleted event'}</td>
                  <td className="px-5 py-4 min-w-[220px]">
                    <div className="flex items-start gap-2">
                      <Megaphone className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-text-primary">{item.title}</p>
                        {item.content && <p className="text-xs text-text-muted mt-1 whitespace-pre-line">{item.content}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-muted whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="text-text-muted hover:text-text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={busyId === item.id}
                        className="text-text-muted hover:text-status-error transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {busyId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-text-muted">
                  No announcements yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
