# Tankeo — Growth Plan

## Current State
- Gas station finder for Mexico (closest + cheapest)
- Real-time CRE data, mobile-first, works as PWA
- Vercel Analytics enabled (pageviews + speed insights)
- No monetization, no user accounts, no ads
- Domain: tankeo.mx (registered, needs to be connected to Vercel)

## Domain & Branding Strategy
- **Phase 1**: Launch as **Tankeo.mx** — memorable, shareable, works for word-of-mouth seeding
- **Phase 2**: Buy **GasolinaBarata.mx** if SEO data shows most traffic comes from Google searches — redirect to Tankeo.mx
- **Phase 3-4**: Evaluate **Tankeo.com** once there's revenue to justify it (currently $6,000 USD premium — not worth it now)

---

## Phase 1 — Launch & Seed (0–100 users) ← YOU ARE HERE

Goal: get real humans using it and get first feedback.

### Domain & Branding
- [x] Register **Tankeo.mx**
- [x] Point Tankeo.mx to Vercel deployment
- [x] Update app title and metadata to "Tankeo"
- [x] Rename GitHub repo to "tankeo"
- [x] Rename Vercel project to "tankeo"
- [ ] Skip GasolinaBarata.mx for now — revisit in Phase 2 when SEO matters

### SEO Foundation (do now, pays off later)
- [ ] Set up Google Search Console — search.google.com/search-console, add Tankeo.mx, submit sitemap
- [ ] Do NOT build city pages yet — domain needs traffic and trust first, add in Phase 2

### Distribution (manual seeding)
- [ ] Share in r/mexico and r/cdmx — post with screenshot showing cheapest gas near a popular area
- [ ] Share in r/autos_mexico or similar car subreddits
- [ ] Post in Facebook groups: "Conductores CDMX", "Automovilistas México", "Gasolina México"
- [ ] Send to 10 friends/family who drive and ask them to share if useful
- [ ] Post on your personal Twitter/X: "Hice una app para encontrar la gasolina más barata cerca de ti — tankeo.mx"
- [ ] Submit to Product Hunt (pick a Tuesday–Thursday, prepare short description and screenshot)
- [ ] Submit to Hacker News "Show HN" post

### When to move to Phase 2
When you have 50+ daily users consistently or clear demand signal (people sharing it, asking for features).

---

## Phase 2 — Traction & SEO (100–1,000 users)

Goal: build organic traffic engine and understand user behavior.

### Analytics
- [ ] Add PostHog custom events (1M/month free — no cost yet)
  - `directions_clicked` — which station, which map app
  - `fuel_type_changed` — magna/premium/diesel split
  - `search_area_moved` — how often users pan and re-search
  - `permission_denied` — landing screen drop-off rate
  - `cheapest_vs_closest` — which tile gets clicked more
- [ ] Review Vercel Analytics weekly — top referrers, top cities, mobile vs desktop split

### SEO — City Landing Pages
- [ ] Add `/gasolineras/cdmx` — "Gasolineras más baratas en CDMX"
- [ ] Add `/gasolineras/guadalajara`
- [ ] Add `/gasolineras/monterrey`
- [ ] Add `/gasolineras/puebla`
- [ ] Add structured data (JSON-LD) for each city page
- [ ] Submit updated sitemap to Google Search Console

### Social Presence
- [ ] Create a Twitter/X account @tankeomx
- [ ] Post daily: "⛽ Gasolina más barata en CDMX hoy: $XX.XX en [Station Name]" — pull from CRE data manually or automate
- [ ] Create Instagram account — post price comparison graphics weekly
- [ ] Post 3 TikToks/Reels showing the app in use — "Así encuentro la gasolina más barata"

### Share Feature
- [ ] Add a share button on the station card: "Mira esta gasolina a $XX.XX cerca de ti — [link]"
- [ ] Make it WhatsApp-friendly (og:image, og:description with price) so shared links look good in chat

### When to move to Phase 3
500+ daily users, consistent organic search traffic, clear picture of what users want from analytics.

---

## Phase 3 — Monetization (1,000–10,000 users)

Goal: generate first revenue without hurting UX.

### Option A — Google AdSense (Low effort, low revenue)
- [ ] Apply for Google AdSense (requires consistent traffic)
- [ ] Add a single non-intrusive banner ad below the station list
- [ ] Expected: ~$0.50–2 CPM in Mexico — meaningful only at 5k+ daily users
- [ ] **When**: 2,000+ daily users

### Option B — Featured Listings (Medium effort, higher revenue)
- [ ] Design a "Destacada" badge for sponsored stations in the list
- [ ] Build a simple admin panel to manually toggle featured status
- [ ] Cold-email 20 Oxxo Gas, Petro 7, G500 station owners with a pitch deck
- [ ] Pricing: ~$500–1,500 MXN/month per station
- [ ] **When**: 1,000+ daily users, enough proof of traffic to show stations

### Option C — Price Alerts (Medium effort, recurring revenue)
- [ ] Build email/push notification when a nearby station drops below a price threshold
- [ ] Free tier: 1 alert
- [ ] Paid tier: unlimited alerts — $29–49 MXN/month
- [ ] Requires user accounts (Google/Apple Sign-In)
- [ ] **When**: strong retention signal from analytics, users returning daily

### When to move to Phase 4
First $1,000 MXN in revenue, or clear signal that one monetization model is working.

---

## Phase 4 — Expand (10,000+ users)

Goal: build defensible moat and expand use case.

### Product expansions
- [ ] **Historical price trends** — store CRE data daily, show price graph per station
- [ ] **Price change indicators** — ↑↓ vs last week on each card
- [ ] **Station amenities** — convenience store, car wash, 24h, bathroom (crowdsourced)
- [ ] **Route planner** — cheapest station along a given route (Google Maps Directions API)
- [ ] **Favorites** — save stations you use regularly

### Geography expansion
- [ ] **US border cities** — compare US vs MX prices, target cross-border drivers
- [ ] **LATAM** — find equivalent public APIs in Colombia (SICOM), Chile (CNE), Argentina (Enargas)

### B2B pivot
- [ ] **Fleet dashboard** — companies with delivery trucks optimize fuel costs across routes
- [ ] Target SMBs in logistics, construction, food delivery
- [ ] Pricing: $500–2,000 MXN/month per company
- [ ] **When**: solid consumer product with proven data, can package as API

---

## Phase 5 — Scale / Pivot Options

These are longer-term bets. Evaluate based on what the data shows.

| Pivot | Description | Signal to pursue |
|---|---|---|
| **Marketplace** | Stations claim listings, post offers, pay for promotion | Stations reaching out asking to be featured |
| **API product** | Sell real-time gas price API to fintechs, apps, logistics | Inbound requests for data access |
| **White label** | License to insurance, fleet, or mapping companies | Enterprise inbound |
| **Rewards/loyalty** | Partner with Spin by OXXO or similar for points | Strong repeat usage data |
| **Media/content** | Weekly gas price report for journalists, become the source | Press citing your data |

---

## Metrics to Track at Each Phase

| Phase | North Star Metric | Target |
|---|---|---|
| 1 | Daily active users | 50/day |
| 2 | Organic search traffic | 30% of visits from Google |
| 3 | Revenue | $1,000 MXN/month |
| 4 | Retention | 30% of users return within 7 days |
| 5 | MRR | $10,000 MXN/month |

---

## What NOT to do yet
- ❌ Build a native app (unnecessary overhead, PWA is enough)
- ❌ Spend money on ads before organic traffic is established
- ❌ Add too many features before understanding what users actually want
- ❌ Build user accounts before there's a clear reason to log in
