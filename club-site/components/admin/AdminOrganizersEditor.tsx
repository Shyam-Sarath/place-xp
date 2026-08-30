'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Trash2, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import FileUploadInput from '@/components/admin/FileUploadInput';
import type { EventOrganizer } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

export default function AdminOrganizersEditor({ eventId, organizers }: { eventId: string; organizers: EventOrganizer[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('event_organizers').insert({
      event_id: eventId,
      name,
      position: position || null,
      email: email || null,
      phone: phone || null,
      linkedin: linkedin || null,
      photo_url: photoUrl,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName('');
    setPosition('');
    setEmail('');
    setPhone('');
    setLinkedin('');
    setPhotoUrl(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('event_organizers').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-2xl border border-border-default p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
          <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} className={inputClasses} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
          <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} />
        </div>
        <input type="url" placeholder="LinkedIn (optional)" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className={inputClasses} />
        <FileUploadInput bucket="event-banners" folder={`organizers/${eventId}`} value={photoUrl} onChange={setPhotoUrl} accept="image/*" label="Photo (optional)" />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Organizer
        </button>
        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      {organizers.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {organizers.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border-default p-4 flex items-center gap-3">
              {o.photo_url ? (
                <Image src={o.photo_url} alt={o.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-orange-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{o.name}</p>
                {o.position && <p className="text-xs text-text-muted">{o.position}</p>}
              </div>
              <button
                onClick={() => handleDelete(o.id)}
                disabled={busyId === o.id}
                className="text-text-muted hover:text-status-error transition-colors shrink-0"
              >
                {busyId === o.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
