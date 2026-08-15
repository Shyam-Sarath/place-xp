import { Megaphone } from 'lucide-react';
import type { Announcement } from '@/types/database';

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AnnouncementsView({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="text-text-muted">No announcements yet — check back closer to the event.</p>
      </div>
    );
  }

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      {sorted.map((a) => (
        <div key={a.id} className="glass rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <Megaphone className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="text-sm font-semibold text-text-primary">{a.title}</h3>
                <span className="text-xs text-text-muted shrink-0">{formatDateTime(a.created_at)}</span>
              </div>
              {a.content && (
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {a.content}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
