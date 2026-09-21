import { motion, useReducedMotion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GlowBookingButtonProps = ButtonProps & {
  /** Pulsing shield-style outer glow */
  pulse?: boolean;
  /** Small shield icon beside label */
  shield?: boolean;
  /** Leading emoji */
  emoji?: string;
};

export function GlowBookingButton({
  pulse = true,
  shield = true,
  emoji,
  children,
  className,
  ...props
}: GlowBookingButtonProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className="relative inline-flex w-full sm:w-auto"
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {pulse && !reduce ? (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400/55 via-primary/70 to-indigo-500/55 blur-md"
            animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.97, 1.07, 0.97] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-xl border-2 border-primary/45"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.35) 0%, transparent 55%)",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <Button className={cn("relative z-10 glow-shield-btn w-full sm:w-auto", className)} {...props}>
        {emoji ? (
          <span className="text-base leading-none sm:text-lg" aria-hidden>
            {emoji}
          </span>
        ) : null}
        {children}
        {shield ? <Shield className="h-4 w-4 shrink-0 opacity-90 drop-shadow-sm" aria-hidden /> : null}
      </Button>
    </motion.span>
  );
}
