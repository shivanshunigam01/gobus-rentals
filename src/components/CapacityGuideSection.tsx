import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bus, ChevronDown, Users } from "lucide-react";
import { FloatingEmojiDecor } from "@/components/brand/FloatingEmojiDecor";
import { GlowBookingButton } from "@/components/motion/GlowBookingButton";
import { Button } from "./ui/button";
import { BUS_SEAT_MAX, BUS_SEAT_MIN, busCapacities12to66 } from "@/data/bus-capacities";
import { VEHICLE_CATALOG } from "@/lib/vehicle-catalog";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

const capacityBands = [
  {
    id: "12-21",
    label: "12–21",
    from: 12,
    to: 21,
    tag: "Mini & Tempo",
    hint: "Airport transfers, family trips, and compact city movement.",
  },
  {
    id: "22-31",
    label: "22–31",
    from: 22,
    to: 31,
    tag: "Midi Coach",
    hint: "College batches, wedding shuttles, and mixed city-highway routes.",
  },
  {
    id: "32-41",
    label: "32–41",
    from: 32,
    to: 41,
    tag: "Touring Coach",
    hint: "Multi-day tours, MICE movement, and medium group charters.",
  },
  {
    id: "42-51",
    label: "42–51",
    from: 42,
    to: 51,
    tag: "Luxury Coach",
    hint: "Premium weddings, corporate events, and interstate comfort.",
  },
  {
    id: "52-61",
    label: "52–61",
    from: 52,
    to: 61,
    tag: "Full-Size",
    hint: "Large guest blocks, convention transport, and highway charters.",
  },
  {
    id: "62-66",
    label: "62–66",
    from: 62,
    to: 66,
    tag: "High Capacity",
    hint: "Mega groups, institutional movement, and rally logistics.",
  },
] as const;

const featuredSeats = [12, 20, 26, 35, 45, 52, 66];

function seatCategory(seats: number): string {
  if (seats <= 16) return "Mini";
  if (seats <= 22) return "Midi";
  if (seats <= 30) return "Mid-coach";
  if (seats <= 42) return "Touring";
  if (seats <= 52) return "Luxury";
  return "High-capacity";
}

