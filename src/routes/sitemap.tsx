import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { INDIAN_CITIES } from "@/data/indian-cities";
import { listBusTypeSlugs } from "@/data/bus-type-pages";
import { listServiceCitySlugs } from "@/data/service-city-pages";
import { CORPORATE_SLUGS, INDUSTRY_SLUGS, SERVICE_SLUGS } from "@/data/platform-slugs";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/sitemap")({
  component: HtmlSitemapPage,
  head: () =>
    buildPageMeta({
      title: "HTML Sitemap",
      description: "Browse all main pages on Luxury Bus Rental — cities, services, bus types, and booking.",
      path: "/sitemap",
    }),
});

function HtmlSitemapPage() {
  const topCities = INDIAN_CITIES.slice(0, 24);
  const serviceCities = listServiceCitySlugs().slice(0, 12);
  const busTypes = listBusTypeSlugs();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sitemap</h1>
          <p className="text-muted-foreground mb-6">
            Human-readable index of key pages. For search engines, use the{" "}
            <a href="/sitemap.xml" className="text-primary hover:underline">XML sitemap</a>{" "}
            ({absoluteUrl("/sitemap.xml")}).
          </p>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Main</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {[
                ["/", "Home"],
                ["/book", "Book a bus"],
                ["/bus-rental", "Bus rental hub"],
                ["/bus-types-for-hire", "Bus types for hire"],
                ["/bus-rental-guides", "Bus rental guides"],
                ["/blog", "Blog"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="text-primary hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Services &amp; industries</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {SERVICE_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link to="/services/$serviceSlug" params={{ serviceSlug: slug }} className="text-primary hover:underline">
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
              {CORPORATE_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link to="/corporate/$slug" params={{ slug }} className="text-primary hover:underline">
                    Corporate — {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
              {INDUSTRY_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link to="/industries/$slug" params={{ slug }} className="text-primary hover:underline">
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Bus types</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {busTypes.map((slug) => (
                <li key={slug}>
                  <Link to="/$seoSlug" params={{ seoSlug: slug }} className="text-primary hover:underline">
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">City bus rental</h2>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {topCities.map((c) => (
                <li key={c.slug}>
                  <Link to="/$seoSlug" params={{ seoSlug: `${c.slug}-bus-rental` }} className="text-primary hover:underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Showing 24 of {INDIAN_CITIES.length} cities — see XML sitemap for the full list.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">City guides</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {serviceCities.map((slug) => (
                <li key={slug}>
                  <Link to="/$seoSlug" params={{ seoSlug: `${slug}-bus-rental-guide` }} className="text-primary hover:underline">
                    {slug.replace(/-/g, " ")} guide
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
