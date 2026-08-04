import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicleTypes } from "@/lib/api/content";
import { Bus } from "lucide-react";

export function FleetSliderSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-fleet-slider"],
    queryFn: () => fetchVehicleTypes({ featured: true }),
  });

  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Fleet for every journey</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          Luxury buses, Urbania, shuttles, and executive cabs — one corporate transportation platform.
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {data.map((v) => (
            <Link
              key={v.slug}
              to="/book"
              search={{ busType: v.name } as never}
              className="snap-start shrink-0 w-56 border rounded-xl p-4 bg-card hover:border-primary transition-colors"
            >
              <Bus className="w-8 h-8 text-primary mb-3" />
              <p className="font-semibold">{v.name}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{v.category}</p>
              {v.seatsMax ? (
                <p className="text-xs mt-2">
                  {v.seatsMin}–{v.seatsMax} seats
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
