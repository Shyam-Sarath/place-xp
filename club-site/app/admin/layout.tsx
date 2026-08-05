import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?role=admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex bg-bg-primary">
      <AdminSidebar />
      <main className="flex-1 min-w-0 px-8 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
