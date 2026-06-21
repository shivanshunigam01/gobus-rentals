import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { homeSeoArticleSections } from "@/data/home-seo-longform";
import { busCapacities12to66, BUS_SEAT_MIN, BUS_SEAT_MAX } from "@/data/bus-capacities";
import { COMPANY } from "@/lib/company";
import { Button } from "@/components/ui/button";
import { CapacityGuideSection } from "./CapacityGuideSection";

const tocBands = [
  { label: "12–21", from: 12, to: 21 },
  { label: "22–31", from: 22, to: 31 },
  { label: "32–41", from: 32, to: 41 },
  { label: "42–51", from: 42, to: 51 },
  { label: "52–61", from: 52, to: 61 },
  { label: "62–66", from: 62, to: 66 },
];

/** Short labels for topic chips (full titles stay inside each panel). */
const guideTopicNavLabel: Record<string, string> = {
  intro: "Overview",
  "keywords-routes": "Cities & routes",
  "fleet-tech": "Coach specs",
  "pricing-gst": "GST & pricing",
  "safety-compliance": "Safety & permits",
  "booking-workflow": "How booking works",
  seasonality: "Peak seasons",
  sustainability: "BS6 & fleets",
  conclusion: "Get started",
  "capacity-planning": "Sizing & luggage",
};

export function HomeSeoContentSection() {
  return (
    <section id="bus-rental-guide" className="border-t border-border bg-muted/20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/95 shadow-sm ring-1 ring-border/50 sm:rounded-3xl">
          <div className="border-b border-border/80 bg-muted/40 px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Tempo Traveller &amp; Bus Rental Guide
                </p>
                <h2 className="font-display mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  Bus Rental in India: Complete Guide — Tempo Traveller to {BUS_SEAT_MAX} Seater Luxury Coach
                </h2>
                <p className="mx-auto mt-3 text-sm leading-relaxed text-muted-foreground sm:mx-0 sm:text-base">
                  Compare tempo traveller on rent, mini bus on rent, Volvo bus hire, AC luxury bus booking, and
                  sleeper coaches for weddings, corporate travel, group tours &amp; outstation trips across{" "}
                  {COMPANY.operatingLocations}. Open a topic below, or jump straight to a seat band.
                </p>
              </div>
              <p className="mx-auto shrink-0 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm sm:mx-0">
                {homeSeoArticleSections.length} topics
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Guide topics
                </p>
                <nav aria-label="Guide topics" className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {homeSeoArticleSections.map((sec) => (
                    <a
                      key={`topic-${sec.id}`}
                      href={`#guide-${sec.id}`}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      {guideTopicNavLabel[sec.id] ?? sec.id}
                    </a>
                  ))}
                </nav>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Seat capacity bands
                </p>
                <nav aria-label="Bus capacity table of contents" className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {tocBands.map((b) => (
                    <a
                      key={b.label}
                      href={`#seater-${b.from}`}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      {b.label} seater
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border/80 px-1 sm:px-2">
            {homeSeoArticleSections.map((sec) => (
              <details
                key={sec.id}
                id={`guide-${sec.id}`}
                className="scroll-mt-28 group bg-background/40 open:bg-background sm:scroll-mt-32 [&[open]>summary_.cap-chevron-guide]:rotate-180"
                defaultOpen={sec.id === "intro"}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-left text-base font-semibold leading-snug text-foreground sm:text-lg">
                    {sec.title}
                  </h3>
                  <ChevronDown className="cap-chevron-guide h-5 w-5 shrink-0 text-primary transition-transform duration-200" />
                </summary>
                <div className="border-t border-border/60 px-4 pb-5 pt-1 sm:px-6 sm:pb-6">
                  <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert prose-p:leading-relaxed prose-headings:font-display prose-a:text-primary sm:prose-base">
                    {sec.paragraphs.map((p, i) => (
                      <p key={`${sec.id}-${i}`}>{p}</p>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        <CapacityGuideSection />
      </div>
    </section>
  );
}
