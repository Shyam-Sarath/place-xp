import EventForm from '@/components/admin/EventForm';

export const metadata = {
  title: 'Create Event — Place XP Admin',
};

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Create Event</h1>
      <EventForm />
    </div>
  );
}
