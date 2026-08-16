'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Megaphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Announcement } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export default function AdminAnnouncementsEditor({
  eventId,
  announcements,
}: {
  eventId: string;
  announcements: Announcement[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...announcements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  async function handlePost(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from('announcements').insert({
      event_id: eventId,
      title,
      content: content || null,
      created_by: user?.id,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTitle('');
    setContent('');
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('announcements').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handlePost} className="rounded-2xl border border-border-default p-5 space-y-3">
        <input
          required
          type="text"
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
        />
        <textarea
          placeholder="Details (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${inputClasses} min-h-[80px] resize-y`}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Post Announcement
        </button>
        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      {sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border-default p-5 flex items-start gap-3">
              <Megaphone className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-medium text-text-primary">{a.title}</h3>
                  <span className="text-xs text-text-muted shrink-0">{formatDateTime(a.created_at)}</span>
                </div>
                {a.content && <p className="text-sm text-text-secondary mt-1 whitespace-pre-line">{a.content}</p>}
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={busyId === a.id}
                className="text-text-muted hover:text-status-error transition-colors shrink-0"
              >
                {busyId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
