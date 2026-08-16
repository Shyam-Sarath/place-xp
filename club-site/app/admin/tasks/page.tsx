import { createClient } from '@/lib/supabase/server';
import type { EventRow, TaskItemWithEvent } from '@/types/database';
import TasksBoard from '@/components/admin/TasksBoard';

export const metadata = {
  title: 'Tasks — Place XP Admin',
};

export default async function AdminTasksPage() {
  const supabase = await createClient();

  const [{ data: tasks }, { data: events }] = await Promise.all([
    supabase
      .from('tasks')
      .select('*, events(id, slug, title)')
      .order('updated_at', { ascending: false }),
    supabase.from('events').select('*').order('event_date', { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Tasks</h1>
        <p className="text-sm text-text-muted mt-1">{(tasks ?? []).length} items across the club</p>
      </div>

      <TasksBoard
        tasks={(tasks ?? []) as TaskItemWithEvent[]}
        events={(events ?? []) as EventRow[]}
      />
    </div>
  );
}

