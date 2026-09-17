# AIGC Opportunity Radar

A standalone website with build-time HTML snapshots for discovering AIGC creative contests and public bounty tasks.

## Features

- Full-text search across contest titles, organizers, regions, and eligibility
- Category, status, and fee filters
- Latest-verification and deadline sorting
- Chinese and English interfaces
- Responsive light and dark themes
- RSS and calendar subscription links
- Separate routes for contest opportunities and a live task directory
- Task reward clarity, visible competition, source trust, and AI-policy signals
- An optional browser-local opportunity profile with explainable task-fit scoring
- Per-task preflight, execution, submission, outreach, and AI-prompt helpers
- Saved per-task conversations with rules, local Codex, platform AI, or a user-supplied API
- Passwordless anonymous device sessions, with optional Supabase history synchronization
- A catalog of official task-platform entries that are not yet safe to ingest automatically

Contest data originates from [Awesome AIGC Creative Contests](https://github.com/MartinDelophy/Awesome-AIGC-Creative-Contests). Task data originates from the companion [AIGC Opportunity Tasks](https://github.com/jackroc/aigc-opportunity-tasks) repository.

## Data synchronization

The `Sync upstream contest data` GitHub Actions workflow checks the upstream repository every 15 minutes. It keeps `data/contests.json`, its original schema, RSS, and calendar as a separate core mirror. It also reads the upstream opt-in manifest and mirrors only the shards named in [`data/opportunity-selection.json`](data/opportunity-selection.json), validating each against the independent extension schema. Invalid or unavailable responses fail safely without replacing the checked-in snapshot.

This deployment currently opts into `global`, `cn-national`, and `cn-local`. A deployment serving a different audience can remove irrelevant IDs from the selection file without changing the upstream project or downloading those shards. The build publishes the selected records as readable HTML; the browser then refreshes the same selection and labels them as extensions; if extension loading fails, it still displays the core directory. The root RSS and calendar intentionally remain core-only for upstream compatibility.

The workflow can also be run manually from the repository's **Actions** tab. Each successful data change is committed to `main`, giving the site a versioned snapshot that can be audited or rolled back.

The separate `Sync task directory` workflow mirrors normalized task data every 15 minutes on an offset schedule. Its upstream repository collects only public, curated sources, removes closed or stale entries, deduplicates canonical URLs, and publishes task RSS and calendar feeds. Account-only task platforms remain official directory links until an API, feed, or partnership is available.

## Local preview

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:8000/>. This preview also enables **My local Codex** through the current computer's Codex login. The preview first builds `public/`. For a static-only preview, run `npm run build` and `python3 -m http.server 8000 --directory public`; the conversation UI then falls back to its rule-based provider.

The default `/` route shows contest opportunities. The live task directory lives on the separate `/tasks/` route.

Useful checks:

```bash
npm run verify
npm run build
```

The opportunity profile remains browser-local and does not require an account or model API. Phase three stores conversations in IndexedDB and can mirror them to Supabase behind a signed anonymous device session. It uses a random device ID, not browser fingerprinting. See [Phase 2: Opportunity assistant](docs/phase-2-opportunity-assistant.md) and [Phase 3: device sessions and saved conversations](docs/phase-3-device-conversations.md).

## Deployment

The production site is hosted on Vercel at <https://www.aigccreative.com/>. Connect this repository to the existing Vercel project and track `main` as the Production Branch. Vercel then creates preview deployments for other branches and automatically promotes every successful `main` deployment to the production domain.

Normal releases only require a push to `main`; Vercel deploys that commit automatically. For a manual redeploy without a code change, open the Vercel project, select the latest production deployment, and choose **Redeploy**. Data workflows can be run manually from GitHub **Actions** without uploading local files.

The site still deploys without backend variables. To enable cloud conversation history and hosted AI, apply the Supabase migration and configure the server-only Vercel variables described in the [phase-three deployment guide](docs/phase-3-device-conversations.md#hosted-setup-on-vercel).

### Google AdSense

All published pages retain the publisher verification meta tag for `ca-pub-9565558700858500`. The root [`ads.txt`](ads.txt) authorizes the same publisher. Ad-delivery scripts are intentionally not loaded in this release. Google supports the meta tag as a site connection method; see [Google's site connection guide](https://support.google.com/adsense/answer/7584263?hl=en).

Verify the live page source and [ads.txt](https://aigccreative.com/ads.txt) before requesting review. Original content and usability improvements support site readiness but do not guarantee approval. Configure ads and applicable consent controls only after reviewing the intended placement and updating the privacy notice for actual data practices.

### Published content

`npm run build` creates `public/` from the current data snapshot and shared card renderers. Vercel uses that directory for static assets; existing root `api/` functions remain server endpoints. Every successful data-sync commit rebuilds the published directory. Search, language and filters enhance the initial HTML; a failed refresh retains the last published records.

`lib/editorial.mjs` holds three original participation guides plus About, Privacy and Contact in Chinese and English. Their revision date changes when the text changes, not on every data sync. `/guides/` and `/en/guides/` link to them. The build also emits `robots.txt` and `sitemap.xml`. Generated output is not committed; edit source templates and run the build.

## License

[MIT](LICENSE)
