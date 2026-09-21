import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchVehicleTypes } from "@/lib/api/content";
import { fleetImages } from "@/lib/media";
import { Reveal } from "@/components/motion/Reveal";

export function FleetSliderSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-fleet-slider"],
    queryFn: () => fetchVehicleTypes({ featured: true }),
  });

  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Fleet for every journey</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Luxury buses, Urbania, shuttles, and executive cabs — one corporate transportation platform.
          </p>
        </Reveal>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
          {data.map((v, i) => (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.45 }}
              className="snap-start shrink-0"
            >
              <Link
                to="/book"
                search={{ busType: v.name } as never}
                className="block w-56 overflow-hidden rounded-xl border bg-card card-lift hover:border-primary"
              >
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={v.imageUrl || fleetImages.coachFrontMountain}
                    alt={v.name}
                    width={448}
                    height={280}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{v.category}</p>
                  {v.seatsMax ? (
                    <p className="text-xs mt-2">
                      {v.seatsMin}–{v.seatsMax} seats
                    </p>
                  ) : null}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
