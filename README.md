# AIGC Opportunity Radar

A standalone, zero-build website for discovering active and officially announced AIGC creative contests.

## Features

- Full-text search across contest titles, organizers, regions, and eligibility
- Category, status, and fee filters
- Latest-verification and deadline sorting
- Chinese and English interfaces
- Responsive light and dark themes
- RSS and calendar subscription links
- Separate routes for contest opportunities and the task-platform product exploration

Contest data originates from [Awesome AIGC Creative Contests](https://github.com/MartinDelophy/Awesome-AIGC-Creative-Contests).

## Data synchronization

The `Sync upstream contest data` GitHub Actions workflow checks the upstream repository every 15 minutes. It validates `data/contests.json` against the upstream schema and mirrors the contest data, RSS feed, and calendar only when their contents change. Invalid or unavailable upstream responses fail safely without replacing the checked-in snapshot.

The workflow can also be run manually from the repository's **Actions** tab. Each successful data change is committed to `main`, giving the site a versioned snapshot that can be audited or rolled back.

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://127.0.0.1:8000/>. The page must be served over HTTP because browsers restrict JSON loading from `file://` URLs.

The default `/` route shows contest opportunities. The task-platform product exploration lives on the separate `/tasks/` route.

## Deployment

The production site is hosted on Vercel at <https://www.aigccreative.com/>. Connect this repository to the existing Vercel project and track `main` as the Production Branch. Vercel then creates preview deployments for other branches and automatically promotes every successful `main` deployment to the production domain.

## License

[MIT](LICENSE)
