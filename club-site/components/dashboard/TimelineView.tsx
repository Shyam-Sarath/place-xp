'use client';

import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import type { EventTimelineStep } from '@/types/database';

const STATUS_LABEL: Record<EventTimelineStep['status'], string> = {
  done: 'Done',
  current: 'Current',
  upcoming: 'Upcoming',
};

export default function TimelineView({ steps }: { steps: EventTimelineStep[] }) {
  if (steps.length === 0) {
    return (
      <div className="glass rounded-2xl py-16 text-center">
        <p className="text-text-muted">No timeline has been published for this event yet.</p>
      </div>
    );
  }

  const sorted = [...steps].sort((a, b) => a.step_order - b.step_order);

  return (
    <div className="space-y-4">
      {sorted.map((step) => {
        const statusLabel = STATUS_LABEL[step.status];
        const iconClasses =
          step.status === 'done'
            ? 'bg-status-success/15 text-status-success'
            : step.status === 'current'
              ? 'bg-orange-500/15 text-orange-500'
              : 'bg-white/[0.04] text-text-muted';

        const Icon = step.status === 'done' ? CheckCircle2 : step.status === 'current' ? CircleDot : Circle;

        return (
          <div key={step.id} className="glass rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconClasses}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-text-primary">{step.step_name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                      step.status === 'done'
                        ? 'border-status-success/30 bg-status-success/10 text-status-success'
                        : step.status === 'current'
                          ? 'border-orange-500/30 bg-orange-500/10 text-orange-500'
                          : 'border-border-default bg-white/[0.02] text-text-muted'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}