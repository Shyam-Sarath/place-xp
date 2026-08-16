import { createClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/types/database';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

export const metadata = {
  title: 'Settings — Place XP Admin',
};

export default async function AdminSettingsPage() {
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
        <h1 className="text-2xl font-semibold text-text-primary">Club Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage the public club identity and contact links.</p>
      </div>

      <SiteSettingsForm settings={settings as SiteSettings | null} />
    </div>
  );
}
