import { createClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/types/database';
import RecruitmentForm from '@/components/admin/RecruitmentForm';

export const metadata = {
  title: 'Recruitment — Place XP Admin',
};

export default async function AdminRecruitmentPage() {
  const supabase = await createClient();

  let { data: settings } = await supabase.from('site_settings').select('*').maybeSingle<SiteSettings>();

  if (!settings) {
    const { data: inserted } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 'site_settings',
          site_name: 'Place XP',
          contact_email: null,
          instagram_url: null,
          linkedin_url: null,
          x_url: null,
          recruitment_closes_at: null,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single<SiteSettings>();

    settings = inserted ?? null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Recruitment</h1>
        <p className="mt-1 text-sm text-text-muted">Set when recruitment closes. Recruitment is closed by default until you set a date and time.</p>
      </div>

      <RecruitmentForm settings={settings as SiteSettings | null} />
    </div>
  );
}
