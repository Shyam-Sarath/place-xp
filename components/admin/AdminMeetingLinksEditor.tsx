'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Video } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { MeetingLink } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

export default function AdminMeetingLinksEditor({ eventId, links }: { eventId: string; links: MeetingLink[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('Google Meet');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('meeting_links').insert({
      event_id: eventId,
      title,
      platform,
      url,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTitle('');
    setUrl('');
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('meeting_links').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-2xl border border-border-default p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="text"
            placeholder="Title (e.g. Kickoff Call)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
          />
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClasses}>
            <option>Google Meet</option>
            <option>Zoom</option>
            <option>Microsoft Teams</option>
            <option>Other</option>
          </select>
        </div>
        <input
          required
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={inputClasses}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Link
        </button>
        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      {links.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {links.map((link) => (
            <div key={link.id} className="rounded-2xl border border-border-default p-4 flex items-center gap-3">
              <Video className="w-4 h-4 text-green-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{link.title}</p>
                {link.platform && <p className="text-xs text-text-muted">{link.platform}</p>}
              </div>
              <button
                onClick={() => handleDelete(link.id)}
                disabled={busyId === link.id}
                className="text-text-muted hover:text-status-error transition-colors shrink-0"
              >
                {busyId === link.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
