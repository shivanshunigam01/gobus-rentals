import { Users, Snowflake, Moon } from "lucide-react";
import { fleetCardImages } from "@/lib/media";

const fleetItems = [
  {
    title: "12 Seater Tempo Traveller",
    seats: "12",
    desc: "Best tempo traveller on rent for airport transfers, family tours & small group travel",
    ac: true,
    image: fleetCardImages[0],
    alt: "12 seater tempo traveller on rent — AC mini bus for small groups India",
  },
  {
    title: "17 Seater Mini Bus on Rent",
    seats: "17",
    desc: "Affordable mini bus on rent for family outings, pilgrimages & city transfers",
    ac: true,
    image: fleetCardImages[1],
    alt: "17 seater mini bus on rent India — tempo traveller for group travel",
  },
  {
    title: "26 Seater AC Bus Rental",
    seats: "26",
    desc: "Ideal for corporate travel, school trips & office outings — best bus rental price per km",
    ac: true,
    image: fleetCardImages[2],
    alt: "26 seater AC bus rental India — affordable bus hire for corporate travel",
  },
  {
    title: "32 Seater Bus for Group Travel",
    seats: "32",
    desc: "Best bus rental for group travel, medium tours & outstation trips across India",
    ac: true,
    image: fleetCardImages[3],
    alt: "32 seater bus for group travel — bus rental for outstation trip India",
  },
  {
    title: "40 Seater Luxury Bus Rental",
    seats: "40",
    desc: "Premium luxury bus rental in India for weddings, corporate events & large group tours",
    ac: true,
    image: fleetCardImages[4],
    alt: "40 seater luxury bus rental India — premium AC coach for weddings and corporate travel",
  },
  {
    title: "49/52 Seater Coach Hire",
    seats: "49-52",
    desc: "Best bus rental for weddings & events — full-size luxury coach hire at best price",
    ac: true,
    image: fleetCardImages[5],
    alt: "49 seater bus rental for wedding India — luxury coach hire best price",
  },
  {
    title: "Sleeper Bus Rental",
    seats: "30-40",
    desc: "Comfortable sleeper bus rental for overnight outstation trips across India",
    ac: true,
    image: fleetCardImages[6],
    alt: "sleeper bus rental India — overnight AC sleeper coach for outstation travel",
  },
  {
    title: "Non-AC Bus Hire",
    seats: "40-52",
    desc: "Cheap bus hire option — affordable non-AC bus rental for budget group travel",
    ac: false,
    image: fleetCardImages[7],
    alt: "non-AC bus hire India — cheap affordable bus rental for budget group travel",
  },
];

export function FleetSection() {
  return (
    <section id="fleet" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Types of Vehicles Available</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Tempo Traveller &amp; Bus Types for Hire in India
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From 12 seater tempo traveller on rent to 52 seater luxury coaches — best bus rental service for weddings, corporate travel, group tours &amp; outstation trips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fleetItems.map((item) => (
            <div
              key={item.title}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover bg-muted/30 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{item.desc}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <Users className="w-3.5 h-3.5 text-primary" /> {item.seats} seats
                  </span>
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    {item.ac ? <Snowflake className="w-3.5 h-3.5 text-primary" /> : <Moon className="w-3.5 h-3.5 text-muted-foreground" />}
                    {item.ac ? "AC" : "Non-AC"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
