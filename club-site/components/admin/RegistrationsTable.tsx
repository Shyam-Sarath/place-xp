'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { RegistrationWithEvent, EventRow, PaymentStatus, AttendanceStatus, ApprovalStatus } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string; className: string }[] = [
  { value: 'not_required', label: 'Not required', className: 'text-text-muted' },
  { value: 'pending', label: 'Pending', className: 'text-status-warning' },
  { value: 'paid', label: 'Paid', className: 'text-status-success' },
  { value: 'waived', label: 'Waived', className: 'text-status-info' },
];

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string; className: string }[] = [
  { value: 'registered', label: 'Registered', className: 'text-text-muted' },
  { value: 'attended', label: 'Attended', className: 'text-status-success' },
  { value: 'no_show', label: 'No-show', className: 'text-status-error' },
];

const APPROVAL_OPTIONS: { value: ApprovalStatus; label: string; className: string }[] = [
  { value: 'pending', label: 'Pending', className: 'text-status-warning' },
  { value: 'approved', label: 'Approved', className: 'text-status-success' },
  { value: 'rejected', label: 'Rejected', className: 'text-status-error' },
];

function StatusSelect<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { value: T; label: string; className: string }[];
  onChange: (v: T) => void;
  disabled: boolean;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as T)}
      className={`bg-transparent text-xs font-medium border border-border-default rounded-full px-2.5 py-1 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 ${current?.className ?? 'text-text-secondary'}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-bg-elevated text-text-primary">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function RegistrationsTable({
  registrations,
  events,
}: {
  registrations: RegistrationWithEvent[];
  events: EventRow[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (eventFilter !== 'all' && r.event_id !== eventFilter) return false;
      if (approvalFilter !== 'all' && r.approval_status !== approvalFilter) return false;
      if (!q) return true;
      return (
        r.full_name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.reg_no?.toLowerCase().includes(q)
      );
    });
  }, [registrations, search, eventFilter, approvalFilter]);

  async function updateField(id: string, field: 'payment_status' | 'attendance_status' | 'approval_status', value: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('registrations').update({ [field]: value }).eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  async function handleRemove(id: string) {
    if (!confirm('Remove this registration? This cannot be undone.')) return;
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('registrations').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email or reg. no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClasses} pl-10`}
          />
        </div>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className={`${inputClasses} w-auto appearance-none`}>
          <option value="all">All events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
        <select value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)} className={`${inputClasses} w-auto appearance-none`}>
          <option value="all">All approval statuses</option>
          {APPROVAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {rows.length > 0 ? (
        <div className="rounded-2xl border border-border-default overflow-hidden">
          <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-divider text-left text-xs text-text-muted">
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Participant</th>
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Event</th>
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Registered</th>
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Payment</th>
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Attendance</th>
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Approval</th>
                <th className="sticky top-0 z-10 bg-bg-card px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border-divider last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">{r.full_name ?? '—'}</p>
                    <p className="text-xs text-text-muted mt-0.5">{r.email ?? '—'}{r.reg_no ? ` · ${r.reg_no}` : ''}</p>
                  </td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{r.events?.title ?? 'Deleted event'}</td>
                  <td className="px-5 py-4 text-text-muted text-xs whitespace-nowrap">{formatDate(r.registered_at)}</td>
                  <td className="px-5 py-4">
                    <StatusSelect value={r.payment_status} options={PAYMENT_OPTIONS} disabled={busyId === r.id} onChange={(v) => updateField(r.id, 'payment_status', v)} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusSelect value={r.attendance_status} options={ATTENDANCE_OPTIONS} disabled={busyId === r.id} onChange={(v) => updateField(r.id, 'attendance_status', v)} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusSelect value={r.approval_status} options={APPROVAL_OPTIONS} disabled={busyId === r.id} onChange={(v) => updateField(r.id, 'approval_status', v)} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleRemove(r.id)}
                      disabled={busyId === r.id}
                      className="text-text-muted hover:text-status-error transition-colors disabled:opacity-50"
                      title="Remove registration"
                    >
                      {busyId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-default py-16 text-center">
          <p className="text-sm text-text-muted">No registrations match your filters.</p>
        </div>
      )}
    </div>
  );
}
