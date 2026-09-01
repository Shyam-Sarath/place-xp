# Place XP — Club Web Application (`club-site`)

This directory contains the Next.js 16 (App Router) web application for **Place XP** — VIT Chennai's official placement-focused technical club website.

Included features:
- Public event carousel and complete events page
- Admin event creation with manual status selection and Upcoming automation
- Participant registration and dashboard
- One-seat recruitment slot booking with live availability updates
- Admin slot management and booking visibility
- Vercel cron endpoint for ten-minute booking reminders
- Sticky scrollable containers with fixed headers for admin tables

For complete project documentation, full architecture diagrams, database schemas, and screenshots, please refer to the [Root README](../README.md).

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   RESEND_API_KEY=your-resend-api-key
   CRON_SECRET=your-cron-secret
   REMINDER_FROM_EMAIL=noreply@your-domain.com
   ```

3. Database Setup:
   Run `supabase/migration_event_slots.sql` in the Supabase SQL editor before using slot booking. If the project already exists and reports a missing `instructions` column, run `supabase/fix_event_columns.sql` once. For a new project, `supabase/schema.sql` includes the complete schema.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

## Deploy to Vercel

Use `club-site` as the Vercel project root and configure the environment variables above. The included `vercel.json` schedules reminder checks every ten minutes.

