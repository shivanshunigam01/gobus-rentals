import { motion } from "framer-motion";
import { Bus, Users, Star, MapPin } from "lucide-react";
import { FloatingEmojiDecor } from "@/components/brand/FloatingEmojiDecor";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const stats = [
  { icon: Bus, emoji: "🚌", value: "500+", label: "Verified Bus Operators" },
  { icon: Users, emoji: "👥", value: "10,000+", label: "Trusted by Travelers" },
  { icon: Star, emoji: "⭐", value: "4.8/5", label: "Average Rating" },
  { icon: MapPin, emoji: "📍", value: "400+", label: "Cities Across India" },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-10 sm:py-14">
      <FloatingEmojiDecor variant="stats" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <motion.div
                className="text-center px-2 rounded-2xl py-2"
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <span className="mb-1 block text-2xl" aria-hidden>{stat.emoji}</span>
                <stat.icon className="w-7 h-7 text-primary-foreground/70 mx-auto mb-2" />
                <div className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-primary-foreground/70 mt-1 leading-snug text-balance">{stat.label}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
