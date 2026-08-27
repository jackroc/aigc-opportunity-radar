# AIGC Opportunity Radar

A standalone, zero-build website for discovering active and officially announced AIGC creative contests.

## Features

- Full-text search across contest titles, organizers, regions, and eligibility
- Category, status, and fee filters
- Latest-verification and deadline sorting
- Chinese and English interfaces
- Responsive light and dark themes
- RSS and calendar subscription links
- A reserved channel for future task-platform recommendations

Contest data originates from [Awesome AIGC Creative Contests](https://github.com/MartinDelophy/Awesome-AIGC-Creative-Contests).

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://127.0.0.1:8000/>. The page must be served over HTTP because browsers restrict JSON loading from `file://` URLs.

## Deployment

Pushes to `main` deploy automatically through GitHub Pages. Configure the publishing source as **GitHub Actions** under **Settings → Pages**, then add a custom domain from the same page when ready.

## License

[MIT](LICENSE)
