import { motion, useReducedMotion } from "framer-motion";
import {
  Bus,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Chip = {
  icon: LucideIcon;
  label: string;
  className: string;
  delay: number;
};

const HERO_CHIPS: Chip[] = [
  { icon: ShieldCheck, label: "🛡️ GST billing", className: "top-[18%] right-[6%] rotate-[-8deg] hidden md:flex", delay: 0.2 },
  { icon: MapPin, label: "📍 400+ cities", className: "top-[42%] right-[10%] rotate-[7deg] hidden md:flex", delay: 0.45 },
  { icon: Clock3, label: "🕐 24×7 desk", className: "bottom-[22%] right-[5%] rotate-[-5deg] hidden sm:flex", delay: 0.7 },
  { icon: Sparkles, label: "✨ Sanitized fleet", className: "bottom-[16%] left-[8%] rotate-[8deg] hidden sm:flex", delay: 0.55 },
];

const LIGHT_CHIPS: Chip[] = [
  { icon: Bus, label: "🚌 Verified operators", className: "top-4 right-6 rotate-[6deg]", delay: 0.1 },
  { icon: Star, label: "⭐ 4.8 rated", className: "bottom-6 left-4 rotate-[-7deg]", delay: 0.25 },
];

const CTA_CHIPS: Chip[] = [
  { icon: ShieldCheck, label: "🛡️ GST transparent", className: "top-8 left-[8%] rotate-[-8deg] hidden sm:flex", delay: 0.15 },
  { icon: Sparkles, label: "💰 Best price", className: "top-10 right-[10%] rotate-[7deg] hidden sm:flex", delay: 0.3 },
  { icon: MapPin, label: "🇮🇳 Pan-India", className: "bottom-10 left-[12%] rotate-[5deg] hidden md:flex", delay: 0.45 },
];

function FloatingChip({ icon: Icon, label, className, delay, tone }: Chip & { tone: "hero" | "light" | "cta" }) {
  const reduce = useReducedMotion();
  const isServer = globalThis.window === undefined;
  const toneClass =
    tone === "light"
      ? "border-primary/20 bg-card/90 text-foreground shadow-md"
      : "border-white/25 bg-white/15 text-primary-foreground shadow-lg backdrop-blur-md";

  return (
    <motion.span
      className={cn(
        "pointer-events-none absolute z-20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
        toneClass,
        className,
      )}
      initial={reduce || isServer ? false : { opacity: 0, y: 12, scale: 0.92 }}
      animate={reduce || isServer ? undefined : { opacity: 1, y: [0, -7, 0], scale: 1 }}
      transition={
        reduce || isServer
          ? undefined
          : {
              opacity: { duration: 0.5, delay },
              scale: { duration: 0.5, delay },
              y: { duration: 4.4, delay: delay + 0.4, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
    </motion.span>
  );
}

export function TravelStickers({ variant = "hero" }: { variant?: "hero" | "light" | "cta" }) {
  const chips = variant === "light" ? LIGHT_CHIPS : variant === "cta" ? CTA_CHIPS : HERO_CHIPS;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {chips.map((chip) => (
        <FloatingChip key={chip.label} {...chip} tone={variant} />
      ))}
    </div>
  );
}

export function TrustChip({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}
