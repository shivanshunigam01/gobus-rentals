import { useState, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { fleetImages, heroBackgroundVideos } from "@/lib/media";

/**
 * Double-buffer crossfade video background.
 *
 * Two <video> elements sit permanently in the DOM (no React key-remounting).
 * While slot A plays, slot B silently preloads the NEXT clip.
 * On ended: slot B fades in over 700 ms, slot A fades out.
 * After the transition, slot A loads the clip after next — ready for the cycle to repeat.
 * Result: zero black flash between clips.
 */
export function HeroSection() {
  const clips = heroBackgroundVideos;
  const hasManyClips = clips.length > 1;

  // Which buffer slot is currently visible (0 = A, 1 = B)
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);

  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);

  // Mutable refs — never cause re-renders
  const activeSlotRef = useRef<0 | 1>(0);
  // Index of the clip currently preloaded in the INACTIVE slot
  const inactiveClipIdx = useRef(hasManyClips ? 1 : 0);

  const handleEnded = useCallback(() => {
    if (!hasManyClips) return;

    const currSlot = activeSlotRef.current;
    const nextSlot: 0 | 1 = currSlot === 0 ? 1 : 0;

    // The inactive slot already has the next clip loaded — start playing it immediately
    const nextVid = nextSlot === 0 ? videoA.current : videoB.current;
    nextVid?.play().catch(() => {});

    // Crossfade: show next slot, hide current slot
    activeSlotRef.current = nextSlot;
    setActiveSlot(nextSlot);

    // Compute the clip that comes AFTER the one now playing
    const clipAfterNext = (inactiveClipIdx.current + 1) % clips.length;
    inactiveClipIdx.current = clipAfterNext;

    // After the CSS fade transition completes, silently load the next-next clip
    // into the now-invisible slot so it is ready when needed
    const prevVid = currSlot === 0 ? videoA.current : videoB.current;
    setTimeout(() => {
      if (!prevVid) return;
      prevVid.pause();
      prevVid.src = clips[clipAfterNext];
      prevVid.load();
    }, 750); // slightly longer than the 700ms transition
  }, [clips, hasManyClips]);

  return (
    <section className="relative flex min-h-dvh flex-col justify-start overflow-hidden">
      {/* ── Background: two permanently-mounted video slots ── */}
      <div className="absolute inset-0 bg-black">
        {/* Slot A — starts visible and playing */}
        <video
          ref={videoA}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
            activeSlot === 0 ? "opacity-100" : "opacity-0"
          }`}
          src={clips[0]}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={fleetImages.coachFrontMountain}
          onEnded={handleEnded}
        />
        {/* Slot B — starts hidden, preloads clips[1] silently */}
        <video
          ref={videoB}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
            activeSlot === 1 ? "opacity-100" : "opacity-0"
          }`}
          src={clips[1] ?? clips[0]}
          muted
          playsInline
          preload="auto"
          poster={fleetImages.coachFrontMountain}
          onEnded={handleEnded}
        />

        {/* Overlay gradient — always on top of both video slots */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-14 sm:pb-16 w-full">
        <div className="max-w-5xl">
          <span className="inline-block bg-primary/20 text-primary-foreground border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4 sm:mb-5 backdrop-blur-sm">
            Trusted by 10,000+ Travelers · {COMPANY.legalName}
          </span>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-[1.15] mb-3 sm:mb-4">
            India's Trusted Platform for Bus Rental{" "}
            <span className="block text-accent mt-1">Compare. Choose. Book Instantly</span>
          </h1>

          <p className="text-primary-foreground/85 text-sm sm:text-base font-medium mb-4 max-w-xl">
            Book tempo traveller on rent or luxury bus hire across India — verified operators, best price, GST-transparent quotes.
          </p>

          <p className="text-primary-foreground/75 text-sm sm:text-base mb-3 leading-relaxed max-w-2xl">
            Mini bus on rent, tempo traveller booking, Volvo coaches, sleeper buses — compare all options for group travel, weddings, corporate trips &amp; outstation tours.
          </p>
          <p className="text-primary-foreground/65 text-xs sm:text-sm mb-6 flex flex-wrap items-center gap-2 max-w-2xl">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Serving all major cities in India — {COMPANY.operatingLocations}</span>
            <span className="text-primary-foreground/45">·</span>
            <span>GST {COMPANY.gstPercentage}% shown at checkout</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/book">
              <Button variant="hero" size="xl" className="gap-2 bg-primary">
                Get Best Price Instantly <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href={`tel:+91${COMPANY.contactPhone}`}>
              <Button variant="hero-outline" size="xl">
                Call for Affordable Bus Hire: {COMPANY.contactPhoneDisplay}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
