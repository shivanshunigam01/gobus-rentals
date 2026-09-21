/**
 * Marketing imagery — local files under `public/images/`.
 * Hero clips live under `public/videos/`.
 */
export const fleetImages = {
  coachFrontMountain: "/images/fleet/coach-front-mountain.png",
  coachGoldenHour: "/images/fleet/coach-golden-hour.png",
  coachMountainRoad: "/images/fleet/coach-mountain-road.png",
  coachDepotLine: "/images/fleet/coach-depot-line.png",
  coachSeatsReclining: "/images/fleet/coach-seats-reclining.png",
  coachInteriorSemiSleeper: "/images/fleet/coach-interior-semi-sleeper.png",
  busInteriorOverheadRacks: "/images/fleet/bus-interior-overhead-racks.png",
  vanUrbaniaFront: "/images/fleet/van-urbania-front.png",
  vanTravellerSide: "/images/fleet/van-traveller-side.png",
  vanInteriorAisle: "/images/fleet/van-interior-aisle.png",
  cityNightBus: "/images/fleet-26-seater-ac-bus.png",
  executiveSedan: "/images/fleet/van-traveller-side.png",
  executiveSuv: "/images/fleet/van-urbania-front.png",
  mountainScenic: "/images/fleet/coach-mountain-road.png",
} as const;

/** Rotating fleet card images for seat-class sections. */
export const fleetCardImages = [
  fleetImages.vanUrbaniaFront,
  fleetImages.vanTravellerSide,
  fleetImages.vanInteriorAisle,
  fleetImages.coachDepotLine,
  fleetImages.coachFrontMountain,
  fleetImages.coachGoldenHour,
  fleetImages.coachInteriorSemiSleeper,
  fleetImages.cityNightBus,
] as const;

/** Home gallery mosaic — coach / van / route atmosphere. */
export const galleryImages = {
  charterHero: "/images/gallery-charter-hero.png",
  recliningSeats: "/images/gallery-reclining-seats.png",
  scenicMountainRoad: "/images/gallery-scenic-mountain-road.png",
  luxurySunset: "/images/gallery-luxury-sunset.png",
  spaciousCabin: "/images/gallery-spacious-minibus-cabin.png",
  miniBusAirport: "/images/gallery-mini-bus-airport-city.png",
  volvoHillRoutes: "/images/gallery-volvo-hill-routes.png",
} as const;

/** Hero background clips under `public/videos/` — played in order, then repeat from the first. */
export const heroBackgroundVideos: readonly string[] = [
  "/videos/hero-bus.mp4",
  "/videos/Himachal_Mountain_Bus_A_white_bus_navigates_a_winding_mountain_road_Gc1huKcH.mp4",
  "/videos/Himachal_Mountain_Bus_A_white_bus_with_black_and_red_accents_travels_cDm4sMD-.mp4",
  "/videos/Himachal_Mountain_Bus_A_white_bus_with_red_and_black_accents_drives_RMrQjzSz.mp4",
  "/videos/Himachal_Mountain_Bus_A_white_bus_with_red_and_gold_accents_drives_QXwff6fD.mp4",
  "/videos/Himachal_Mountain_Bus_In_a_cinematic_style_a_white_and_black_tour_bus_YngFtq2N.mp4",
];
