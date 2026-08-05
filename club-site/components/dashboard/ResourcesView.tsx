import { FileText, Image as ImageIcon, Video, Archive, File as FileIcon, Download } from 'lucide-react';
import type { Resource } from '@/types/database';

function iconFor(fileType: string | null) {
  const t = (fileType ?? '').toLowerCase();
  if (t.includes('pdf') || t.includes('doc') || t.includes('ppt')) return FileText;
  if (t.includes('image') || t.includes('png') || t.includes('jpg')) return ImageIcon;
  if (t.includes('video') || t.includes('mp4')) return Video;
  if (t.includes('zip') || t.includes('rar')) return Archive;
  return FileIcon;
}

export default function ResourcesView({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="text-text-muted">No resources uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {resources.map((r) => {
        const Icon = iconFor(r.file_type);
        return (
          <a
            key={r.id}
            href={r.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-colors group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{r.title}</p>
              {r.file_type && (
                <p className="text-xs text-text-muted uppercase tracking-wide">{r.file_type}</p>
              )}
            </div>
            <Download className="w-4 h-4 text-text-muted group-hover:text-orange-500 transition-colors shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
