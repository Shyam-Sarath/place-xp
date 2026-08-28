import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; const resend = process.env.RESEND_API_KEY;
  if (!key || !resend) return NextResponse.json({ sent: 0, warning: 'Email service is not configured' });
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key);
  const now = new Date(); const until = new Date(now.getTime() + 10 * 60 * 1000);
  const { data: slots } = await db.from('event_slots').select('*, events(title, meeting_link, instructions), profiles:booked_by(email, full_name)').not('booked_by', 'is', null).gte('slot_date', now.toISOString().slice(0, 10));
  let sent = 0;
  for (const slot of slots ?? []) {
    const start = new Date(`${slot.slot_date}T${slot.start_time}Z`); if (start < now || start > until) continue;
    const email = slot.profiles?.email; if (!email) continue;
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.REMINDER_FROM_EMAIL ?? 'noreply@example.com', to: email, subject: `Reminder: ${slot.events?.title}`, text: `Your recruitment meeting starts in 10 minutes.\nTime: ${slot.start_time} - ${slot.end_time}\nMeeting Link: ${slot.events?.meeting_link ?? 'See portal'}\n${slot.events?.instructions ?? ''}` }) }); sent++;
  }
  return NextResponse.json({ sent });
}
