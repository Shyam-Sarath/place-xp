'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Plus, CheckCircle2, Circle, CircleDot } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { EventTimelineStep, TimelineStepStatus } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

export default function AdminTimelineEditor({ eventId, steps }: { eventId: string; steps: EventTimelineStep[] }) {
  const router = useRouter();
  const [stepName, setStepName] = useState('');
  const [status, setStatus] = useState<TimelineStepStatus>('upcoming');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...steps].sort((a, b) => a.step_order - b.step_order);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('event_timeline').insert({
      event_id: eventId,
      step_name: stepName,
      step_order: sorted.length > 0 ? sorted[sorted.length - 1].step_order + 1 : 1,
      status,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setStepName('');
    setStatus('upcoming');
    router.refresh();
  }

  async function handleStatusChange(id: string, newStatus: TimelineStepStatus) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('event_timeline').update({ status: newStatus }).eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from('event_timeline').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  const statusIcon = { done: CheckCircle2, current: CircleDot, upcoming: Circle };

  return (
    <div className="space-y-6">
      {sorted.length > 0 && (
        <div className="rounded-2xl border border-border-default divide-y divide-border-divider">
          {sorted.map((step) => {
            const Icon = statusIcon[step.status];
            return (
              <div key={step.id} className="flex items-center gap-4 px-5 py-4">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    step.status === 'done' ? 'text-status-success' : step.status === 'current' ? 'text-orange-500' : 'text-text-muted'
                  }`}
                />
                <span className="flex-1 text-sm text-text-primary">{step.step_name}</span>
                <select
                  value={step.status}
                  onChange={(e) => handleStatusChange(step.id, e.target.value as TimelineStepStatus)}
                  disabled={busyId === step.id}
                  className="text-xs rounded-lg bg-bg-elevated/50 border border-border-default px-2 py-1.5 text-text-secondary"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="current">Current</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={() => handleDelete(step.id)}
                  disabled={busyId === step.id}
                  className="text-text-muted hover:text-status-error transition-colors"
                >
                  {busyId === step.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleAdd} className="rounded-2xl border border-border-default p-5 space-y-3">
        <div>
          <label className="block text-xs text-text-muted mb-1.5">New step</label>
          <input
            required
            type="text"
            placeholder="e.g. Round 1 Begins"
            value={stepName}
            onChange={(e) => setStepName(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TimelineStepStatus)}
            className={`${inputClasses} w-40`}
          >
            <option value="upcoming">Upcoming</option>
            <option value="current">Current</option>
            <option value="done">Done</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-status-error">{error}</p>}
    </div>
  );
}