import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { ChevronDown } from "lucide-react"
import { BUS_SEAT_MAX, BUS_SEAT_MIN, busCapacities12to66 } from "@/data/bus-capacities"
import { COMPANY } from "@/lib/company";

const tocBands = [
    { label: "12–21", from: 12, to: 21 },
    { label: "22–31", from: 22, to: 31 },
    { label: "32–41", from: 32, to: 41 },
    { label: "42–51", from: 42, to: 51 },
    { label: "52–61", from: 52, to: 61 },
    { label: "62–66", from: 62, to: 66 },
];

type CapacityGuideSectionProps = {
    city?: string;
};

export const CapacityGuideSection = ({ city }: CapacityGuideSectionProps) => {

    const heading = city
        ? `All Tempo Traveller & Bus Rental Options in ${city}: ${BUS_SEAT_MIN} to ${BUS_SEAT_MAX} Seater`
        : `All Tempo Traveller & Bus Rental Options: ${BUS_SEAT_MIN} to ${BUS_SEAT_MAX} Seater`;

    const description = city
        ? `From compact tempo travellers to full-size coaches — open any card for route, luggage, and permit notes. Availability depends on your travel dates and routes in ${city}.`
        : `From compact tempo travellers to full-size coaches — open any card for route, luggage, and permit notes. Availability depends on your city and dates across ${COMPANY.operatingLocations}.`;

    return (
        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/95 shadow-sm ring-1 ring-border/50 sm:rounded-3xl">
            <div className="border-b border-border/80 bg-muted/40 px-5 py-8 sm:px-8 sm:py-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Capacity guide</p>
                        <h3 className="font-display text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {heading}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {description}
                        </p>
                    </div>
                    <p className="shrink-0 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground tabular-nums shadow-sm">
                        {busCapacities12to66.length} capacities
                    </p>
                </div>

                <nav
                    aria-label="Jump to seat range inside capacity guide"
                    className="mt-6 flex flex-wrap gap-2"
                >
                    {tocBands.map((b) => (
                        <a
                            key={`in-card-${b.label}`}
                            href={`#seater-${b.from}`}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                        >
                            {b.label} seater
                        </a>
                    ))}
                </nav>
            </div>

            <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <ul className="grid list-none grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {busCapacities12to66.map((row) => (
                        <li key={row.seats} className="min-w-0">
                            <div
                                id={`seater-${row.seats}`}
                                className="scroll-mt-28 rounded-xl border border-border/90 bg-background/60 p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-background sm:scroll-mt-32"
                            >
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="font-display text-lg font-bold tabular-nums text-foreground">{row.seats}</span>
                                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                        seater
                                    </span>
                                </div>
                                <h4 className="mt-1 font-display text-sm font-semibold leading-snug text-foreground sm:text-base">
                                    {row.title} rental in India
                                </h4>
                                <details className="mt-3 border-t border-border/60 pt-3 [&[open]>summary_.cap-chevron]:rotate-180">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
                                        <span>Planning &amp; booking notes</span>
                                        <ChevronDown className="cap-chevron h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                                    </summary>
                                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">{row.description}</p>
                                </details>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col items-start gap-3 border-t border-border bg-muted/30 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="text-sm text-muted-foreground">
                    Ready to get the best bus rental quote? Book tempo traveller on rent or luxury bus hire instantly.
                </p>
                <Button asChild size="lg">
                    <Link to="/book">Book Tempo Traveller &amp; Get Free Bus Quotes</Link>
                </Button>
            </div>
        </div>
    )

}