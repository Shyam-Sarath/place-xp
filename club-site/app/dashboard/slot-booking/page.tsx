import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import SlotBookingClient from '@/components/events/SlotBookingClient';

export default async function SlotBookingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=participant');
  const { data: settings } = await supabase.from('slot_booking_settings').select('deadline, whatsapp_link').eq('id', 'slot_booking').maybeSingle();
  const { data: recruitment } = await supabase.from('site_settings').select('recruitment_closes_at').eq('id', 'site_settings').maybeSingle();
  return <main className="min-h-screen"><Navbar /><section className="pt-36 md:pt-44 pb-32"><div className="max-w-5xl mx-auto px-6"><span className="text-sm uppercase tracking-[0.2em] text-orange-500">Participant portal</span><h1 className="text-4xl font-bold mt-3 mb-10">Book your recruitment <span className="text-orange-500">slot</span></h1><SlotBookingClient deadline={settings?.deadline ?? recruitment?.recruitment_closes_at ?? null} whatsapp={settings?.whatsapp_link} /></div></section><Footer /></main>;
}
