import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { fleetImages } from "@/lib/media";
import { GlowBookingButton } from "@/components/motion/GlowBookingButton";
import { Reveal } from "@/components/motion/Reveal";
import { TrustChip } from "@/components/brand/TravelStickers";

export function UrbaniaSection() {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
        <Reveal>
          <p className="text-sm font-medium text-primary mb-2">🚐 Premium vans</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Force Urbania for corporate teams ✨</h2>
          <p className="text-muted-foreground mb-5">
            Comfortable 9–17 seater Urbania vans for executive travel, airport runs, and small employee clusters —
            with AC comfort and professional chauffeurs.
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            <TrustChip icon={Users} label="9–17 seats" />
            <TrustChip icon={Sparkles} label="Executive AC" />
            <TrustChip icon={ShieldCheck} label="Chauffeur included" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/book" search={{ busType: "Urbania" } as never}>
              <GlowBookingButton emoji="🎫">Book Urbania</GlowBookingButton>
            </Link>
            <Button asChild variant="outline">
              <Link to="/services/$serviceSlug" params={{ serviceSlug: "urbania-rental-for-corporates" }}>
                Learn more
              </Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="relative">
          <div className="rounded-2xl border overflow-hidden aspect-[4/3] bg-muted shadow-lg group">
            <img
              src={fleetImages.vanUrbaniaFront}
              alt="Force Urbania style van for corporate team travel"
              width={960}
              height={720}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CabSection() {
  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
        <Reveal className="order-2 lg:order-1 relative">
          <div className="rounded-2xl border overflow-hidden aspect-[4/3] bg-muted shadow-lg group">
            <img
              src={fleetImages.executiveSuv}
              alt="Executive SUV and cab rental for business travel"
              width={960}
              height={720}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="text-sm font-medium text-primary mb-2">Business cabs</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Cabs for executives &amp; point-to-point travel</h2>
          <p className="text-muted-foreground mb-5">
            Extend your corporate program with sedan, SUV, MUV, hatchback, and Innova Crysta — ideal for leadership,
            client visits, and airport transfers.
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            <TrustChip icon={Sparkles} label="Innova Crysta" />
            <TrustChip icon={ShieldCheck} label="Airport transfers" />
          </div>
          <Button asChild>
            <Link to="/services/$serviceSlug" params={{ serviceSlug: "cab-and-car-rental-for-business" }}>
              Explore cab rental
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
