# Cross-device progress sync options

The app currently stores progress with browser `localStorage`. This is simple and private-by-default, but each device/browser has its own data.

To see the same progress from multiple laptops or mobile devices, the app needs a shared data store or server.

## Option 1: Local-only storage

Best first step.

- Cost: free
- Complexity: very low
- Works offline in the same browser
- No automatic cross-device sync

Useful additions later:

- Export/import JSON backup
- Manual sync file download/upload
- More CSV exports

## Option 2: Laptop-hosted local server

Run a small server on a laptop that stores progress in SQLite or a JSON file.

- Cost: free
- Complexity: medium
- Real-time sync is possible with WebSockets or Server-Sent Events
- Works easily on the same Wi-Fi network
- Remote access requires networking setup

Remote access options:

- Tailscale private network
- Cloudflare Tunnel
- Router port forwarding with HTTPS and authentication

Security note: do not expose an unauthenticated write API to the public internet.

## Option 3: Supabase free tier

Good hosted option for real cross-device sync.

- Cost: free tier available
- Hosted Postgres database
- Built-in authentication options
- Browser client can read/write data with row-level security
- Good fit if the app grows beyond one user

Recommended shape:

- A `workout_entries` table keyed by date/session
- Authenticated user access only
- Row-level security so only the owner can read/write their data

## Option 4: Firebase free tier

Good for simple realtime sync.

- Cost: free tier available
- Firestore or Realtime Database
- Built-in auth
- Realtime updates across devices

This is a strong option if live sync matters more than SQL-style reporting.

## Option 5: Cloudflare Workers + D1/KV

Good lightweight serverless option.

- Cost: generous free tiers
- Static app can stay on GitHub Pages
- Worker API handles reads/writes
- D1 gives SQL storage; KV is simpler key-value storage

Recommended if you want a small custom API without running a laptop server.

## Option 6: GitHub-backed storage

Possible, but not ideal for frequent updates.

- Store progress in a private gist or repo file
- Use GitHub API to update it
- Avoid putting a GitHub token directly in browser code
- Better with a small server/proxy in front

This is better for occasional backup/export than realtime tracking.

## Practical recommendation

For now:

1. Deploy the static app to GitHub Pages.
2. Keep progress in `localStorage`.
3. Add JSON export/import if manual portability becomes annoying.

When automatic sync becomes important:

1. Use Supabase or Firebase for the fastest hosted path.
2. Use a laptop-hosted SQLite server only if you specifically want to own the data path and are comfortable keeping the laptop reachable.