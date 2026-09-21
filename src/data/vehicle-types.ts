import { fleetImages } from "@/lib/media";

/** Fallback vehicle catalog (mirrors backend seed) when API is unavailable. */
export type VehicleTypeItem = {
  slug: string;
  name: string;
  category: "bus" | "coach" | "cab" | "shuttle" | "specialty";
  seatsMin?: number;
  seatsMax?: number;
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  sortOrder?: number;
  status?: string;
};

export const VEHICLE_TYPE_FALLBACK: readonly VehicleTypeItem[] = [
  { slug: "mini-bus", name: "Mini bus", category: "bus", seatsMin: 12, seatsMax: 25, featured: true, sortOrder: 10, imageUrl: fleetImages.vanTravellerSide },
  { slug: "tempo-traveller", name: "Tempo Traveller", category: "bus", seatsMin: 9, seatsMax: 17, featured: true, sortOrder: 20, imageUrl: fleetImages.vanUrbaniaFront },
  { slug: "luxury-bus", name: "Luxury bus", category: "bus", seatsMin: 30, seatsMax: 45, featured: true, sortOrder: 30, imageUrl: fleetImages.coachFrontMountain },
  { slug: "large-coach", name: "Large coach", category: "coach", seatsMin: 40, seatsMax: 56, featured: true, sortOrder: 40, imageUrl: fleetImages.coachGoldenHour },
  { slug: "luxury-coach", name: "Luxury Coach", category: "coach", seatsMin: 40, seatsMax: 56, featured: true, sortOrder: 45, imageUrl: fleetImages.coachDepotLine },
  { slug: "volvo-buses", name: "Volvo buses", category: "coach", seatsMin: 35, seatsMax: 49, featured: true, sortOrder: 50, imageUrl: fleetImages.coachMountainRoad },
  { slug: "mercedes-coach", name: "Mercedes coach", category: "coach", seatsMin: 35, seatsMax: 49, featured: false, sortOrder: 60, imageUrl: fleetImages.coachDepotLine },
  { slug: "bharatbenz-bus", name: "Bharatbenz bus", category: "bus", seatsMin: 30, seatsMax: 49, featured: false, sortOrder: 70, imageUrl: fleetImages.cityNightBus },
  { slug: "bus-with-washroom", name: "Bus with washroom", category: "bus", seatsMin: 30, seatsMax: 45, featured: false, sortOrder: 80, imageUrl: fleetImages.coachInteriorSemiSleeper },
  { slug: "toyota-minibus", name: "Toyota minibus", category: "bus", seatsMin: 12, seatsMax: 26, featured: false, sortOrder: 90, imageUrl: fleetImages.vanInteriorAisle },
  { slug: "isuzu-bus", name: "Isuzu bus", category: "bus", seatsMin: 20, seatsMax: 35, featured: false, sortOrder: 100, imageUrl: fleetImages.vanTravellerSide },
  { slug: "mitsubishi-bus", name: "Mitsubishi bus", category: "bus", seatsMin: 20, seatsMax: 35, featured: false, sortOrder: 110, imageUrl: fleetImages.vanUrbaniaFront },
  { slug: "motorhome", name: "Motorhome", category: "specialty", seatsMin: 2, seatsMax: 8, featured: false, sortOrder: 120, imageUrl: fleetImages.vanInteriorAisle },
  { slug: "urbania", name: "Urbania", category: "bus", seatsMin: 9, seatsMax: 17, featured: true, sortOrder: 15, imageUrl: fleetImages.vanUrbaniaFront },
  { slug: "force-urbania", name: "Force Urbania", category: "bus", seatsMin: 9, seatsMax: 17, featured: true, sortOrder: 16, imageUrl: fleetImages.vanTravellerSide },
  { slug: "cab", name: "Cab", category: "cab", seatsMin: 3, seatsMax: 4, featured: true, sortOrder: 200, imageUrl: fleetImages.executiveSedan },
  { slug: "sedan", name: "Sedan", category: "cab", seatsMin: 3, seatsMax: 4, featured: true, sortOrder: 210, imageUrl: fleetImages.executiveSedan },
  { slug: "suv", name: "SUV", category: "cab", seatsMin: 5, seatsMax: 7, featured: true, sortOrder: 220, imageUrl: fleetImages.executiveSuv },
  { slug: "muv", name: "MUV", category: "cab", seatsMin: 6, seatsMax: 8, featured: true, sortOrder: 230, imageUrl: fleetImages.executiveSuv },
  { slug: "hatchback", name: "Hatchback", category: "cab", seatsMin: 3, seatsMax: 4, featured: false, sortOrder: 240, imageUrl: fleetImages.executiveSedan },
  { slug: "innova-crysta", name: "Innova Crysta", category: "cab", seatsMin: 6, seatsMax: 7, featured: true, sortOrder: 250, imageUrl: fleetImages.executiveSuv },
  { slug: "employee-shuttle", name: "Employee Shuttle", category: "shuttle", seatsMin: 12, seatsMax: 40, featured: true, sortOrder: 300, imageUrl: fleetImages.cityNightBus },
  { slug: "corporate-shuttle", name: "Corporate Shuttle", category: "shuttle", seatsMin: 12, seatsMax: 45, featured: true, sortOrder: 310, imageUrl: fleetImages.coachDepotLine },
  { slug: "airport-shuttle", name: "Airport Shuttle", category: "shuttle", seatsMin: 8, seatsMax: 40, featured: true, sortOrder: 320, imageUrl: fleetImages.vanUrbaniaFront },
] as const;

/** Booking labels — names from catalog */
export const BOOKING_BUS_TYPES: readonly string[] = VEHICLE_TYPE_FALLBACK.map((v) => v.name);
