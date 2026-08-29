# AIGC Opportunity Radar

A standalone, zero-build website for discovering AIGC creative contests and public bounty tasks.

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
- A catalog of official task-platform entries that are not yet safe to ingest automatically

Contest data originates from [Awesome AIGC Creative Contests](https://github.com/MartinDelophy/Awesome-AIGC-Creative-Contests). Task data originates from the companion [AIGC Opportunity Tasks](https://github.com/jackroc/aigc-opportunity-tasks) repository.

## Data synchronization

The `Sync upstream contest data` GitHub Actions workflow checks the upstream repository every 15 minutes. It validates `data/contests.json` against the upstream schema and mirrors the contest data, RSS feed, and calendar only when their contents change. Invalid or unavailable upstream responses fail safely without replacing the checked-in snapshot.

The workflow can also be run manually from the repository's **Actions** tab. Each successful data change is committed to `main`, giving the site a versioned snapshot that can be audited or rolled back.

The separate `Sync task directory` workflow mirrors normalized task data every 15 minutes on an offset schedule. Its upstream repository collects only public, curated sources, removes closed or stale entries, deduplicates canonical URLs, and publishes task RSS and calendar feeds. Account-only task platforms remain official directory links until an API, feed, or partnership is available.

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://127.0.0.1:8000/>. The page must be served over HTTP because browsers restrict JSON loading from `file://` URLs.

The default `/` route shows contest opportunities. The live task directory lives on the separate `/tasks/` route.

Useful checks:

```bash
node --test scripts/*.test.mjs
node scripts/sync-upstream.mjs --check
node scripts/sync-task-data.mjs --check
```

The phase-two opportunity matcher stores its profile only in the current browser and does not require an account or model API. See [Phase 2: Opportunity assistant](docs/phase-2-opportunity-assistant.md) for the current boundaries and the optional server-side AI follow-up.

## Deployment

The production site is hosted on Vercel at <https://www.aigccreative.com/>. Connect this repository to the existing Vercel project and track `main` as the Production Branch. Vercel then creates preview deployments for other branches and automatically promotes every successful `main` deployment to the production domain.

Normal releases only require a push to `main`; Vercel deploys that commit automatically. For a manual redeploy without a code change, open the Vercel project, select the latest production deployment, and choose **Redeploy**. Data workflows can be run manually from GitHub **Actions** without uploading local files.

## License

[MIT](LICENSE)
