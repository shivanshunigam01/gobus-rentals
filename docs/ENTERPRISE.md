# Frontend Enterprise Guide

## UX
- Dark mode (toggle in navbar + all panel shells; persists in `lbr_theme`)
- Accessibility: skip link, focus-visible rings, aria-labels on icon buttons
- Responsive panel shell with mobile sheet nav
- Global admin search (⌘K) via cmdk
- Notification bell (in-app)
- Fare estimator on `/book` (live maps distance + GST total)

## New routes
Admin: analytics, drivers, calendar, audit-logs, activity  
Vendor: drivers, calendar  
Customer: wishlist, saved-trips  
B2B: full portal (existing)

## Performance
- React Query caching for dashboards/notifications
- Lazy SEO section on homepage
- Public content + fare APIs cacheable on backend TTL cache
- Chart pages use Recharts with ResponsiveContainer

## SEO
- `buildPageMeta`, JSON-LD schemas, sitemap postbuild
- Canonical/hreflang, robots, city/bus SEO routes

## Env
`VITE_API_URL` required for authenticated APIs.

## Full release documentation
See **[TODAY_FEATURE_DOCUMENTATION.md](./TODAY_FEATURE_DOCUMENTATION.md)** for complete frontend + backend flows (booking, B2B, vendor, admin, SEO, offers, PDFs) shipped 4 Aug 2026.
