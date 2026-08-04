import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { COMPANY } from "@/lib/company";
import { BOOKING_BUS_TYPES } from "@/data/booking-bus-types";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Phone, Shield } from "lucide-react";
import { FareEstimator } from "@/components/enterprise/FareEstimator";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search.busType;
    if (typeof raw !== "string" || !(BOOKING_BUS_TYPES as readonly string[]).includes(raw)) {
      return {};
    }
    return { busType: raw };
  },
  component: BookPage,
  head: () =>
    buildPageMeta({
      title: "Book Tempo Traveller & Bus Rental Online | Get Free Quotes — Best Price",
      description: `Book tempo traveller on rent or luxury bus rental in India. ${COMPANY.legalName} — best bus rental price, verified drivers, instant quotes for weddings, corporate & group travel.`,
      path: "/book",
      keywords: "book tempo traveller online, bus rental quotes India, tempo traveller booking, mini bus on rent, luxury bus rental booking, bus rental for wedding, corporate bus hire quote, affordable bus hire India, bus rental price per km",
    }),
});

const perks = [
  "Compare quotes from 500+ verified bus operators",
  "Tempo traveller, mini bus, Volvo & luxury coach options",
  "Best for weddings, corporate travel & outstation group trips",
  "Affordable bus hire — transparent bus rental price per km",
  "Verified drivers & sanitized vehicles across India",
  "GST-transparent pricing on every quote",
];

function BookPage() {
  const { busType: busTypeFromUrl } = Route.useSearch();
  const wa = `https://wa.me/${COMPANY.whatsappE164}?text=${encodeURIComponent("Hi, I want the best bus rental quotes.")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 lg:mb-10 max-w-2xl">
            <p className="text-sm font-medium text-primary mb-2">Free quotes · No obligation · Best price guaranteed</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-foreground tracking-tight">
              Book Tempo Traveller &amp; Bus Rental Online
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-2">
              Get the best bus rental quote in minutes — tempo traveller on rent, mini bus, luxury bus hire for weddings, corporate travel &amp; group tours across India.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Booking panel first: full width on mobile, dominant column on desktop */}
            <div className="lg:col-span-7 xl:col-span-7 order-1 min-w-0">
              <BookingForm initialBusType={busTypeFromUrl} />
            </div>

            <aside className="lg:col-span-5 xl:col-span-5 order-2 space-y-5 lg:sticky lg:top-24 lg:self-start">
              <FareEstimator />
              <div className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-4">
                  <Shield className="w-5 h-5 text-primary shrink-0" />
                  Why travellers use us
                </div>
                <ul className="space-y-3">
                  {perks.map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                      <span className="text-foreground/90">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Contact (NAP)</p>
                <p className="font-semibold text-foreground">{COMPANY.legalName}</p>
                <p className="text-sm text-muted-foreground mt-1">{COMPANY.operatingLocations}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <a href={`tel:+91${COMPANY.contactPhone}`} className="flex-1">
                    <Button variant="secondary" className="w-full gap-2" size="lg">
                      <Phone className="w-4 h-4" />
                      {COMPANY.contactPhoneDisplay}
                    </Button>
                  </a>
                  <a href={wa} target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full gap-2" size="lg">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Email:{" "}
                  <a href={`mailto:${COMPANY.contactEmail}`} className="text-primary underline-offset-2 hover:underline">
                    {COMPANY.contactEmail}
                  </a>
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Browsing cities?{" "}
                <Link to="/bus-rental" className="text-primary font-medium underline-offset-2 hover:underline">
                  See all bus rental cities
                </Link>
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
