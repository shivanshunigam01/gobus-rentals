import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { InternalLinkBlocks } from "@/components/seo/InternalLinkBlocks";
import { Button } from "@/components/ui/button";
import type { ServicePage } from "@/lib/api/content";
import { VEHICLE_TYPE_FALLBACK } from "@/data/vehicle-types";
import { CheckCircle2, MapPin, Bus } from "lucide-react";

type Props = {
  page: ServicePage;
  hubLabel: string;
  hubPath: string;
};

export function ServiceLandingView({ page, hubLabel, hubPath }: Props) {
  const vehicles = (page.vehicleTypeSlugs || [])
    .map((slug) => VEHICLE_TYPE_FALLBACK.find((v) => v.slug === slug) || { slug, name: slug })
    .slice(0, 16);
  const cities = page.citySlugs || [];
  const ctaHref = page.cta?.href || "/book";
  const ctaLabel = page.cta?.label || "Get a Free Quote";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: hubLabel, to: hubPath }, { label: page.title }]} />

          <section className="mb-12">
            {page.banner?.url ? (
              <img
                src={page.banner.url}
                alt={page.banner.alt || page.title}
                width={1200}
                height={480}
                className="w-full aspect-[2.5/1] object-cover rounded-xl mb-6 bg-muted"
                loading="eager"
              />
            ) : null}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">{page.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {page.shortDescription || page.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={ctaHref}>{ctaLabel}</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Talk to sales</Link>
              </Button>
            </div>
          </section>

          {page.description ? (
            <section className="mb-12 prose prose-neutral dark:prose-invert max-w-none">
              <h2 className="font-display text-2xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground whitespace-pre-line">{page.description}</p>
            </section>
          ) : null}

          {(page.benefits || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Benefits</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {page.benefits!.map((b) => (
                  <li key={b} className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(page.whyChooseUs || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Why Choose Us</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {page.whyChooseUs!.map((b) => (
                  <li key={b} className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {vehicles.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Vehicle List</h2>
              <div className="flex flex-wrap gap-2">
                {vehicles.map((v) => (
                  <a
                    key={v.slug}
                    href={`/${v.slug}-rental`}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:border-primary"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    {v.name}
                  </a>
                ))}
              </div>
            </section>
          )}

          {cities.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Cities Covered</h2>
              <div className="flex flex-wrap gap-2">
                {cities.map((slug) => (
                  <a
                    key={slug}
                    href={`/${slug}-bus-rental`}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm capitalize hover:bg-muted/80"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {slug.replace(/-/g, " ")}
                  </a>
                ))}
              </div>
            </section>
          )}

          {(page.faqs || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">FAQ</h2>
              <div className="space-y-4">
                {page.faqs!.map((f) => (
                  <details key={f.question} className="border rounded-lg p-4 group">
                    <summary className="font-medium cursor-pointer list-none flex justify-between">
                      {f.question}
                      <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {(page.internalLinks || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Related Solutions</h2>
              <div className="flex flex-wrap gap-3">
                {page.internalLinks!.map((l) => (
                  <a key={l.href} href={l.href} className="text-primary underline-offset-4 hover:underline text-sm">
                    {l.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          {(page.features || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Features</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {page.features!.map((f) => (
                  <li key={f.title} className="border rounded-lg p-4">
                    <p className="font-medium">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(page.bookingProcess || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Booking Process</h2>
              <ol className="space-y-3">
                {page.bookingProcess!.map((s) => (
                  <li key={s.step} className="flex gap-3">
                    <span className="font-bold text-primary">{s.step}</span>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(page.industries || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Industries</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {page.industries!.map((i) => (
                  <a key={i.name} href={i.href || "/industries"} className="border rounded-lg p-4 hover:border-primary">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted-foreground">{i.body}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {(page.testimonials || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Testimonials</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {page.testimonials!.map((t) => (
                  <blockquote key={t.name + t.quote.slice(0, 10)} className="border rounded-lg p-4 text-sm">
                    <p className="text-muted-foreground mb-2">“{t.quote}”</p>
                    <footer className="font-medium">
                      {t.name}
                      {t.company ? ` — ${t.company}` : ""}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {page.mapEmbed?.embedUrl ? (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-4">Service Area Map</h2>
              <iframe
                title={page.mapEmbed.label || page.title}
                src={page.mapEmbed.embedUrl}
                className="w-full h-72 rounded-xl border"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </section>
          ) : null}

          <section className="rounded-xl border bg-muted/30 p-8 text-center mb-12">
            <h2 className="font-display text-2xl font-semibold mb-2">Ready to move your teams?</h2>
            <p className="text-muted-foreground mb-4">Get a tailored corporate quote in minutes.</p>
            <Button asChild size="lg">
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
          </section>

          <InternalLinkBlocks
            links={{
              relatedServices: (page.internalLinks || []).map((l) => ({ href: l.href, anchor: l.label })),
              relatedCities: cities.slice(0, 12).map((slug) => ({
                href: `/${slug}-bus-rental`,
                anchor: `Bus rental in ${slug.replace(/-/g, " ")}`,
              })),
              relatedVehicles: vehicles.map((v) => ({ href: `/${v.slug}-rental`, anchor: v.name })),
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
