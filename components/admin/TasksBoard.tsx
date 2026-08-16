 'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CircleDashed, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { EventRow, TaskItemWithEvent, TaskStatus, TaskPriority } from '@/types/database';

const inputClasses =
  'w-full rounded-xl bg-bg-elevated/50 border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-colors';

const STATUS_COLUMNS: { key: TaskStatus; label: string; icon: typeof CircleDashed }[] = [
  { key: 'todo', label: 'Todo', icon: CircleDashed },
  { key: 'in_progress', label: 'In Progress', icon: Pencil },
  { key: 'done', label: 'Done', icon: CheckCircle2 },
];

const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high'];

export default function TasksBoard({ tasks, events }: { tasks: TaskItemWithEvent[]; events: EventRow[] }) {
  const router = useRouter();
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const byStatus = useMemo(() => {
    const map = {
      todo: [] as TaskItemWithEvent[],
      in_progress: [] as TaskItemWithEvent[],
      done: [] as TaskItemWithEvent[],
    } as Record<TaskStatus, TaskItemWithEvent[]>;

    for (const task of tasks) {
      map[task.status].push(task);
    }
    return map;
  }, [tasks]);

  function resetForm() {
    setEventId('');
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const payload = {
      event_id: eventId || null,
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
    };

    if (editingId) {
      const { error: updateError } = await supabase.from('tasks').update(payload).eq('id', editingId);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('tasks').insert(payload);
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    resetForm();
    router.refresh();
  }

  async function handleMove(id: string, nextStatus: TaskStatus) {
    const supabase = createClient();
    await supabase.from('tasks').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', id);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return;

    setBusyId(id);
    const supabase = createClient();
    await supabase.from('tasks').delete().eq('id', id);
    setBusyId(null);
    router.refresh();
  }

  function handleEdit(task: TaskItemWithEvent) {
    setEditingId(task.id);
    setEventId(task.event_id ?? '');
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
    setPriority(task.priority);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border-default p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={`${inputClasses} appearance-none`}>
            <option value="">Global task (no specific event)</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <textarea
          placeholder="Task details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClasses} min-h-[90px] resize-y`}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={`${inputClasses} appearance-none`}>
            {STATUS_COLUMNS.map((column) => (
              <option key={column.key} value={column.key}>{column.label}</option>
            ))}
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={`${inputClasses} appearance-none`}>
            {PRIORITY_OPTIONS.map((level) => (
              <option key={level} value={level}>{level[0].toUpperCase() + level.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cta text-white text-sm font-medium hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingId ? 'Save changes' : 'Add task'}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:text-text-primary transition-colors">
              Cancel
            </button>
          )}
        </div>

        {error && <p className="text-sm text-status-error">{error}</p>}
      </form>

      <div className="grid lg:grid-cols-3 gap-4">
        {STATUS_COLUMNS.map((column) => {
          const Icon = column.icon;
          const items = byStatus[column.key];

          return (
            <div key={column.key} className="rounded-2xl border border-border-default p-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  <Icon className="w-4 h-4 text-orange-500" />
                  {column.label}
                </div>
                <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-text-muted">{items.length}</span>
              </div>

              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((task) => (
                    <div key={task.id} className="rounded-xl border border-border-default bg-bg-elevated/40 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{task.title}</p>
                          {task.events?.title && <p className="text-[11px] text-text-muted mt-1">{task.events.title}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleEdit(task)} className="text-text-muted hover:text-text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => handleDelete(task.id)} disabled={busyId === task.id} className="text-text-muted hover:text-status-error transition-colors disabled:opacity-50">{busyId===task.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}</button>
                        </div>
                      </div>

                      {task.description && <p className="mt-2 text-xs text-text-secondary whitespace-pre-line">{task.description}</p>}

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${task.priority === 'high' ? 'bg-red-500/15 text-red-300' : task.priority === 'medium' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                          {task.priority}
                        </span>
                        <select
                          value={task.status}
                          onChange={(e) => handleMove(task.id, e.target.value as TaskStatus)}
                          className="bg-bg-secondary border border-border-default rounded-lg px-2 py-1 text-[10px] text-text-secondary focus:outline-none focus:border-orange-500"
                        >
                          {STATUS_COLUMNS.map((opt) => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border-default p-6 text-center text-xs text-text-muted">
                    <Plus className="w-4 h-4 mx-auto mb-2" />
                    No tasks here yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

