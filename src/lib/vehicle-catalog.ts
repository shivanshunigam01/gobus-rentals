export type VehicleCatalogItem = {
  seats: string;
  title: string;
  description: string;
  bestFor: string;
  slug: string
};

export const VEHICLE_CATALOG: VehicleCatalogItem[] = [
  {
    slug: "12-seater",
    seats: "12 Seater",
    title: "Tempo Traveller (Compact Premium)",
    description:
      "A 12 seater is ideal for airport transfers, family tours, and city events where lane access matters. It balances comfort, AC cooling, and easy parking.",
    bestFor: "Airport pickup, local sightseeing, wedding family movement",
  },
  {
    slug: "14-seater",
    seats: "14 Seater",
    title: "Extended Tempo Traveller",
    description:
      "A 14 seater gives extra room for luggage and hand-carry without moving to a large bus class. It works well for short intercity hops and business teams.",
    bestFor: "Corporate team travel, station transfers, weekend road trips",
  },
  {
    slug: "17-slug",
    seats: "17 Seater",
    title: "Urbania / Traveller Group Van",
    description:
      "The 17 seater class is common for premium small groups that want pushback seating and cleaner cabin finishes while keeping compact vehicle dimensions.",
    bestFor: "Small wedding groups, crew transport, school activity runs",
  },
  {
    slug: "20-seater",
    seats: "20 Seater",
    title: "Mini Coach",
    description:
      "A 20 seater mini coach is a practical bridge between tempo travellers and full-size buses. It improves per-seat economics for medium groups.",
    bestFor: "Pilgrimage batches, college clubs, event shuttle loops",
  },
  {
    slug: "26-seater",
    seats: "26 Seater",
    title: "AC Mid-Size Bus",
    description:
      "A 26 seater AC bus is one of the highest-demand categories for structured group movement. It is comfortable for day tours and local contracts.",
    bestFor: "School excursions, office outings, convention feeder routes",
  },
  {
    slug: "30-seater",
    seats: "30 Seater",
    title: "Premium Mid-Coach",
    description:
      "The 30 seater class offers improved aisle space and comfort for longer drives while preserving maneuverability in mixed city and highway traffic.",
    bestFor: "Corporate events, destination ceremonies, city-to-city transfer",
  },
  {
    slug: "32-seater",
    seats: "32 Seater",
    title: "Touring Bus",
    description:
      "A 32 seater touring bus supports balanced capacity and ride comfort for operators running recurring tourism and institutional movement schedules.",
    bestFor: "Multi-day tours, educational institutions, spiritual circuits",
  },
  {
    slug: "35-seater",
    seats: "35 Seater",
    title: "Large Mid-Size Coach",
    description:
      "35 seater buses are selected when passenger count sits between medium and large categories. They reduce empty-seat cost versus a 40+ seater.",
    bestFor: "Wedding guest batches, employee transport, private group tours",
  },
  {
    slug: "40=seater",
    seats: "40 Seater",
    title: "Luxury Seater Coach",
    description:
      "A 40 seater luxury coach is suitable for premium group travel that needs superior suspension, cabin comfort, and organized boarding for events.",
    bestFor: "Luxury bus rental, corporate VIP movement, intercity groups",
  },
  {
    slug: "45-seater",
    seats: "45 Seater",
    title: "Event Mobility Coach",
    description:
      "45 seater buses are preferred for weddings and conferences with fixed attendance. They support simple dispatch planning and efficient batch movement.",
    bestFor: "Wedding guest routing, MICE transport, festival group movement",
  },
  {
    slug: "49-seater",
    seats: "49 Seater",
    title: "High-Capacity AC Coach",
    description:
      "The 49 seater class is commonly used for high-volume movements with strong value per seat, especially for one-day events and institutional charters.",
    bestFor: "School annual trips, social organizations, city shuttle plans",
  },
  {
    slug: "52-seater",
    seats: "52 Seater",
    title: "Full-Size Luxury Coach",
    description:
      "52 seater coaches are standard for large charter requirements and are often chosen for highway comfort, luggage handling, and predictable operations.",
    bestFor: "Large wedding programs, interstate tours, convention transport",
  },
  {
    slug: "56-seater",
    seats: "56 Seater",
    title: "Maxi Capacity Coach",
    description:
      "A 56 seater bus optimizes cost for bigger groups when route access permits large-wheelbase vehicles and higher boarding throughput.",
    bestFor: "Mass guest transfer, educational tours, bulk corporate movement",
  },
  {
    slug: "60-seater",
    seats: "60 Seater",
    title: "Super Coach",
    description:
      "60 seater coaches are used for dense-capacity movement where fewer vehicles are preferred to simplify convoy management and parking logistics.",
    bestFor: "Election duty movement, staff transport, mega event operations",
  },
  {
    slug: "66-seater",
    seats: "66 Seater",
    title: "Ultra High Capacity Bus",
    description:
      "A 66 seater bus is the largest common category for very high-volume transport planning. Best suited for fixed routes and wide-entry venues.",
    bestFor: "Pilgrimage mega groups, large institution movement, rally logistics",
  },
];
