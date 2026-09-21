import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { fleetImages, heroBackgroundVideos } from "@/lib/media";
import { TravelStickers } from "@/components/brand/TravelStickers";

/**
 * Double-buffer crossfade video background.
 * First paint always shows a static poster; videos are force-played for mobile
 * autoplay policies (muted + playsInline + imperative play / gesture unlock).
 */
export function HeroSection() {
  const clips = heroBackgroundVideos;
  const hasManyClips = clips.length > 1;
  const poster = fleetImages.coachFrontMountain;

  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [secondReady, setSecondReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const activeSlotRef = useRef<0 | 1>(0);
  const inactiveClipIdx = useRef(hasManyClips ? 1 : 0);

  const prepareVideo = useCallback((el: HTMLVideoElement) => {
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "true");
    el.setAttribute("webkit-playsinline", "true");
    el.setAttribute("x5-playsinline", "true");
    el.setAttribute("muted", "");
  }, []);

  const tryPlay = useCallback(
    (el: HTMLVideoElement | null) => {
      if (!el) return;
      prepareVideo(el);
      const p = el.play();
      if (p !== undefined) {
        p.then(() => setVideoReady(true)).catch(() => {
          /* autoplay may be blocked until a gesture — unlockers below retry */
        });
      }
    },
    [prepareVideo],
  );

  const playActive = useCallback(() => {
    const el = activeSlotRef.current === 0 ? videoA.current : videoB.current;
    tryPlay(el);
  }, [tryPlay]);

  // Force first clip to play as soon as the element can
  useEffect(() => {
    const a = videoA.current;
    if (!a) return;

    const onCanPlay = () => tryPlay(a);
    const onLoadedData = () => tryPlay(a);

    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("loadeddata", onLoadedData);
    tryPlay(a);

    // Retry briefly — iOS/Android often need a second attempt after layout
    const t1 = window.setTimeout(() => tryPlay(a), 200);
    const t2 = window.setTimeout(() => tryPlay(a), 800);
    const t3 = window.setTimeout(() => tryPlay(a), 1600);

    return () => {
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("loadeddata", onLoadedData);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [tryPlay]);

  // Keep playing while the hero is on screen (helps after tab switches / scroll restore)
  useEffect(() => {
    const root = sectionRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.15)) {
          playActive();
        }
      },
      { threshold: [0, 0.15, 0.5] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [playActive]);

  // If autoplay was blocked, the first user gesture (incl. scroll/touch) unlocks playback
  useEffect(() => {
    const unlock = () => playActive();
    const opts: AddEventListenerOptions = { passive: true, once: true };
    window.addEventListener("touchstart", unlock, opts);
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("scroll", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("scroll", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [playActive]);

  // Mount / preload the second buffer only after the first clip is actually playing
  useEffect(() => {
    if (!hasManyClips || !videoReady) return;
    const id = window.setTimeout(() => setSecondReady(true), 400);
    return () => window.clearTimeout(id);
  }, [hasManyClips, videoReady]);

  const handleEnded = useCallback(() => {
    if (!hasManyClips) {
      tryPlay(videoA.current);
      return;
    }

    const currSlot = activeSlotRef.current;
    const nextSlot: 0 | 1 = currSlot === 0 ? 1 : 0;
    const nextVid = nextSlot === 0 ? videoA.current : videoB.current;

    if (!nextVid?.src) {
      // Second buffer not ready yet — loop current clip
      const curr = currSlot === 0 ? videoA.current : videoB.current;
      if (curr) {
        curr.currentTime = 0;
        tryPlay(curr);
      }
      return;
    }

    tryPlay(nextVid);
    activeSlotRef.current = nextSlot;
    setActiveSlot(nextSlot);

    const clipAfterNext = (inactiveClipIdx.current + 1) % clips.length;
    inactiveClipIdx.current = clipAfterNext;

    const prevVid = currSlot === 0 ? videoA.current : videoB.current;
    window.setTimeout(() => {
      if (!prevVid) return;
      prevVid.pause();
      prevVid.src = clips[clipAfterNext];
      prevVid.load();
    }, 750);
  }, [clips, hasManyClips, tryPlay]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[100svh] flex-col justify-start overflow-hidden"
    >
      {/* Instant paint: static poster so hero is never empty before video starts */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-black"
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden
      />

      <div className="absolute inset-0">
        <video
          ref={videoA}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
            activeSlot === 0 && videoReady ? "opacity-100" : "opacity-0"
          }`}
          src={clips[0]}
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          poster={poster}
          loop={!hasManyClips}
          onEnded={handleEnded}
          onPlaying={() => setVideoReady(true)}
        />

        {secondReady ? (
          <video
            ref={videoB}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
              activeSlot === 1 && videoReady ? "opacity-100" : "opacity-0"
            }`}
            src={clips[1] ?? clips[0]}
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="metadata"
            poster={poster}
            onEnded={handleEnded}
            onPlaying={() => setVideoReady(true)}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <TravelStickers variant="hero" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
        <motion.div
          className="max-w-5xl"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-4 inline-block rounded-full border border-primary-foreground/20 bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm sm:mb-5">
            Trusted by 10,000+ Travelers · {COMPANY.legalName}
          </span>

          <h1 className="mb-3 font-display text-3xl font-extrabold leading-[1.15] text-primary-foreground sm:mb-4 sm:text-4xl lg:text-5xl">
            India&apos;s Trusted Platform for Bus Rental{" "}
            <span className="mt-1 block text-accent">Compare. Choose. Book Instantly</span>
          </h1>

          <p className="mb-4 max-w-xl text-sm font-medium text-primary-foreground/85 sm:text-base">
            Book tempo traveller on rent or luxury bus hire across India — verified operators, best price, GST-transparent quotes.
          </p>

          <p className="mb-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
            Mini bus on rent, tempo traveller booking, Volvo coaches, sleeper buses — compare all options for group travel, weddings, corporate trips &amp; outstation tours.
          </p>
          <p className="mb-6 flex max-w-2xl flex-wrap items-center gap-2 text-xs text-primary-foreground/65 sm:text-sm">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Serving all major cities in India — {COMPANY.operatingLocations}</span>
            <span className="text-primary-foreground/45">·</span>
            <span>GST {COMPANY.gstPercentage}% shown at checkout</span>
          </p>

          <div className="flex w-full max-w-xl flex-col gap-3 sm:max-w-none sm:flex-row sm:gap-4">
            <Link to="/book" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="btn-responsive w-full gap-2 bg-primary sm:w-auto">
                Get Best Price Instantly <ArrowRight className="h-5 w-5 shrink-0" />
              </Button>
            </Link>
            <a href={`tel:+91${COMPANY.contactPhone}`} className="w-full sm:w-auto">
              <Button variant="hero-outline" size="xl" className="btn-responsive w-full sm:w-auto">
                <span className="sm:hidden">Call now — {COMPANY.contactPhoneDisplay}</span>
                <span className="hidden sm:inline">Call for Affordable Bus Hire: {COMPANY.contactPhoneDisplay}</span>
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
