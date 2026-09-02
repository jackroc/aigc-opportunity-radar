# Phase 3: device sessions and saved conversations

Phase three adds an optional task conversation layer while keeping the public task directory useful without a login or model call.

## Identity model

The first version deliberately uses a random installation ID instead of a browser fingerprint or an account/password form.

- The browser creates a cryptographically random `dvc_<uuid>` installation ID and keeps it in `localStorage`.
- When Supabase is configured, `/api/session` exchanges that installation ID for a separate server-side device UUID.
- The server UUID is stored in a signed, `HttpOnly`, `SameSite=Lax` cookie. Client JavaScript cannot read or forge it.
- Font lists, Canvas output, screen size, IP address, and other fingerprint inputs are not collected.
- Clearing all site data removes the local identity. A retained server cookie can restore cloud history after IndexedDB is cleared, but this version does not provide cross-device or cookie-loss recovery.

The schema already includes a nullable `account_user_id`, so a later opt-in account can link existing device history without redesigning every conversation table.

## Conversation storage

All providers use the same thread and message records:

- IndexedDB is the primary browser store.
- `localStorage` is a bounded fallback when IndexedDB is unavailable.
- Supabase becomes an automatic second copy when the server environment is configured.
- Rules, local Codex, platform AI, and user-supplied API replies are all saved with their provider, status, model, and timestamps.
- A user-supplied API key exists only in the current page's memory and request. It is never written to IndexedDB, `localStorage`, Supabase, exports, or logs by the application.

The database migration is [202608290001_phase3_conversations.sql](../supabase/migrations/202608290001_phase3_conversations.sql). It creates device, thread, message, AI-run, and provider-connection tables. Browser roles have no direct table access; Vercel Functions use the server-only Supabase service role and always scope reads and writes to the signed device session.

## Local Codex mode

Install dependencies and start the project with:

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:8000/tasks/>. The local server binds only to loopback and uses the current machine's Codex login through the official Codex SDK. Each task assistant runs in an isolated temporary directory with read-only sandboxing, approvals disabled, and network/web search disabled.

This personal Codex login is intentionally local-only. A Vercel deployment cannot reuse a developer's desktop Codex session for public visitors.

## Hosted setup on Vercel

1. Create a Supabase project and run the phase-three migration in its SQL editor.
2. Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a random `DEVICE_SESSION_SECRET` of at least 32 characters to the Vercel project. Keep all three server-only.
3. Optionally add `OPENAI_API_KEY` and `OPENAI_MODEL` for platform-provided AI. It remains disabled until `PLATFORM_AI_ENABLED=true` is set deliberately. `PLATFORM_AI_DAILY_LIMIT` defaults to 10 runs per signed device per UTC day.
4. To accept a Responses-compatible user API endpoint, list its exact host in `AI_PROVIDER_ALLOWED_HOSTS`. `api.openai.com` is allowed by default.
5. Redeploy. `/api/session`, `/api/history`, and `/api/assistant` will be available alongside the static site.

If the Supabase variables are absent, task browsing, matching, rule-based answers, and local conversation history still work. Hosted model and user-API calls remain disabled until a signed cloud device session is available, preventing an unsigned caller from using the proxy.

The built-in daily cap limits ordinary accidental usage, but anonymous device data can be cleared. Before enabling platform-funded AI publicly, also configure a provider project budget and Vercel Firewall/rate limiting. Keeping `PLATFORM_AI_ENABLED=false` leaves local Codex and visitor-funded API mode available without exposing the site's model budget.

## Provider boundaries

| Mode | Credential owner | Runs where | History |
| --- | --- | --- | --- |
| Rules assistant | None | Browser | Local, plus Supabase when configured |
| My local Codex | Site operator on this computer | `npm run dev` only | Local |
| Platform AI | Site operator | Vercel Function | Local and Supabase |
| My own API | Visitor | Vercel/local proxy; key is request-only | Messages saved; key never saved |

User-supplied endpoints must implement an OpenAI Responses-compatible `/responses` route and be explicitly allowlisted in hosted environments. This avoids turning the endpoint into an unrestricted server-side request proxy.

Hosted AI requests are accepted only for a cloud thread owned by the signed device. The server uses the canonical task snapshot stored with that thread, records run status and token usage without recording credentials, and applies the platform-AI daily limit.

## Verification

```bash
npm run verify
```

The verification suite covers random device identity, signed sessions, local conversation persistence, provider URL restrictions, and all existing data/matcher checks.
