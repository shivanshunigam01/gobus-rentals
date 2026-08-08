/**
 * Category-matched transport imagery via the Unsplash image CDN.
 * (`source.unsplash.com` is deprecated and returns 503.)
 */
const premiumImage = (photoPath: string, width: number, height: number) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;

export const fleetImages = {
  coachFrontMountain: premiumImage("photo-1570125909232-eb263c188f7e", 1600, 1000),
  coachGoldenHour: premiumImage("photo-1570125909517-53cb21c89ff2", 1920, 1080),
  coachMountainRoad: premiumImage("photo-1469854523086-cc02fe5d8800", 1600, 1066),
  coachDepotLine: premiumImage("photo-1557223562-6c77ef16210f", 1800, 900),
  coachSeatsReclining: premiumImage("photo-1753601466176-183ba05f9aa6", 1280, 960),
  coachInteriorSemiSleeper: premiumImage("photo-1722863101489-8167ecd2190c", 1280, 960),
  busInteriorOverheadRacks: premiumImage("photo-1753601466176-183ba05f9aa6", 1280, 960),
  vanUrbaniaFront: premiumImage("photo-1627730595404-e18ac2b63887", 1280, 960),
  vanTravellerSide: premiumImage("photo-1654194820829-23adc79d1ef4", 1280, 960),
  vanInteriorAisle: premiumImage("photo-1769690094024-b63b1b24ecbd", 1280, 960),
  cityNightBus: premiumImage("photo-1768753001054-1d29eaa47b48", 1600, 1000),
  executiveSedan: premiumImage("photo-1485291571150-772bcfc10da5", 1280, 960),
  executiveSuv: premiumImage("photo-1533473359331-0135ef1b58bf", 1280, 960),
  mountainScenic: premiumImage("photo-1506905925346-21bda4d32df4", 1600, 1000),
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
  charterHero: fleetImages.coachGoldenHour,
  recliningSeats: fleetImages.coachSeatsReclining,
  scenicMountainRoad: fleetImages.coachMountainRoad,
  luxurySunset: fleetImages.coachFrontMountain,
  spaciousCabin: fleetImages.busInteriorOverheadRacks,
  miniBusAirport: fleetImages.vanUrbaniaFront,
  volvoHillRoutes: fleetImages.coachDepotLine,
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
