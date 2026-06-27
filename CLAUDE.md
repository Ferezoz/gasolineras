# Tankeo ⛽

Next.js 16 app (App Router, React 19, TypeScript, Tailwind v4, pnpm) that shows Mexican gas stations near the user — closest and cheapest — with an interactive map. Live at [tankeo.mx](https://tankeo.mx). Works as a PWA (installable on iOS via "Add to Home Screen").

## What it does

1. User opens the app → silent geolocation check on load (skips landing if already granted)
2. If not granted → landing screen with "Compartir ubicación" button
3. Once granted, fetches nearby stations from CRE XML feeds (10 km radius, 30 stations max)
4. Shows an interactive Leaflet map with price-labeled markers (green = cheapest, blue = closest, white = selected)
5. Shows a sortable list — sort by price (default) or distance
6. Summary tiles for cheapest and closest stations at the top of the list
7. Fuel type selector: Magna, Premium, Diesel
8. "Buscar en esta zona" button appears when panning the map — re-fetches for the new center
9. Re-center button (◎) returns map and results to GPS location
10. "Cómo llegar" opens preferred navigation app (Google Maps / Apple Maps / Waze — saved in localStorage); also available in map marker popups
11. Map marker popups are compact: name, price, distance, "Cómo llegar" link
12. Light/dark theme follows system preference
13. Bottom fade gradient on station list hints at scrollability

## Data source

Two public XML endpoints from CRE (Comisión Reguladora de Energía), no authentication needed:

- **Places**: `https://publicacionexterna.azurewebsites.net/publicaciones/places` — ~11,000 stations with name, CRE permit ID (`cre_id`), and lat/lng (`<x>` = longitude, `<y>` = latitude)
- **Prices**: `https://publicacionexterna.azurewebsites.net/publicaciones/prices` — current prices per station (regular, premium, diesel), keyed by `place_id`

The old `api.datos.gob.mx/v1/precio-gasolinas` API is dead. The new `datos.gob.mx` (Sistema Ajolote) only offers monthly CSV downloads with no coordinates. These CRE Azure endpoints are the only live real-time source with per-station location + prices.

The API route at `/api/stations?lat=X&lng=Y&fuelType=magna` fetches both XMLs in parallel (cached 1 hour by Next.js), parses with regex, joins on `place_id`, strips legal suffixes from station names, filters to 10 km using Haversine, and returns the 30 nearest stations sorted by distance.

## Key files

- `app/page.tsx` — two-column layout, geolocation state machine, fuel type + search center state
- `app/api/stations/route.ts` — fetches CRE XML feeds, parses, joins by `place_id`, filters by distance
- `app/components/Map.tsx` — Leaflet map with price divIcons, "Buscar en esta zona" button, re-center button
- `app/components/MapWrapper.tsx` — wraps Map with `dynamic(..., { ssr: false })`
- `app/components/StationList.tsx` — sort toggle, summary tiles (cheapest + closest), scrollable card list with bottom fade
- `app/components/StationCard.tsx` — price, distance, badges, "Cómo llegar" link
- `app/components/DirectionsButton.tsx` — directions link + `MapAppPicker` modal for nav app preference
- `app/lib/stations.ts` — `Station` type, `FuelType` type
- `app/lib/distance.ts` — Haversine formula + distance formatter
- `app/icon.tsx` — auto-generated favicon (32×32)
- `app/apple-icon.tsx` — auto-generated Apple touch icon (180×180), also used as logo on landing screen and header
- `public/manifest.json` — PWA manifest

## Analytics

- **Vercel Analytics** — pageviews, visitors, referrers (enabled, production only)
- **Vercel Speed Insights** — Core Web Vitals (enabled, production only)
- Custom event tracking (PostHog) planned for Phase 2 — see `GROWTH.md`

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and grant location permission when prompted.

**Note**: geolocation requires a secure context — use `localhost:3000`, not the container's IP address directly.

## Deploy

Push to `main` — Vercel auto-deploys on every push. No environment variables needed.

## Architecture decisions

- Map is client-only (`ssr: false`) because Leaflet uses `window` and `document`
- `page.tsx` is a client component because it needs `navigator.geolocation`
- API route proxies CRE feeds to avoid CORS; XML parsed with regex (no library needed — feed structure is simple and stable)
- Server-side Next.js fetch cache (`revalidate: 3600`) means CRE XMLs are fetched at most once per hour
- Station names are title-cased and stripped of Mexican legal suffixes (Sa De Cv, S De Rl De Cv, etc.)
- Search center state (`searchCenter`) separates "where to search" from GPS location — enables pan-and-search without losing the user's position
- Nav app preference stored in `localStorage`, read on mount
- Light/dark theme via Tailwind `dark:` prefix (media query, no toggle needed)
- PWA: manifest + Apple meta tags + `viewport-fit=cover` + safe area insets via `.safe-top` CSS class on headers (NOT on body — body padding would push height beyond 100dvh and cause page scroll)
- `dvh` units used throughout to handle mobile browser chrome correctly
- Mobile scroll lock: `html, body { overflow: hidden }` (safe since heights are exactly 100dvh — nothing clips) + `overscroll-contain` on the list div prevents iOS rubber-band bounce
- Nav app preference (`mapapp-changed` custom event): `MapAppPicker` dispatches it on select, `useMapApp` listens — this is needed because `storage` events don't fire in the same tab
- Geolocation flow: `checking` state on load → silent `getCurrentPosition` call → if granted skip landing screen, if not show idle screen. `navigator.permissions` API is unreliable on iOS so we call `getCurrentPosition` directly
- iOS PWA geolocation: permission popup may not appear in standalone mode if permission was previously denied at domain level — user must reset via Safari AA menu → Website Settings → Location
- Leaflet popup font overridden to page system font (`.leaflet-container { font-family: inherit }`) — Leaflet defaults to Helvetica Neue which renders arrows differently
- `!text-gray-600` (Tailwind `!important`) needed on Leaflet popup links — Leaflet CSS has higher specificity than regular Tailwind classes for anchor colors
- `/apple-icon` (no extension) is the correct path for Next.js metadata-generated images — `/apple-icon.png` returns 404
- pnpm is the package manager (not npm or yarn)

## Growth & Business

See `GROWTH.md` for the full phased growth plan — distribution steps, monetization options, analytics events to add, and product pivots. Currently in Phase 1 (seeding).

- Brand: **Tankeo** — domain tankeo.mx registered
- Future brand domain: Tankeo.com (currently $6k premium, defer to Phase 3-4)
- SEO keyword domain: GasolinaBarata.mx — consider buying in Phase 2 if most traffic comes from Google
