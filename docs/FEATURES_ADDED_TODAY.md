# Features Added Today — Luxury Bus (Frontend + Backend)

**Date:** 4 August 2026  
**Repos:** Frontend `gobus-rentals` (`2e9536f`, `aa35f7c`) · Backend `luxurybus-backend` (`dbf0922`)

> **Full detailed flow documentation** (all sequences, APIs, status machines, seeds):  
> [`luxurybus-backend/docs/FEATURES_ADDED_TODAY.md`](../../luxurybus-backend/docs/FEATURES_ADDED_TODAY.md)

---

## What shipped today (summary)

### Frontend (`gobus-rentals`)

| Area | Routes / components |
|------|---------------------|
| **B2B portal** | `/b2b/*` — register, dashboard, bookings, trips, employees, favourites, wallet, invoices, contracts |
| **Admin enterprise** | analytics, companies, drivers, calendar, payouts, offers, audit-logs, activity, SEO manager, CMS (services/blogs/FAQs/vehicle-types) |
| **Vendor ops** | analytics, drivers, calendar, documents, notifications; richer register/fleet/earnings |
| **Customer** | `/customer/wishlist`, `/customer/saved-trips` |
| **SEO landings** | City hubs, programmatic intent×city, corporate/industry/service landings, internal links |
| **Homepage** | Offers, fleet slider, solutions sections |
| **UX shell** | Dark mode, ⌘K search, notification bell, fare estimator on `/book` |

### Backend (`luxurybus-backend`)

| Area | APIs / services |
|------|-----------------|
| **B2B** | `/api/b2b/*` + auth register + admin companies |
| **Vendor** | drivers, assign-driver, schedule, calendar, deep analytics, payouts |
| **Admin / enterprise** | analytics, search, audit, activity, SEO, offers, CMS |
| **Public** | SEO resolve, cities, offers, maps/fare, content, sitemap-urls |
| **PDF** | Invoice + trip voucher (pdfkit) |
| **Lifecycle** | Booking events, auto-invoice, payout-ready on complete |

---

## Master booking flow (quick)

```
Lead/Book → Vendor quote → Accept → Pay (Razorpay)
  → confirmed (+ GST invoice)
  → assign driver + schedule
  → on_trip → completed (payout ready)
  → vendor payout request → admin approve + UTR
```

---

## Role → shell map

| Role | Frontend | API |
|------|----------|-----|
| Customer | `/customer/*` | `/api/customer`, `/api/enterprise` |
| Vendor | `/vendor/*` | `/api/vendor` |
| B2B | `/b2b/*` | `/api/b2b` |
| Admin | `/admin/*` | `/api/admin`, `/api/enterprise` |
| Public | SEO / CMS pages | `/api/public` |

---

## Ops

```bash
# Backend
npm run seed:admin && npm run seed:platform && npm run seed:b2b && npm run seed:seo

# Frontend
# VITE_API_URL + VITE_SITE_URL required
npm run sitemap
```

See also: [ENTERPRISE.md](./ENTERPRISE.md) · [SEO_AUDIT.md](./SEO_AUDIT.md)
