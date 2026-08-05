'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, FileText, Image as ImageIcon, Video, Archive as ArchiveIcon, File as FileIcon, Link2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import FileUploadInput from '@/components/admin/FileUploadInput';
import type { Resource } from '@/types/database';

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
  const t = (fileType ?? '').toLowerCase();
  if (t.includes('pdf') || t.includes('ppt')) return FileText;
  if (t.includes('image')) return ImageIcon;
  if (t.includes('video')) return Video;
  if (t.includes('zip')) return ArchiveIcon;
  if (t.includes('link')) return Link2;
  return FileIcon;
}

export default function AdminResourcesEditor({ eventId, resources }: { eventId: string; resources: Resource[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const fileUrl = uploadedUrl || externalUrl.trim();
    if (!fileUrl) {
      setError('Upload a file or paste a link.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from('resources').insert({
      event_id: eventId,
      title,
      file_url: fileUrl,
      file_type: inferFileType(fileUrl),
      uploaded_by: user?.id,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTitle('');
    setUploadedUrl(null);
    setExternalUrl('');
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('resources').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-2xl border border-border-default p-5 space-y-3">
        <input
          required
          type="text"
          placeholder="Resource title (e.g. Rulebook)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
        />
        <FileUploadInput bucket="event-resources" folder={eventId} value={uploadedUrl} onChange={setUploadedUrl} />
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">or</span>
          <input
            type="url"
            placeholder="Paste an external link (Drive, YouTube...)"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            disabled={!!uploadedUrl}
            className={`${inputClasses} disabled:opacity-40`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Resource
        </button>
        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      {resources.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {resources.map((r) => {
            const Icon = iconFor(r.file_type);
            return (
              <div key={r.id} className="rounded-2xl border border-border-default p-4 flex items-center gap-3">
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 text-sm text-text-primary hover:text-orange-500 truncate">
                  {r.title}
                </a>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={busyId === r.id}
                  className="text-text-muted hover:text-status-error transition-colors shrink-0"
                >
                  {busyId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
