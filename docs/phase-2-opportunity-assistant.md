# Phase 2: Opportunity assistant

Phase two starts with an optional, local-first opportunity matcher instead of making a model call a prerequisite for browsing tasks.

## Shipped in this branch

- A browser-local profile for strengths, time, goals, reward preference, competition tolerance, and AI-use preference
- Transparent task-fit scoring based only on published task facts and the user's stated preferences
- Visible reasons and cautions; fit is explicitly not presented as a success, acceptance, or payout probability
- A deterministic action plan covering preflight checks, scope definition, execution evidence, and submission review
- A maintainer outreach template that confirms availability, assignment, reward, acceptance, and AI-use rules before high-effort work
- A copyable prompt for any AI assistant; nothing is sent automatically
- Stable task-plan URLs through the `task` query parameter

The profile is stored under `opportunity-profile-v1` in browser `localStorage`. It is not uploaded and does not require an account.

## Why the first assistant is deterministic

The public site is currently a zero-build static deployment. Putting a model API key in browser JavaScript would expose it, while asking every visitor for a key would turn AI into a barrier. The deterministic matcher provides immediate value, stays auditable, and establishes the UI and data contracts needed by a later conversational layer.

## Model-backed follow-up

Phase three now adds a server-side `/api/assistant` endpoint with:

- the selected public task ID;
- an explicit subset of profile preferences approved by the user;
- the requested operation, such as fit explanation, requirement clarification, execution plan, or submission review;
- citations back to task fields and official URLs;
- output warnings whenever reward, acceptance, deadline, or AI-use rules are unknown.

The client continues to work without this endpoint. Model output extends the deterministic checklist; it does not replace official rules or claim a probability of winning a reward. See [Phase 3: device sessions and saved conversations](phase-3-device-conversations.md) for local Codex, hosted AI, user-supplied API, storage, and anonymous-device details.

## Verification

```bash
node --test scripts/opportunity-matcher.test.mjs
node --test scripts/*.test.mjs
```
