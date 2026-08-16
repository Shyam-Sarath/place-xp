'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowUpDown, Mail, Phone, Hash, GraduationCap, ExternalLink, CalendarDays } from 'lucide-react';
import type { Profile, RegistrationWithEvent } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

type SortKey = 'name' | 'created_at' | 'registrations';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ParticipantsTable({
  participants,
  registrations,
}: {
  participants: Profile[];
  registrations: RegistrationWithEvent[];
}) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [year, setYear] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [openId, setOpenId] = useState<string | null>(null);

  const registrationsByUser = useMemo(() => {
    const map = new Map<string, RegistrationWithEvent[]>();
    for (const r of registrations) {
      const list = map.get(r.user_id) ?? [];
      list.push(r);
      map.set(r.user_id, list);
    }
    return map;
  }, [registrations]);

  const departments = useMemo(
    () => Array.from(new Set(participants.map((p) => p.department).filter(Boolean))) as string[],
    [participants]
  );
  const years = useMemo(
    () => Array.from(new Set(participants.map((p) => p.year).filter(Boolean))).sort() as string[],
    [participants]
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = participants.filter((p) => {
      if (department !== 'all' && p.department !== department) return false;
      if (year !== 'all' && p.year !== year) return false;
      if (!q) return true;
      return (
        p.full_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.reg_no?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') {
        cmp = (a.full_name ?? '').localeCompare(b.full_name ?? '');
      } else if (sortKey === 'created_at') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        cmp = (registrationsByUser.get(a.id)?.length ?? 0) - (registrationsByUser.get(b.id)?.length ?? 0);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [participants, search, department, year, sortKey, sortDir, registrationsByUser]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const openParticipant = openId ? participants.find((p) => p.id === openId) ?? null : null;
  const openRegistrations = openId ? registrationsByUser.get(openId) ?? [] : [];

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, reg. no. or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClasses} pl-10`}
          />
        </div>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className={`${inputClasses} w-auto appearance-none`}>
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={`${inputClasses} w-auto appearance-none`}>
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {rows.length > 0 ? (
        <div className="rounded-2xl border border-border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-divider text-left text-xs text-text-muted">
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-text-secondary transition-colors">
                    Name <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Reg. No.</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('registrations')} className="flex items-center gap-1 hover:text-text-secondary transition-colors">
                    Events <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-5 py-3 font-medium">
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-text-secondary transition-colors">
                    Joined <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setOpenId(p.id)}
                  className="border-b border-border-divider last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 font-medium text-text-primary">{p.full_name ?? '—'}</td>
                  <td className="px-5 py-4 text-text-secondary">{p.email ?? '—'}</td>
                  <td className="px-5 py-4 text-text-secondary">{p.reg_no ?? '—'}</td>
                  <td className="px-5 py-4 text-text-muted">{p.department ?? '—'}</td>
                  <td className="px-5 py-4 text-text-muted">{p.year ?? '—'}</td>
                  <td className="px-5 py-4 text-text-muted">{p.phone ?? '—'}</td>
                  <td className="px-5 py-4 text-text-secondary">{registrationsByUser.get(p.id)?.length ?? 0}</td>
                  <td className="px-5 py-4 text-text-muted text-xs">{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-default py-16 text-center">
          <p className="text-sm text-text-muted">No participants match your filters.</p>
        </div>
      )}

      {/* Detail panel */}
      {openParticipant && (
        <div
          onClick={() => setOpenId(null)}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl p-8 w-full max-w-lg relative max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => setOpenId(null)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-text-primary mb-1">{openParticipant.full_name ?? 'Participant'}</h3>
            <p className="text-sm text-text-muted mb-6">Joined {formatDate(openParticipant.created_at)}</p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-text-secondary"><Mail className="w-3.5 h-3.5 text-text-muted shrink-0" /> {openParticipant.email ?? '—'}</div>
              <div className="flex items-center gap-2 text-text-secondary"><Phone className="w-3.5 h-3.5 text-text-muted shrink-0" /> {openParticipant.phone ?? '—'}</div>
              <div className="flex items-center gap-2 text-text-secondary"><Hash className="w-3.5 h-3.5 text-text-muted shrink-0" /> {openParticipant.reg_no ?? '—'}</div>
              <div className="flex items-center gap-2 text-text-secondary"><GraduationCap className="w-3.5 h-3.5 text-text-muted shrink-0" /> {openParticipant.department ?? '—'} {openParticipant.year ? `· Year ${openParticipant.year}` : ''}{openParticipant.section ? ` · Sec ${openParticipant.section}` : ''}</div>
            </div>

            <h4 className="text-xs uppercase tracking-wide text-text-muted mb-3">
              Registered Events ({openRegistrations.length})
            </h4>

            {openRegistrations.length > 0 ? (
              <div className="space-y-2">
                {openRegistrations.map((r) => (
                  <Link
                    key={r.id}
                    href={r.events ? `/admin/events/${r.events.slug}/edit` : '#'}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border-default hover:border-orange-500/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary truncate flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        {r.events?.title ?? 'Deleted event'}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">Registered {formatDate(r.registered_at)}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Not registered for any events yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
