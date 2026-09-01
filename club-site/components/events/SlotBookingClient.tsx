'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Lock,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import RecruitmentClosedModal from '@/components/sections/RecruitmentClosedModal';
import type { EventSlot } from '@/types/database';

/**
 * Formats a `YYYY-MM-DD` slot_date string into a short label for the date
 * selector pills, e.g. "Mon, Sep 1". Dates are parsed as local (not UTC) so
 * the day shown always matches what was stored, regardless of the viewer's
 * timezone offset.
 */
function formatDatePill(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
  };
}

/** Formats a slot_date into a full heading, e.g. "Monday, September 1". */
function formatDateHeading(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function isToday(dateStr: string) {
  const today = new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return today.getFullYear() === year && today.getMonth() === (month ?? 1) - 1 && today.getDate() === day;
}

export default function SlotBookingClient({ deadline, whatsapp }: { deadline: string | null; whatsapp?: string | null }) {
  const db = createClient();
  const closed = !deadline || new Date(deadline) <= new Date();

  const [showClosed, setShowClosed] = useState(closed);
  const [slots, setSlots] = useState<EventSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<EventSlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await db
        .from('event_slots')
        .select('*')
        .is('event_id', null)
        .order('slot_date')
        .order('start_time');
      if (cancelled) return;
      setSlots((data ?? []) as EventSlot[]);
      setLoading(false);
    }

    void load();
    // Realtime subscription keeps the grid (and everyone else's view) in sync
    // the instant a slot is booked, so availability never goes stale between
    // refreshes or across open tabs.
    const channel = db
      .channel('standalone-slots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_slots' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      void db.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    const { data } = await db
      .from('event_slots')
      .select('*')
      .is('event_id', null)
      .order('slot_date')
      .order('start_time');
    setSlots((data ?? []) as EventSlot[]);
  }

  // Group slots by date, preserving the chronological order returned by the
  // query (ordered by slot_date, then start_time).
  const groupedByDate = useMemo(() => {
    const map = new Map<string, EventSlot[]>();
    for (const slot of slots) {
      const bucket = map.get(slot.slot_date);
      if (bucket) bucket.push(slot);
      else map.set(slot.slot_date, [slot]);
    }
    return map;
  }, [slots]);

  const dates = useMemo(() => Array.from(groupedByDate.keys()), [groupedByDate]);

  // Keep the selected date valid as data loads or changes; default to the
  // first available date.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (dates.length === 0) {
      setSelectedDate(null);
      return;
    }
    if (!selectedDate || !dates.includes(selectedDate)) {
      setSelectedDate(dates[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const slotsForSelectedDate = selectedDate ? groupedByDate.get(selectedDate) ?? [] : [];

  async function book() {
    if (!selectedSlot) return;
    setBooking(true);
    const { error } = await db.rpc('book_event_slot', { p_slot_id: selectedSlot.id });
    setMessage(error ? error.message : 'Your slot has been booked successfully.');
    setMessageTone(error ? 'error' : 'success');
    setBooking(false);
    setSelectedSlot(null);
    if (!error) void refresh();
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 text-emerald-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Available
        </span>
        <span className="inline-flex items-center gap-1.5 text-red-400">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Booked
        </span>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border-default bg-bg-elevated/40" />
          ))}
        </div>
      )}

      {!loading && slots.length === 0 && (
        <div className="rounded-2xl border border-border-default bg-bg-card/60 p-8 text-center text-text-muted">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 opacity-60" />
          No slots have been added yet. Check back soon.
        </div>
      )}

      {!loading && slots.length > 0 && (
        <>
          {/* Date selector */}
          <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
            {dates.map((date) => {
              const pill = formatDatePill(date);
              const bucket = groupedByDate.get(date) ?? [];
              const availableCount = bucket.filter((s) => !s.booked_by).length;
              const active = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex shrink-0 snap-start flex-col items-center gap-0.5 rounded-2xl border px-4 py-2.5 text-center transition ${
                    active
                      ? 'border-orange-500 bg-orange-500/15 text-orange-300 shadow-[0_0_0_1px_rgba(248,154,74,0.35)]'
                      : 'border-border-default bg-bg-elevated/40 text-text-secondary hover:border-orange-500/40 hover:text-orange-300'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wide opacity-80">{pill.weekday}{isToday(date) ? ' · Today' : ''}</span>
                  <span className="text-lg font-semibold leading-tight">{pill.month} {pill.day}</span>
                  <span className={`text-[11px] ${availableCount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {availableCount > 0 ? `${availableCount} open` : 'Full'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots for the selected date */}
          {selectedDate && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-text-secondary">{formatDateHeading(selectedDate)}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {slotsForSelectedDate.map((slot) => {
                  const booked = !!slot.booked_by;
                  return (
                    <button
                      key={slot.id}
                      disabled={closed || booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`group relative rounded-2xl border p-4 text-center transition disabled:cursor-not-allowed disabled:opacity-70 ${
                        booked
                          ? 'border-red-500/40 bg-red-500/10 text-red-300'
                          : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:-translate-y-0.5 hover:bg-emerald-500/20'
                      }`}
                    >
                      <span
                        className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          booked ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {booked ? 'Booked' : 'Open'}
                      </span>
                      {booked ? <Lock className="mx-auto mb-2 h-5 w-5" /> : <Clock className="mx-auto mb-2 h-5 w-5" />}
                      <div className="text-sm font-medium">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 ${
            messageTone === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {messageTone === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <X className="h-5 w-5 shrink-0" />}
          {message}
        </div>
      )}

      {whatsapp && (
        <a
          className="block rounded-xl border border-border-default bg-bg-elevated/40 px-4 py-3 text-orange-400 hover:bg-orange-500/10"
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Group link
        </a>
      )}

      {/* Confirmation modal */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
            onClick={() => !booking && setSelectedSlot(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-orange-500/30 bg-bg-card p-7 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-xl bg-orange-500/15 p-3 text-orange-400">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Confirm your slot</h2>
                </div>
                <button
                  onClick={() => setSelectedSlot(null)}
                  aria-label="Close"
                  disabled={booking}
                  className="text-text-muted hover:text-white disabled:opacity-40"
                >
                  <X />
                </button>
              </div>
              <p className="mt-4 text-text-secondary">Are you sure you want to book this slot?</p>
              <div className="mt-5 rounded-xl bg-bg-elevated p-4 text-center">
                <p className="font-medium text-text-primary">{formatDateHeading(selectedSlot.slot_date)}</p>
                <p className="mt-1 text-orange-400">
                  {formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => void book()}
                  disabled={booking}
                  className="flex-1 rounded-xl gradient-cta py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {booking ? 'Booking…' : 'Confirm booking'}
                </button>
                <button
                  onClick={() => setSelectedSlot(null)}
                  disabled={booking}
                  className="rounded-xl border border-border-default px-5 py-3 text-sm text-text-secondary disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showClosed && (
        <RecruitmentClosedModal
          title="Slot Booking Closed"
          description="The slot booking deadline has passed. You will be redirected to the homepage."
          onClose={() => {
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
}
