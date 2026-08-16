# Git Changes Summary

This file lists the commits and file changes synchronized from the remote GitHub repository `https://github.com/Shyam-Sarath/place-xp` to your local codespace on **August 16, 2026**.

## Key Features & Enhancements Added
1. **Supabase Backend Integration**:
   - Added configuration, helper utilities, and middleware under `club-site/lib/supabase/` (client, server, and middleware).
   - Added database schema SQL files, migrations, role-based auth configuration, RLS policies, and admin bootstrap scripts under `club-site/supabase/`.
2. **Admin Panel & Controls**:
   - Added dashboard pages for managing events, registrations, participants, and layouts under `club-site/app/admin/`.
   - Added components for editing Announcements, FAQs, Meeting Links, Organizers, Resources, Timelines, and Events.
3. **User Dashboard & Event Pages**:
   - Created the User Dashboard (`club-site/app/dashboard/`) and event registration modal.
   - Added event detail pages (`club-site/app/events/`) with registration actions and interactive components.
4. **Presentation Uploading**:
   - Added file upload components and state management for user presentation submissions.
5. **Navigation Improvements**:
   - Fixed navigation scroll spy, order, and visual fixes for `Navbar` and `GooeyNav`.

---

## Commits Pulled
* **53428b0**: Merge pull request #2 from simplystunning99087/feature/presentation-upload
* **b43cf58**: Resolve merge conflicts keeping local versions
* **e8916ef**: Include presentation project files
* **433c168**: feat: add presentation upload feature and types
* **33151e7**: feat: add presentation upload feature and types
* **12c9d55**: feat: connect Supabase backend and fix navbar scroll spy section switching
* **8024011**: Merge pull request #1 from Shyam-Sarath/santhosh/navbar-fixes
* **bab143e**: Fixed the navabr scroll and the navigation order

---

## File Status List

Below is the list of files modified (`M`) or added (`A`):

