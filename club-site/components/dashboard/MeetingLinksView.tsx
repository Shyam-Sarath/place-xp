import { Video } from 'lucide-react';
import type { MeetingLink } from '@/types/database';

export default function MeetingLinksView({ links }: { links: MeetingLink[] }) {
  if (links.length === 0) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="text-text-muted">No meeting links posted yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {links.map((link) => (
        <div key={link.id} className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{link.title}</p>
            {link.platform && <p className="text-xs text-text-muted">{link.platform}</p>}
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg gradient-cta text-white text-xs font-medium shrink-0 hover:shadow-orange-glow transition-all duration-300"
          >
            Join
          </a>
        </div>
      ))}
    </div>
  );
}
