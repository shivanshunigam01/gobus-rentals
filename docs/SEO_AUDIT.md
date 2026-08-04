# SEO Audit Checklist

## Implemented
- [x] Unique titles/descriptions via `buildPageMeta` + `seoMiddleware`
- [x] Open Graph + Twitter cards + default OG image
- [x] Organization + WebSite + FAQ + LocalBusiness + Article + Review/AggregateRating + Vehicle rental JSON-LD
- [x] Canonical URLs + hreflang helpers (`www.luxurybusrental.in`)
- [x] Generated sitemap (`npm run sitemap` / postbuild) + API `/api/public/sitemap-urls` (cities + programmatic)
- [x] robots.txt (admin-editable via backend SEO settings; static fallback in `public/robots.txt`)
- [x] City SEO hubs (`/{city}-bus-rental`) with dynamic sections from MongoDB
- [x] Programmatic intent×city pages (`/{intent}-{city}`)
- [x] Internal linking engine (related/nearby cities, vehicles, industries, blogs, FAQs, trending, popular)
- [x] Admin SEO Manager (`/admin/seo`) — meta defaults, robots, GA/GTM/pixel, redirects, orphans, generate
- [x] Premium landing sections + internal link blocks on service/corporate/industry pages
- [x] Blog SEO fields (author Person schema helpers, FAQ/TOC model fields)

## Ops
- Set `VITE_SITE_URL=https://www.luxurybusrental.in`
- Backend: `npm run seed:seo` then restart API
- Submit sitemap in Google Search Console after deploy