### Root Level
* `M` [.gitignore](file:///d:/CLUB-SITE/.gitignore)
* `A` [README.md](file:///d:/CLUB-SITE/README.md)
* `A` [server.js](file:///d:/CLUB-SITE/server.js)

### Application Routes (`club-site/app/`)
* `A` [club-site/app/admin/events/[slug]/edit/AdminEventEditorClient.tsx](file:///d:/CLUB-SITE/club-site/app/admin/events/[slug]/edit/AdminEventEditorClient.tsx)
* `A` [club-site/app/admin/events/[slug]/edit/page.tsx](file:///d:/CLUB-SITE/club-site/app/admin/events/[slug]/edit/page.tsx)
* `A` [club-site/app/admin/events/new/page.tsx](file:///d:/CLUB-SITE/club-site/app/admin/events/new/page.tsx)
* `A` [club-site/app/admin/events/page.tsx](file:///d:/CLUB-SITE/club-site/app/admin/events/page.tsx)
* `A` [club-site/app/admin/layout.tsx](file:///d:/CLUB-SITE/club-site/app/admin/layout.tsx)
* `A` [club-site/app/admin/page.tsx](file:///d:/CLUB-SITE/club-site/app/admin/page.tsx)
* `A` [club-site/app/admin/participants/page.tsx](file:///d:/CLUB-SITE/club-site/app/admin/participants/page.tsx)
* `A` [club-site/app/admin/registrations/page.tsx](file:///d:/CLUB-SITE/club-site/app/admin/registrations/page.tsx)
* `A` [club-site/app/dashboard/events/[slug]/EventDashboardClient.tsx](file:///d:/CLUB-SITE/club-site/app/dashboard/events/[slug]/EventDashboardClient.tsx)
* `A` [club-site/app/dashboard/events/[slug]/page.tsx](file:///d:/CLUB-SITE/club-site/app/dashboard/events/[slug]/page.tsx)
* `A` [club-site/app/dashboard/page.tsx](file:///d:/CLUB-SITE/club-site/app/dashboard/page.tsx)
* `A` [club-site/app/events/EventsPageClient.tsx](file:///d:/CLUB-SITE/club-site/app/events/EventsPageClient.tsx)
* `A` [club-site/app/events/[slug]/page.tsx](file:///d:/CLUB-SITE/club-site/app/events/[slug]/page.tsx)
* `A` [club-site/app/events/page.tsx](file:///d:/CLUB-SITE/club-site/app/events/page.tsx)
* `A` [club-site/app/login/page.tsx](file:///d:/CLUB-SITE/club-site/app/login/page.tsx)
* `M` [club-site/app/page.tsx](file:///d:/CLUB-SITE/club-site/app/page.tsx)

### React Components (`club-site/components/`)
* `A` [club-site/components/admin/AdminAnnouncementsEditor.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminAnnouncementsEditor.tsx)
* `A` [club-site/components/admin/AdminFAQsEditor.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminFAQsEditor.tsx)
* `A` [club-site/components/admin/AdminMeetingLinksEditor.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminMeetingLinksEditor.tsx)
* `A` [club-site/components/admin/AdminOrganizersEditor.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminOrganizersEditor.tsx)
* `A` [club-site/components/admin/AdminResourcesEditor.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminResourcesEditor.tsx)
* `A` [club-site/components/admin/AdminSidebar.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminSidebar.tsx)
* `A` [club-site/components/admin/AdminTimelineEditor.tsx](file:///d:/CLUB-SITE/club-site/components/admin/AdminTimelineEditor.tsx)
* `A` [club-site/components/admin/EventForm.tsx](file:///d:/CLUB-SITE/club-site/components/admin/EventForm.tsx)
* `A` [club-site/components/admin/FileUploadInput.tsx](file:///d:/CLUB-SITE/club-site/components/admin/FileUploadInput.tsx)
* `A` [club-site/components/admin/ParticipantsTable.tsx](file:///d:/CLUB-SITE/club-site/components/admin/ParticipantsTable.tsx)
* `A` [club-site/components/admin/RegistrationsTable.tsx](file:///d:/CLUB-SITE/club-site/components/admin/RegistrationsTable.tsx)
* `A` [club-site/components/auth/AuthForm.tsx](file:///d:/CLUB-SITE/club-site/components/auth/AuthForm.tsx)
* `A` [club-site/components/dashboard/AnnouncementsView.tsx](file:///d:/CLUB-SITE/club-site/components/dashboard/AnnouncementsView.tsx)
* `A` [club-site/components/dashboard/FAQsView.tsx](file:///d:/CLUB-SITE/club-site/components/dashboard/FAQsView.tsx)
* `A` [club-site/components/dashboard/MeetingLinksView.tsx](file:///d:/CLUB-SITE/club-site/components/dashboard/MeetingLinksView.tsx)
* `A` [club-site/components/dashboard/OrganizersView.tsx](file:///d:/CLUB-SITE/club-site/components/dashboard/OrganizersView.tsx)
* `A` [club-site/components/dashboard/ResourcesView.tsx](file:///d:/CLUB-SITE/club-site/components/dashboard/ResourcesView.tsx)
* `A` [club-site/components/dashboard/TimelineView.tsx](file:///d:/CLUB-SITE/club-site/components/dashboard/TimelineView.tsx)
* `A` [club-site/components/events/EventCard.tsx](file:///d:/CLUB-SITE/club-site/components/events/EventCard.tsx)
* `A` [club-site/components/events/EventRegisterAction.tsx](file:///d:/CLUB-SITE/club-site/components/events/EventRegisterAction.tsx)
* `A` [club-site/components/events/FileUpload.tsx](file:///d:/CLUB-SITE/club-site/components/events/FileUpload.tsx)
* `A` [club-site/components/events/RegistrationModal.tsx](file:///d:/CLUB-SITE/club-site/components/events/RegistrationModal.tsx)
* `M` [club-site/components/reactbits/GooeyNav.tsx](file:///d:/CLUB-SITE/club-site/components/reactbits/GooeyNav.tsx)
* `M` [club-site/components/sections/Events.tsx](file:///d:/CLUB-SITE/club-site/components/sections/Events.tsx)
* `M` [club-site/components/sections/Footer.tsx](file:///d:/CLUB-SITE/club-site/components/sections/Footer.tsx)
* `M` [club-site/components/sections/Navbar.tsx](file:///d:/CLUB-SITE/club-site/components/sections/Navbar.tsx)

### Utilities, Database & Supabase Configuration
* `A` [club-site/lib/supabase/client.ts](file:///d:/CLUB-SITE/club-site/lib/supabase/client.ts)
* `A` [club-site/lib/supabase/middleware.ts](file:///d:/CLUB-SITE/club-site/lib/supabase/middleware.ts)
* `A` [club-site/lib/supabase/server.ts](file:///d:/CLUB-SITE/club-site/lib/supabase/server.ts)
* `M` [club-site/package-lock.json](file:///d:/CLUB-SITE/club-site/package-lock.json)
* `M` [club-site/package.json](file:///d:/CLUB-SITE/club-site/package.json)
* `A` [club-site/proxy.ts](file:///d:/CLUB-SITE/club-site/proxy.ts)
* `A` [club-site/supabase/migrations/20240320000000_add_event_submissions.sql](file:///d:/CLUB-SITE/club-site/supabase/migrations/20240320000000_add_event_submissions.sql)
* `A` [club-site/supabase/schema.sql](file:///d:/CLUB-SITE/club-site/supabase/schema.sql)
* `A` [club-site/supabase/security-fix-revert-role-trigger.sql](file:///d:/CLUB-SITE/club-site/supabase/security-fix-revert-role-trigger.sql)
* `A` [club-site/supabase/step10-bootstrap-first-admin.sql](file:///d:/CLUB-SITE/club-site/supabase/step10-bootstrap-first-admin.sql)
* `A` [club-site/supabase/step11-admin-allowlist.sql](file:///d:/CLUB-SITE/club-site/supabase/step11-admin-allowlist.sql)
* `A` [club-site/supabase/step5-schema-updates.sql](file:///d:/CLUB-SITE/club-site/supabase/step5-schema-updates.sql)
* `A` [club-site/supabase/step6-role-based-auth.sql](file:///d:/CLUB-SITE/club-site/supabase/step6-role-based-auth.sql)
* `A` [club-site/supabase/step7-registration-status.sql](file:///d:/CLUB-SITE/club-site/supabase/step7-registration-status.sql)
* `A` [club-site/supabase/step8-rls-policies.sql](file:///d:/CLUB-SITE/club-site/supabase/step8-rls-policies.sql)
* `A` [club-site/supabase/step9-profile-email.sql](file:///d:/CLUB-SITE/club-site/supabase/step9-profile-email.sql)
* `A` [club-site/types/database.ts](file:///d:/CLUB-SITE/club-site/types/database.ts)
