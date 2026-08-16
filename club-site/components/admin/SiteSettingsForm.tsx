'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

export default function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    site_name: settings?.site_name ?? 'Place XP',
    contact_email: settings?.contact_email ?? '',
    instagram_url: settings?.instagram_url ?? '',
    linkedin_url: settings?.linkedin_url ?? '',
    x_url: settings?.x_url ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const payload = {
      id: 'site_settings',
      site_name: form.site_name.trim() || 'Place XP',
      contact_email: form.contact_email.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      x_url: form.x_url.trim() || null,
    };

    const { error: saveError } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });
    setLoading(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-default p-5 space-y-4 max-w-2xl">
      <div>
        <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">Site name</label>
        <input
          type="text"
          value={form.site_name}
          onChange={(e) => setForm((prev) => ({ ...prev, site_name: e.target.value }))}
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">Contact email</label>
        <input
          type="email"
          value={form.contact_email}
          onChange={(e) => setForm((prev) => ({ ...prev, contact_email: e.target.value }))}
          className={inputClasses}
          placeholder="hello@placexp.in"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">Instagram</label>
          <input
            type="url"
            value={form.instagram_url}
            onChange={(e) => setForm((prev) => ({ ...prev, instagram_url: e.target.value }))}
            className={inputClasses}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">LinkedIn</label>
          <input
            type="url"
            value={form.linkedin_url}
            onChange={(e) => setForm((prev) => ({ ...prev, linkedin_url: e.target.value }))}
            className={inputClasses}
            placeholder="https://linkedin.com/company/..."
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">X / Twitter</label>
          <input
            type="url"
            value={form.x_url}
            onChange={(e) => setForm((prev) => ({ ...prev, x_url: e.target.value }))}
            className={inputClasses}
            placeholder="https://x.com/..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <Save className="w-4 h-4" />
        Save settings
      </button>

      {error && <p className="text-sm text-status-error">{error}</p>}
    </form>
  );
}
 
