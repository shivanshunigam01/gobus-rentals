import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type DecorItem = {
  emoji: string;
  className: string;
  delay: number;
  size?: "sm" | "md" | "lg";
};

const PRESETS: Record<"hero" | "cta" | "guide" | "stats" | "light", DecorItem[]> = {
  hero: [
    { emoji: "🚌", className: "top-[12%] left-[4%] rotate-[-12deg]", delay: 0, size: "lg" },
    { emoji: "✈️", className: "top-[8%] right-[18%] rotate-[8deg] hidden sm:block", delay: 0.3, size: "md" },
    { emoji: "🛣️", className: "bottom-[28%] left-[6%] rotate-[6deg] hidden md:block", delay: 0.5, size: "md" },
    { emoji: "🎒", className: "bottom-[18%] right-[22%] rotate-[-10deg] hidden lg:block", delay: 0.7, size: "sm" },
  ],
  cta: [
    { emoji: "🎉", className: "top-[14%] left-[6%] rotate-[-8deg]", delay: 0.1, size: "lg" },
    { emoji: "💼", className: "top-[20%] right-[8%] rotate-[10deg]", delay: 0.35, size: "md" },
    { emoji: "⭐", className: "bottom-[18%] left-[10%] rotate-[5deg] hidden sm:block", delay: 0.55, size: "md" },
    { emoji: "🛡️", className: "bottom-[12%] right-[14%] rotate-[-6deg] hidden sm:block", delay: 0.75, size: "sm" },
  ],
  guide: [
    { emoji: "🚐", className: "top-6 right-8 rotate-[8deg]", delay: 0.15, size: "md" },
    { emoji: "📍", className: "bottom-8 left-6 rotate-[-6deg] hidden sm:block", delay: 0.4, size: "sm" },
    { emoji: "🧳", className: "top-1/2 right-4 -translate-y-1/2 rotate-[12deg] hidden md:block", delay: 0.6, size: "sm" },
  ],
  stats: [
    { emoji: "🏆", className: "top-2 left-[8%] rotate-[-10deg] hidden sm:block", delay: 0.2, size: "md" },
    { emoji: "🌟", className: "top-4 right-[10%] rotate-[8deg] hidden sm:block", delay: 0.45, size: "md" },
  ],
  light: [
    { emoji: "🎯", className: "top-2 right-4 rotate-[6deg]", delay: 0.1, size: "sm" },
    { emoji: "✨", className: "bottom-3 left-4 rotate-[-8deg]", delay: 0.3, size: "sm" },
  ],
};

const sizeClass = { sm: "text-2xl", md: "text-3xl sm:text-4xl", lg: "text-4xl sm:text-5xl" };

function FloatingEmoji({ emoji, className, delay, size = "md" }: DecorItem) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-[5] select-none opacity-80 drop-shadow-md filter",
        sizeClass[size],
        className,
      )}
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 16 }}
      animate={
        reduce
          ? undefined
          : {
              opacity: [0.65, 1, 0.65],
              y: [0, -10, 0],
              rotate: [0, 6, -4, 0],
              scale: [1, 1.08, 1],
            }
      }
      transition={
        reduce
          ? undefined
          : {
              opacity: { duration: 0.5, delay },
              y: { duration: 4.5, delay: delay + 0.3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.5, delay: delay + 0.5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3.8, delay: delay + 0.2, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      {emoji}
    </motion.span>
  );
}

export function FloatingEmojiDecor({
  variant = "light",
  className,
}: {
  variant?: keyof typeof PRESETS;
  className?: string;
}) {
  const items = PRESETS[variant];
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {items.map((item) => (
        <FloatingEmoji key={`${variant}-${item.emoji}-${item.className}`} {...item} />
      ))}
    </div>
  );
}
