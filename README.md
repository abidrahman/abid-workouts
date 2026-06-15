# Abid Workouts

A personal web app for tracking a 3-month training block for Mt. Baker summit preparation and a supported Lake Union swim.

The app includes a calendar, workout details, training phase overview, swim progression, and cross-device progress tracking via Firebase.

## Hosted

```
https://abidrahman.github.io/abid-workouts/
```

## Requirements

- Node.js `20.19+`
- npm

## Getting started

```bash
npm install
npm run dev        # local dev server at http://127.0.0.1:5173/
npm run dev:lan    # accessible on LAN (for mobile testing)
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview production build locally
```

## Project structure

```
.
├── .github/workflows/
│   ├── deploy-pages.yml   # deploys dist/ to GitHub Pages on push to main
│   ├── ci.yml             # build check on PRs
│   └── fetch-strava.yml   # fetches Strava activities hourly → data/activities.json
├── backend/               # Firebase config and Firestore rules
├── data/
│   └── activities.json    # auto-updated hourly by fetch-strava workflow
├── scripts/
│   ├── build.mjs          # production build (esbuild bundle)
│   ├── dev-server.mjs     # local dev server
│   └── fetch-strava.mjs   # Strava API fetch script (run by GitHub Actions)
├── app.js                 # main app logic
├── app-api.js             # Firebase/Firestore sync layer
├── index.html             # app shell
├── styles.css             # styles
└── package.json
```

## Features

- **Calendar** — check off workouts, reschedule sessions via drag-and-drop
- **Strava sync** — activities fetched hourly via GitHub Actions, auto-matched to planned workouts
- **Cross-device sync** — progress synced via Firebase Firestore (free Spark plan)

## GitHub Actions secrets required

For the Strava fetch workflow to work, add these to the repo secrets:

| Secret | Description |
|---|---|
| `STRAVA_CLIENT_ID` | From https://www.strava.com/settings/api |
| `STRAVA_CLIENT_SECRET` | From https://www.strava.com/settings/api |
| `STRAVA_REFRESH_TOKEN` | OAuth refresh token with `activity:read_all` scope |

## Progress storage

Progress is stored in `localStorage` (instant) and synced to Firestore in the background. Data persists across devices using a stable user ID stored in `localStorage`.
