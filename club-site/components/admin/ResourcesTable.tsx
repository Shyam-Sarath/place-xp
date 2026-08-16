'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Image as ImageIcon, Video, Archive as ArchiveIcon, File as FileIcon, Link2, Loader2, Pencil, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import FileUploadInput from '@/components/admin/FileUploadInput';
import type { EventRow, ResourceWithEvent } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

function inferFileType(url: string) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
  if (['zip', 'rar'].includes(ext)) return 'zip';
  return 'link';
}

function iconFor(fileType: string | null) {
  const type = (fileType ?? '').toLowerCase();
  if (type.includes('pdf') || type.includes('ppt')) return FileText;
  if (type.includes('image')) return ImageIcon;
  if (type.includes('video')) return Video;
  if (type.includes('zip')) return ArchiveIcon;
  if (type.includes('link')) return Link2;
  return FileIcon;
}

export default function ResourcesTable({
  resources,
  events,
}: {
  resources: ResourceWithEvent[];
  events: EventRow[];
}) {
  const router = useRouter();
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setEventId('');
    setTitle('');
    setUploadedUrl(null);
    setExternalUrl('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const finalUrl = uploadedUrl || externalUrl.trim();
    if (!eventId || !title.trim() || !finalUrl) {
      setError('Select an event, set a title, and add a file or URL.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const payload = {
      event_id: eventId,
      title: title.trim(),
      file_url: finalUrl,
      file_type: inferFileType(finalUrl),
    };

    if (editingId) {
      const { error: updateError } = await supabase.from('resources').update(payload).eq('id', editingId);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('resources').insert(payload);
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
    if (!confirm('Delete this resource?')) return;

    setBusyId(id);
    const supabase = createClient();
    await supabase.from('resources').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  function handleEdit(item: ResourceWithEvent) {
    setEditingId(item.id);
    setEventId(item.event_id);
    setTitle(item.title);
    setUploadedUrl(item.file_url);
    setExternalUrl(item.file_url);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border-default p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={`${inputClasses} appearance-none`} required>
            <option value="">Select event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <FileUploadInput bucket="event-resources" folder={eventId || 'global-resources'} value={uploadedUrl} onChange={setUploadedUrl} />

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">or paste a link</span>
          <input
            type="url"
            placeholder="https://..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            disabled={!!uploadedUrl}
            className={`${inputClasses} disabled:opacity-40`}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingId ? 'Save changes' : 'Add resource'}
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

      <div className="grid md:grid-cols-2 gap-3">
        {resources.length > 0 ? (
          resources.map((item) => {
            const Icon = iconFor(item.file_type);
            return (
              <div key={item.id} className="rounded-2xl border border-border-default p-4 flex items-center gap-3">
                <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <a href={item.file_url} target="_blank" rel="noreferrer" className="text-sm text-text-primary hover:text-orange-500 truncate max-w-[220px]">
                      {item.title}
                    </a>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleEdit(item)} className="text-text-muted hover:text-text-primary transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(item.id)} disabled={busyId === item.id} className="text-text-muted hover:text-status-error transition-colors disabled:opacity-50" title="Delete">
                        {busyId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{item.events?.title ?? 'Deleted event'}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-border-default py-12 text-center text-sm text-text-muted">
            No resources uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
