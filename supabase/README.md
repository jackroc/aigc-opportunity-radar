# Phase 3 conversation database

The public contest and task snapshots stay in Git. Supabase stores private device sessions and conversation history only.

## Apply the migration

1. Create a Supabase project.
2. Run `supabase/migrations/202608290001_phase3_conversations.sql` with the Supabase CLI or SQL editor.
3. Add these environment variables to the Vercel project for Preview and Production:

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEVICE_SESSION_SECRET` (at least 32 random characters)

Platform-funded AI additionally requires `OPENAI_API_KEY` and the explicit `PLATFORM_AI_ENABLED=true` switch. `PLATFORM_AI_DAILY_LIMIT` defaults to 10 calls per signed device per UTC day; use a provider budget and edge rate limiting as additional controls before public enablement.

The service-role key is server-only. Never add it to HTML, browser JavaScript, Git, or a `NEXT_PUBLIC_*`/public variable.

## Identity boundary

The browser receives an opaque, signed, HttpOnly device-session cookie. A separate random installation ID is kept locally for UI labeling and diagnostics. Neither value is derived from canvas, fonts, IP address, user agent, or other browser-fingerprinting signals.

Clearing site data loses this anonymous identity. The nullable `devices.account_user_id` column is reserved for a later account-linking flow without rewriting conversation ownership.
