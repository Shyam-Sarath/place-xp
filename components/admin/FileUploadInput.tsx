'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, X, FileCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  bucket: string;
  folder?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  label?: string;
}

export default function FileUploadInput({ bucket, folder, value, onChange, accept, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const safeName = file.name.replace(/\s+/g, '-');
    const path = `${folder ? folder + '/' : ''}${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {label && <label className="block text-xs text-text-muted mb-2">{label}</label>}
      {value ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-elevated/50 border border-border-default">
          <FileCheck className="w-4 h-4 text-status-success shrink-0" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-orange-500 hover:text-orange-400 truncate flex-1"
          >
            {decodeURIComponent(value.split('/').pop() ?? value)}
          </a>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-text-muted hover:text-status-error transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bg-elevated/30 border border-dashed border-border-default text-sm text-text-muted hover:text-text-secondary hover:border-orange-500/50 transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Click to upload'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-xs text-status-error mt-2">{error}</p>}
    </div>
  );
}
