'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Megaphone,
  FolderOpen,
  KanbanSquare,
  Briefcase,
  Ticket,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/participants', label: 'Participants', icon: Users },
  { href: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/resources', label: 'Resources', icon: FolderOpen },
  { href: '/admin/tasks', label: 'Tasks', icon: KanbanSquare },
  { href: '/admin/recruitment', label: 'Recruitment', icon: Briefcase },
  { href: '/admin/slot-booking', label: 'Slot Booking', icon: Ticket },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border-divider bg-bg-primary">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border-divider">
        <Image src="/logo.png" alt="Place XP" width={28} height={28} className="rounded-md" />
        <span className="text-sm font-semibold text-text-primary">
          Place <span className="text-orange-500">XP</span>
          <span className="text-text-muted font-normal ml-1.5">Admin</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? 'bg-orange-500/15 text-orange-500' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border-divider space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/[0.04] hover:text-text-primary transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/[0.04] hover:text-status-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
