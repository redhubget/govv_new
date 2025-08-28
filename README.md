
# Go VV – PWA (Mock Backend + Offline)

## Features
- Pages: Home, Login/Signup (OTP mock), Dashboard, Profile, GPS Tracking, Activities, Activity Detail (replay + CSV/GPX), Shop (5 accessories), Warranty (lookup + claim), Contact, Service Centers (list+map+search), Bike Detail (lock/unlock + chart), Settings (theme + privacy).
- Strava-like: start/pause/stop, on-map polyline, saved metadata, paginated history, replay with moving marker, share/export stubs.
- Gamification: points/levels/badges/streaks (client) with server stubs in `src/api.js`.
- Theming: light/dark + font size; ThemeSwitcher component.
- Offline: PWA manifest + service worker; app shell & recent activities cached. Map tiles are not cached due to provider policies.
- Local DB mode: `VITE_USE_LOCAL_DB=true` uses localStorage JSON collections.

## Setup
```bash
npm i
npm run dev
```

### Environment
Copy `.env.example` to `.env` and adjust:
- `VITE_USE_LOCAL_DB=true` to use local JSON (no server required).
- `VITE_API_BASE=https://your.api.host` when you hook a backend.

## Where to add credentials
- If you add a real DB/API, put your base URL in `.env` and modify `src/api.js` to call your endpoints.

## Exporting Activities
- Open an activity detail → Export CSV / GPX buttons.

## Privacy
- Settings → toggle **Save GPS history** to stop storing routes locally.

## Warranty API (Mock)
- `api.warranty(serial)` -> returns `{serial, purchase_date, valid_until, status, claims[]}`
- `api.warrantyClaim({serial, user_id, description, attachments})` -> persists claim

## Service Centers (Mock)
- `api.serviceCenters({city})` -> filters by city

## Telemetry & Bikes (Mock)
- `api.lockBike(id, locked)`, `api.getBike(id)`, `api.latestTelemetry(bike_id)`
- Tracking: `api.trackingStart`, `api.addTrackPoint`, `api.trackingStop`

## Notes
- Icons/sounds/images are placeholders. Replace with your brand assets.
- Keep code modular; pages/components are split for readability.
