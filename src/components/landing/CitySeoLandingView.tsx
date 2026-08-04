import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { InternalLinkBlocks } from "@/components/seo/InternalLinkBlocks";
import { Button } from "@/components/ui/button";
import type { CitySeoResponse } from "@/lib/api/seo";
import { MapPin, CheckCircle2 } from "lucide-react";

type Props = { data: CitySeoResponse };

export function CitySeoLandingView({ data }: Props) {
  const { city, nearbyAirports, relatedCities, internalLinks } = data;
  const path = city.canonicalPath || `/${city.slug}-bus-rental`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Bus rental", to: "/bus-rental" }, { label: city.name }]} />

          <section className="mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">Bus Rental in {city.name}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Luxury coaches, Urbania, Tempo Traveller and corporate fleet hire in {city.name}, {city.stateName}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`/book?city=${city.slug}`}>Get a Free Quote</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">Talk to sales</a>
              </Button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-3">City Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">{city.description}</p>
          </section>

          {(city.popularRoutes || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Popular Routes</h2>
              <ul className="space-y-2">
                {city.popularRoutes!.map((r) => (
                  <li key={`${r.fromLabel}-${r.toLabel}`}>
                    <a href={r.href || "/book"} className="text-primary hover:underline">
                      {r.fromLabel} → {r.toLabel}
                    </a>
                    {r.notes ? <span className="text-muted-foreground text-sm"> — {r.notes}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(city.popularIndustries || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Popular Industries</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {city.popularIndustries!.map((i) => (
                  <a key={i.name} href={i.href || "/industries"} className="border rounded-lg p-4 hover:border-primary">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted-foreground">{i.blurb}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {nearbyAirports.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Nearby Airports</h2>
              <ul className="flex flex-wrap gap-2">
                {nearbyAirports.map((a) => (
                  <li key={a.slug}>
                    <a href={a.canonicalPath || `/airports/${a.slug}`} className="rounded-full border px-3 py-1.5 text-sm">
                      {a.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(city.touristPlaces || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Popular Tourist Places</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {city.touristPlaces!.map((t) => (
                  <li key={t.name} className="border rounded-lg p-4">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.blurb}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(city.corporateHubs || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Corporate Offices</h2>
              <ul className="space-y-2">
                {city.corporateHubs!.map((h) => (
                  <li key={h.name}>
                    <a href={h.href || "/corporate"} className="font-medium text-primary hover:underline">
                      {h.name}
                    </a>
                    <p className="text-sm text-muted-foreground">{h.blurb}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {city.metroNotes ? (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Metro Connectivity</h2>
              <p className="text-muted-foreground">{city.metroNotes}</p>
            </section>
          ) : null}

          {(city.vehicleAvailabilitySlugs || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Vehicle Availability</h2>
              <div className="flex flex-wrap gap-2">
                {city.vehicleAvailabilitySlugs!.map((slug) => (
                  <a key={slug} href={`/${slug}-rental`} className="rounded-full border px-3 py-1.5 text-sm capitalize">
                    {slug.replace(/-/g, " ")}
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-3">Fleet</h2>
            <p className="text-muted-foreground mb-3">
              Inspected luxury coaches, Urbania, Tempo Traveller and executive cabs available for {city.name} duties via
              verified vendors.
            </p>
            <Button asChild variant="outline">
              <a href={`/book?city=${city.slug}`}>Browse live quotes</a>
            </Button>
          </section>

          {city.pricingHints ? (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Pricing</h2>
              <p className="text-muted-foreground mb-2">{city.pricingHints.notes}</p>
              <ul className="space-y-1">
                {(city.pricingHints.seaterBands || []).map((b) => (
                  <li key={b} className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(city.faqs || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">FAQs</h2>
              <div className="space-y-3">
                {city.faqs!.map((f) => (
                  <details key={f.question} className="border rounded-lg p-4">
                    <summary className="font-medium cursor-pointer">{f.question}</summary>
                    <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {(city.testimonials || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Reviews</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {city.testimonials!.map((t) => (
                  <blockquote key={t.name + t.quote.slice(0, 12)} className="border rounded-lg p-4 text-sm">
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

          {(city.relatedServiceSlugs || []).length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Related Services</h2>
              <div className="flex flex-wrap gap-2">
                {city.relatedServiceSlugs!.map((slug) => (
                  <a key={slug} href={`/corporate/${slug}`} className="rounded-full border px-3 py-1.5 text-sm capitalize">
                    {slug.replace(/-/g, " ")}
                  </a>
                ))}
              </div>
            </section>
          )}

          {relatedCities.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Related Cities</h2>
              <div className="flex flex-wrap gap-2">
                {relatedCities.map((c) => (
                  <a key={c.slug} href={`/${c.slug}-bus-rental`} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {c.name}
                  </a>
                ))}
              </div>
            </section>
          )}

          {city.mapEmbed?.embedUrl ? (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold mb-3">Map</h2>
              <iframe
                title={city.mapEmbed.label || city.name}
                src={city.mapEmbed.embedUrl}
                className="w-full h-72 rounded-xl border"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </section>
          ) : null}

          <section className="rounded-xl border bg-muted/30 p-8 text-center mb-12">
            <h2 className="font-display text-2xl font-semibold mb-2">Book bus rental in {city.name}</h2>
            <p className="text-muted-foreground mb-4">Compare vendor quotes in minutes.</p>
            <Button asChild size="lg">
              <a href={`/book?city=${city.slug}`}>Get a Free Quote</a>
            </Button>
          </section>

          <InternalLinkBlocks links={internalLinks as never} />
          <p className="sr-only">{path}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
