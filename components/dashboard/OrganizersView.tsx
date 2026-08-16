import { Mail, Phone, Link2, User } from 'lucide-react';
import type { EventOrganizer } from '@/types/database';

export default function OrganizersView({ organizers }: { organizers: EventOrganizer[] }) {
  if (organizers.length === 0) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="text-text-muted">Organizer contacts haven&apos;t been added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {organizers.map((o) => (
        <div key={o.id} className="glass rounded-2xl p-5 flex items-center gap-4">
          {o.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={o.photo_url}
              alt={o.name}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-orange-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">{o.name}</p>
            {o.position && <p className="text-xs text-text-muted mb-1.5">{o.position}</p>}
            <div className="flex items-center gap-3">
              {o.email && (
                <a href={`mailto:${o.email}`} className="text-text-muted hover:text-orange-500 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {o.phone && (
                <a href={`tel:${o.phone}`} className="text-text-muted hover:text-orange-500 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              {o.linkedin && (
                <a href={o.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-orange-500 transition-colors">
                  <Link2 className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
