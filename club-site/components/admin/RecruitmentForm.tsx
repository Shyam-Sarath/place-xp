'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types/database';

const inputClasses =
  'w-full rounded-xl border border-border-default bg-bg-elevated/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/40';

export default function RecruitmentForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    if (!settings?.recruitment_closes_at) {
      return { recruitment_closes_date: '', recruitment_closes_time: '00:00' };
    }

    const date = new Date(settings.recruitment_closes_at);
    return {
      recruitment_closes_date: date.toISOString().split('T')[0],
      recruitment_closes_time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    let recruitment_closes_at: string | null = null;
    if (form.recruitment_closes_date && form.recruitment_closes_time) {
      recruitment_closes_at = new Date(`${form.recruitment_closes_date}T${form.recruitment_closes_time}:00`).toISOString();
    }

    const supabase = createClient();
    const { error: saveError } = await supabase
      .from('site_settings')
      .upsert({ id: 'site_settings', recruitment_closes_at }, { onConflict: 'id' });

    setLoading(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl border border-border-default p-5">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-text-muted" htmlFor="recruitment-close-date">Recruitment closes — date</label>
          <input id="recruitment-close-date" type="date" value={form.recruitment_closes_date} onChange={(event) => setForm((previous) => ({ ...previous, recruitment_closes_date: event.target.value }))} className={inputClasses} />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-text-muted" htmlFor="recruitment-close-time">Recruitment closes — time</label>
          <input id="recruitment-close-time" type="time" value={form.recruitment_closes_time} onChange={(event) => setForm((previous) => ({ ...previous, recruitment_closes_time: event.target.value }))} className={inputClasses} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white gradient-cta transition-all duration-300 hover:shadow-orange-glow disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save settings
      </button>

      {error && <p className="text-sm text-status-error">{error}</p>}
    </form>
  );
}
