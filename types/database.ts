// Hand-written types matching supabase/schema.sql.
// Once the project is live you can replace this with generated types via:
//   npx supabase gen types typescript --project-id <ref> > types/database.ts

export type EventStatus = 'upcoming' | 'ongoing' | 'past';
export type UserRole = 'student' | 'organizer' | 'admin';
export type TimelineStepStatus = 'upcoming' | 'current' | 'done';
export type PaymentStatus = 'not_required' | 'pending' | 'paid' | 'waived';
export type AttendanceStatus = 'registered' | 'attended' | 'no_show';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  reg_no: string | null;
  department: string | null;
  year: string | null;
  section: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  objectives: string | null;
  speaker_info: string | null;
  venue: string | null;
  event_date: string | null;
  event_time: string | null;
  registration_deadline: string | null;
  seats_total: number | null;
  banner_url: string | null;
  status: EventStatus;
  published: boolean;
  archived: boolean;
  rules: string | null;
  requirements: string | null;
  created_by: string | null;
  created_at: string;
}

export interface EventTimelineStep {
  id: string;
  event_id: string;
  step_name: string;
  step_order: number;
  status: TimelineStepStatus;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  full_name: string | null;
  reg_no: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  year: string | null;
  section: string | null;
  payment_status: PaymentStatus;
  attendance_status: AttendanceStatus;
  approval_status: ApprovalStatus;
  registered_at: string;
}

// Joined shapes used by the admin Participants/Registrations pages.
export interface RegistrationWithEvent extends Registration {
  events: Pick<EventRow, 'id' | 'slug' | 'title' | 'status' | 'event_date'> | null;
}

export interface ParticipantWithStats extends Profile {
  registrationCount: number;
}

export interface Announcement {
  id: string;
  event_id: string;
  title: string;
  content: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AnnouncementWithEvent extends Announcement {
  events: Pick<EventRow, 'id' | 'slug' | 'title'> | null;
}

export interface Resource {
  id: string;
  event_id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface ResourceWithEvent extends Resource {
  events: Pick<EventRow, 'id' | 'slug' | 'title'> | null;
}

export interface MeetingLink {
  id: string;
  event_id: string;
  title: string;
  platform: string | null;
  url: string;
}

export interface FAQ {
  id: string;
  event_id: string;
  question: string;
  answer: string;
  order_index: number;
}

export interface EventOrganizer {
  id: string;
  event_id: string;
  name: string;
  photo_url: string | null;
  position: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
}

export interface TaskItem {
  id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface TaskItemWithEvent extends TaskItem {
  events: Pick<EventRow, 'id' | 'slug' | 'title'> | null;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  contact_email: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  updated_at: string | null;
}