function excerpt(text: string, max = 110): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 60 ? lastSpace : max)}…`;
}

function rowsByBand(from: number, to: number) {
  return busCapacities12to66.filter((row) => row.seats >= from && row.seats <= to);
}

function bandFromHash(hash: string): string | null {
  const match = /^#capacity-band-(\d+-\d+)$/.exec(hash);
  if (!match) return null;
  return capacityBands.some((b) => b.id === match[1]) ? match[1] : null;
}

type CapacityGuideSectionProps = {
  city?: string;
};

export const CapacityGuideSection = ({ city }: CapacityGuideSectionProps) => {
  const [activeBand, setActiveBand] = useState<string>(capacityBands[0].id);
  const [showAllBands, setShowAllBands] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      const bandId = bandFromHash(window.location.hash);
      if (bandId) {
        setActiveBand(bandId);
        setShowAllBands(false);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const heading = city
    ? `All Tempo Traveller & Bus Rental Options in ${city}: ${BUS_SEAT_MIN} to ${BUS_SEAT_MAX} Seater`
    : `All Tempo Traveller & Bus Rental Options: ${BUS_SEAT_MIN} to ${BUS_SEAT_MAX} Seater`;

  const description = city
    ? `Pick a seat band below to compare route fit, luggage, and permit notes for ${city}. Availability depends on your travel dates and routes.`
    : `Pick a seat band below to compare route fit, luggage, and permit notes across ${COMPANY.operatingLocations}.`;

  const featuredVehicles = VEHICLE_CATALOG.filter((v) => {
    const n = Number.parseInt(v.seats, 10);
    return featuredSeats.includes(n);
  });

  const visibleBands = showAllBands ? capacityBands : capacityBands.filter((b) => b.id === activeBand);

  const selectBand = (bandId: string) => {
    setActiveBand(bandId);
    setShowAllBands(false);
  };

  const renderBand = (band: (typeof capacityBands)[number]) => {
    const rows = rowsByBand(band.from, band.to);

    return (
      <section key={band.id} id={`capacity-band-${band.id}`} className="scroll-mt-28 sm:scroll-mt-32">
        <div className="mb-5 rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              {band.tag}
            </span>
            <span className="text-sm font-medium text-foreground">
              {band.label} seater · {rows.length} configurations
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{band.hint}</p>
        </div>

        <ul className="grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <li key={row.seats} className="min-w-0">
              <article
                id={`seater-${row.seats}`}
                className="card-lift flex h-full flex-col rounded-xl border border-border/90 bg-background p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-bold tabular-nums text-primary"
                      aria-hidden
                    >
                      {row.seats}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {seatCategory(row.seats)}
                      </p>
                      <h4 className="font-display text-sm font-semibold leading-snug text-foreground sm:text-base">
                        {row.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {excerpt(row.description)}
                </p>

                <details className="mt-3 border-t border-border/60 pt-3 [&[open]>summary_.cap-chevron]:rotate-180">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
                    <span>Planning &amp; booking notes</span>
                    <ChevronDown className="cap-chevron h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">{row.description}</p>
                </details>
              </article>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div
      id="capacity-guide"
      className="relative mt-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/95 shadow-sm ring-1 ring-border/50 sm:rounded-3xl"
    >
      <FloatingEmojiDecor variant="guide" />
      <div className="relative border-b border-border/80 bg-muted/40 px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">🚐 Capacity guide</p>
            <h3 className="font-display text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {heading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
              {BUS_SEAT_MIN}–{BUS_SEAT_MAX} seaters
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Bus className="h-3.5 w-3.5 text-primary" aria-hidden />
              {busCapacities12to66.length} options
            </span>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Popular capacities
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
            {featuredVehicles.map((vehicle) => {
              const seats = Number.parseInt(vehicle.seats, 10);
              const band = capacityBands.find((b) => seats >= b.from && seats <= b.to);
              return (
                <motion.button
                  key={vehicle.slug}
                  type="button"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (band) selectBand(band.id);
                    document.getElementById(`seater-${seats}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="group rounded-xl border border-border/80 bg-background/80 p-3 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                >
                  <p className="font-display text-xl font-bold tabular-nums text-foreground">{seats}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-muted-foreground group-hover:text-foreground">
                    {vehicle.title}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Browse by seat band — one section at a time so you can compare without scrolling through every option.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setShowAllBands((v) => !v)}
          >
            {showAllBands ? "Show active band only" : "Expand all seat bands"}
          </Button>
        </div>

        <div
          role="tablist"
          aria-label="Bus seat capacity bands"
          className="mb-6 flex flex-wrap gap-1.5 rounded-lg bg-muted/60 p-1.5"
        >
          {capacityBands.map((band) => (
            <button
              key={band.id}
              type="button"
              role="tab"
              aria-selected={!showAllBands && activeBand === band.id}
              onClick={() => selectBand(band.id)}
              className={cn(
                "min-w-[5.5rem] flex-1 rounded-md px-2 py-2 text-xs font-medium transition-all sm:min-w-0 sm:flex-none sm:px-3 sm:text-sm",
                !showAllBands && activeBand === band.id
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              )}
            >
              {band.label} seater
            </button>
          ))}
        </div>

        <div className="space-y-10">{visibleBands.map((band) => renderBand(band))}</div>
      </div>

      <div className="flex flex-col items-start gap-4 border-t border-border bg-muted/30 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-medium text-foreground">Ready for a quote?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Book tempo traveller on rent or luxury bus hire — compare verified operators in minutes.
          </p>
        </div>
        <Link to="/book" className="shrink-0">
          <GlowBookingButton size="lg" emoji="🎫" className="group gap-2">
            Book Tempo Traveller &amp; Get Free Bus Quotes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </GlowBookingButton>
        </Link>
      </div>
    </div>
  );
};
