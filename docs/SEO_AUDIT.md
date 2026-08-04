# SEO Audit Checklist

## Implemented
- [x] Unique titles/descriptions via `buildPageMeta` on marketing + book routes
- [x] Open Graph + Twitter cards + default OG image
- [x] Organization + WebSite + FAQ JSON-LD
- [x] Canonical URLs + hreflang helpers
- [x] Generated sitemap (`npm run sitemap` / postbuild)
- [x] robots.txt / SPA prepare for Vercel
- [x] City / bus-type / service landing SEO routes
- [x] Internal linking from navbar + corporate/industry hubs
- [x] Semantic headings on homepage & book page
- [x] Image width/height on logo assets

## Ops recommendations
- Keep `VITE_SITE_URL` absolute for production OG/canonical
- Monitor Core Web Vitals; prefer compressed hero images
- Submit sitemap in Google Search Console after deploy
