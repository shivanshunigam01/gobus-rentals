import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { fleetImages } from "@/lib/media";
import { TravelStickers } from "@/components/brand/TravelStickers";
import { FloatingEmojiDecor } from "@/components/brand/FloatingEmojiDecor";
import { Reveal } from "@/components/motion/Reveal";
import { GlowBookingButton } from "@/components/motion/GlowBookingButton";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={fleetImages.coachGoldenHour}
          alt=""
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-hero-gradient-start/95 via-foreground/88 to-hero-gradient-end/95" />
        <TravelStickers variant="cta" />
        <FloatingEmojiDecor variant="cta" />
      </div>
      <Reveal className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-wider mb-3">
          ⭐ Trusted by 10,000+ Travelers · ✅ Verified Drivers · 🧼 Sanitized Vehicles
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 drop-shadow-sm">
          🚌 Book Tempo Traveller &amp; Bus Rental — Best Price Guaranteed 🛡️
        </h2>
        <p className="text-primary-foreground/85 text-lg sm:text-xl mb-4 max-w-2xl mx-auto">
          Get the best bus rental quote from verified operators across India. Affordable bus hire for weddings, corporate travel, group tours &amp; outstation trips.
        </p>
        <p className="text-primary-foreground/70 text-sm mb-10 max-w-xl mx-auto">
          Serving all major cities in India — {COMPANY.operatingLocations.split(",")[0]}, Delhi, Mumbai, Bangalore &amp; beyond. GST-transparent pricing at checkout.
        </p>
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link to="/book" className="w-full sm:w-auto">
            <GlowBookingButton
              variant="hero"
              size="xl"
              emoji="💰"
              className="btn-responsive w-full gap-2 bg-card text-primary hover:bg-card/90 sm:w-auto"
            >
              Get Best Bus Rental Quote <ArrowRight className="h-5 w-5 shrink-0" />
            </GlowBookingButton>
          </Link>
          <a href={`tel:+91${COMPANY.contactPhone}`} className="w-full sm:w-auto">
            <Button variant="hero-outline" size="xl" className="btn-responsive w-full gap-2 sm:w-auto">
              <Phone className="h-5 w-5 shrink-0" />
              <span className="sm:hidden">Call now</span>
              <span className="hidden sm:inline">Call Now for Affordable Bus Hire</span>
            </Button>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
