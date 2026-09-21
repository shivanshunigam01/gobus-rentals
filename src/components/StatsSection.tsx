import { Bus, Users, Star, MapPin } from "lucide-react";

const stats = [
  { icon: Bus, value: "500+", label: "Verified Bus Operators" },
  { icon: Users, value: "10,000+", label: "Trusted by Travelers" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
  { icon: MapPin, value: "400+", label: "Cities Across India" },
];

export function StatsSection() {
  return (
    <section className="bg-primary py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-2">
              <stat.icon className="w-7 h-7 text-primary-foreground/70 mx-auto mb-2" />
              <div className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-xs sm:text-sm text-primary-foreground/70 mt-1 leading-snug text-balance">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
