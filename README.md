# Abid Workouts

A mini web app for tracking a 3-month training block for Mt. Baker summit preparation and a supported Lake Union swim.

The app includes a calendar, workout details, training phase overview, swim progression, and browser-based progress tracking.

## Hosted target

The app is deployed at:

```text
https://abidrahman.github.io/abid-workouts/
```

## Requirements

- Node.js `20.19+` or newer
- npm

The app has no third-party runtime dependencies. The npm scripts use small Node.js helper scripts in this repo.

## Getting started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

The dev server will print a local URL, usually:

```text
http://127.0.0.1:5173/
```

To test from a phone or another laptop on the same Wi-Fi network, run:

```bash
npm run dev:lan
```

Then open the LAN URL printed by the server from the other device.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project structure

```text
.
├── .github/workflows/deploy-pages.yml  # GitHub Pages deployment workflow
├── .github/workflows/ci.yml            # Build verification for branches/PRs
├── docs/                               # Deployment and sync planning notes
├── scripts/                            # Dependency-free build/dev helpers
├── app.js                              # App data, rendering, interactions, local storage
├── index.html                          # App shell
├── site.webmanifest                    # Basic installable web app metadata
├── styles.css                          # App styles
└── package.json                        # npm scripts and project metadata
```

## Progress storage

Progress is currently stored in each browser with `localStorage`. That means the hosted app will load on laptops and mobile devices, but progress does **not** automatically sync between devices yet.

See [`docs/SYNC_OPTIONS.md`](docs/SYNC_OPTIONS.md) for no-cost and low-maintenance options for future cross-device sync.

## Deployment

The repo includes a GitHub Actions workflow that builds the app and publishes the generated `dist/` folder to GitHub Pages whenever `main` changes.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the expected GitHub Pages settings and custom-domain notes.

> Note: GitHub Pages from private repositories may require a paid GitHub plan depending on account/repository settings. If Pages cannot be enabled while this repo is private, make the repo public or use another free static host for the built `dist/` output.

## Data privacy

This app is personal training guidance and local progress tracking. It is not medical advice. Adjust around pain, professional recommendations, weather, and logistics.