# Gasolineras MX

Next.js 16 app (App Router, React 19, TypeScript, Tailwind v4, pnpm) that shows Mexican gas stations near the user — closest and cheapest — with an interactive map.

## What it does

1. User opens the app → browser asks for geolocation permission
2. Once location is granted, the app fetches nearby stations from the Mexican government API
3. Shows an interactive map (Leaflet + OpenStreetMap, no API key needed) with colored markers
4. Shows a sortable list of stations — toggle between "by distance" and "by price"
5. Highlights the closest station and the cheapest station with badges
6. Fuel type selector: Magna, Premium, Diesel

## Data source

`https://api.datos.gob.mx/v1/precio-gasolinas` — free public API from datos.gob.mx, no authentication needed.

Proxied via a Next.js API route at `/api/stations?lat=X&lng=Y&fuelType=magna` which also calculates distances server-side using the Haversine formula.

## Key files

- `app/page.tsx` — main client component ("use client"), owns geolocation state machine and fuel type selection
- `app/api/stations/route.ts` — fetches from datos.gob.mx, calculates Haversine distances, returns sorted Station[]
- `app/components/Map.tsx` — Leaflet map, blue marker = user, green = cheapest station, red = others
- `app/components/MapWrapper.tsx` — wraps Map with `dynamic(..., { ssr: false })` because Leaflet requires browser APIs
- `app/components/StationList.tsx` — sortable list, summary tiles for cheapest and closest at the top
- `app/components/StationCard.tsx` — card with price, distance, address, cheapest/closest badges
- `app/lib/stations.ts` — Station type, FuelType type
- `app/lib/distance.ts` — Haversine formula + distance formatter

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and grant location permission when prompted.

## Deploy

```bash
vercel deploy --prod
```

No environment variables needed — the datos.gob.mx API is fully public.

## What still needs work

These are things to continue building:

- **Verify the API response shape** — datos.gob.mx may return a different JSON structure than expected. Run `pnpm dev`, open the browser, grant location, and check the network tab for `/api/stations`. Adjust the response parsing in `app/api/stations/route.ts` to match the real shape.
- **Test the map** — confirm Leaflet markers render correctly. There's a known Next.js + Leaflet issue with default icons (broken image paths). If markers show as broken images, fix with the standard workaround in `Map.tsx`: delete `L.Icon.Default.prototype._getIconUrl` and set `L.Icon.Default.mergeOptions` with explicit CDN icon URLs.
- **UI polish** — the components are functionally complete but styling can be improved. The app uses Tailwind v4 (CSS-first, no tailwind.config.js needed).
- **Error states** — add user-facing error messages when geolocation is denied or the API fails.
- **Loading skeleton** — replace the generic loading spinner with a skeleton that matches the layout.
- **Vercel deployment** — connect the GitHub repo (github.com/Ferezoz/gasolineras) to Vercel for auto-deploys on push to main.
- **Filter by brand** — optionally add a brand filter (Pemex, BP, Shell, etc.)
- **Radius control** — let the user adjust the search radius (default 5 km)

## Architecture decisions

- Map is client-only (`ssr: false`) because Leaflet uses `window` and `document`
- The main `page.tsx` is a client component because it needs `navigator.geolocation`
- API route proxies the government API to avoid CORS issues in the browser
- No auth, no database — purely reads from the public government API
- pnpm is the package manager (not npm or yarn)
