import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import type { EventTimelineStep } from '@/types/database';

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
    <div className="glass rounded-2xl p-8">
      <ol className="relative">
        {sorted.map((step, i) => {
          const isLast = i === sorted.length - 1;
          return (
            <li key={step.id} className="relative pb-10 last:pb-0 pl-10">
              {!isLast && (
                <span
                  className={`absolute left-[11px] top-6 bottom-0 w-px ${
                    step.status === 'done' ? 'bg-status-success/50' : 'bg-border-default'
                  }`}
                />
              )}
              <span className="absolute left-0 top-0">
                {step.status === 'done' && (
                  <CheckCircle2 className="w-6 h-6 text-status-success" />
                )}
                {step.status === 'current' && (
                  <CircleDot className="w-6 h-6 text-orange-500 animate-pulse" />
                )}
                {step.status === 'upcoming' && (
                  <Circle className="w-6 h-6 text-text-muted" />
                )}
              </span>
              <p
                className={`text-sm font-medium pt-0.5 ${
                  step.status === 'upcoming' ? 'text-text-muted' : 'text-text-primary'
                }`}
              >
                {step.step_name}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
