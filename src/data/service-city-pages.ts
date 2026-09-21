import { COMPANY } from "@/lib/company";
import { fleetImages } from "@/lib/media";

/**
 * Premium “service city” landing pages at `/service-city/{slug}`.
 * Hero imagery uses Unsplash coach photos from `@/lib/media`.
 */

export type ServiceCityPage = {
  slug: string;
  cityName: string;
  state: string;
  /** Browser title: "Luxury Bus Rental in {City} | Kartar Travels Pvt Ltd" */
  pageTitle: string;
  metaDescription: string;
  /** Keywords for meta tag */
  keywords: string;
  /** Legacy filename hint (UI uses Unsplash via serviceCityImageUrl) */
  imageFile: string;
  imageAlt: string;
  /** H1 shown on page (can match title intent) */
  h1: string;
  /** 1500–2000 words total across sections */
  sections: readonly { id: string; heading: string; paragraphs: readonly string[] }[];
};

const brandShort = "Kartar Travels Pvt Ltd";

export const SERVICE_CITY_PAGES: readonly ServiceCityPage[] = [
  {
    slug: "chandigarh",
    cityName: "Chandigarh",
    state: "Chandigarh",
    pageTitle: `Luxury Bus Rental in Chandigarh | ${brandShort}`,
    metaDescription: `${COMPANY.legalName} offers luxury bus rental in Chandigarh Tricity: Volvo, Mercedes-Benz, AC coaches & tempo traveller for weddings, corporate travel & Himachal routes. Compare quotes on Luxury Bus Rental with GST-transparent pricing.`,
    keywords:
      "luxury bus rental Chandigarh, bus hire Chandigarh, Volvo bus Chandigarh, wedding bus rental Chandigarh, corporate bus hire Chandigarh, Kartar Travels, tempo traveller Chandigarh, Mohali Panchkula bus charter",
    imageFile: "luxury-bus-rental-chandigarh.jpg",
    imageAlt: "Luxury bus rental in Chandigarh — Volvo and premium coaches with Kartar Travels",
    h1: "Luxury Bus Rental in Chandigarh",
    sections: [
      {
        id: "intro",
        heading: "Premium group transport across Chandigarh, Mohali & Panchkula",
        paragraphs: [
          `Chandigarh is not only a planned capital—it is the operational heart of the greater Tricity region and one of North India’s busiest corridors for weddings, corporate offsites, college fests, cricket and concert shuttles, and leisure movement toward the Shivalik foothills. When organisers search for luxury bus rental in Chandigarh, they are rarely asking for a generic “large vehicle.” They want punctual reporting at Sector 17 or Industrial Area gates, disciplined routing through Madhya Marg or Udyog Path bottlenecks during peak hours, and coaches that look presentable on camera for baraat and delegate arrivals alike. ${COMPANY.legalName}, marketed to travellers as Luxury Bus Rental, was built around that expectation: verified operators, structured quotes, and billing clarity so procurement teams and families can plan transport without last‑minute surprises.`,
          `The Tricity ecosystem—Chandigarh, Mohali, and Panchkula—creates unique demand patterns. IT and BFSI campuses in Mohali generate recurring employee shuttle needs; Panchkula’s residential sectors feed school and college excursions; Chandigarh’s hotels and banquets anchor high‑visibility weddings where convoy timing is as critical as vehicle finish. A dependable luxury bus hire partner in Chandigarh understands that a 45‑seater Volvo coach may be perfect for a single‑venue wedding loop but the wrong tool for narrow‑lane pickups across older sectors. That is why route realism, pickup clustering, and realistic buffer times matter as much as the brand badge on the front grille.`,
          `Kartar Travels Pvt Ltd positions Luxury Bus Rental as a marketplace layer on top of disciplined operators: you submit one itinerary—pickup clusters, drop logic, date, passenger count, and preferred vehicle class—and receive comparable quotations rather than opaque phone haggling. GST treatment is surfaced at confirmation so finance teams in Sector 34 offices or Gurugram HQs can reconcile totals confidently. Whether you need a compact tempo traveller for twenty‑two guests or a 52‑seater luxury coach for a two‑day corporate summit, the workflow stays consistent: clarity first, commitment second.`,
        ],
      },
      {
        id: "fleet",
        heading: "Fleet choices that match Tricity roads and event scale",
        paragraphs: [
          `Luxury bus rental in Chandigarh spans multiple segments, and intelligent selection reduces both cost and operational risk. Tempo traveller class vehicles (often 9–17 seats) dominate airport transfers from Chandigarh International Airport, late‑night music‑show exits, and boutique weddings where lane width and turnaround radius in sectors matter. Moving up, 26–35 seater midi buses suit college industrial tours and mid‑size corporate batches. For large weddings and exhibition delegations, 40–52 seater AC luxury coaches provide the right balance of aisle space, luggage volume, and stage presence when guests arrive at Zirakpur or New Chandigarh venues.`,
          `Volvo and Mercedes‑Benz chassis coaches remain the prestige default for outstation runs—Shimla, Manali, Kasauli, Amritsar, Delhi NCR—because suspension quality and NVH (noise, vibration, harshness) materially affect passenger fatigue on Himalayan climbs and long NH stretches. Sleeper buses appear where overnight repositioning is unavoidable, but many Tricity clients still prefer day‑seater recliners for hill routes because boarding and deboarding are faster at dhaba halts and toll plazas. Non‑AC options have not disappeared from the market, yet most premium charter demand in Chandigarh leans air‑conditioned for summer heat and monsoon humidity management.`,
          `When evaluating luxury bus hire quotes, ask operators for coach age bands, tyre condition policy, and compressor service history—June heat and July rain stress AC systems on stationary idling outside banquet gates. For convoys, confirm whether a backup vehicle clause exists if the primary coach faces mechanical delay on the Zirakpur‑Kalka corridor, where traffic volatility is common during long weekends.`,
        ],
      },
      {
        id: "use-cases",
        heading: "Weddings, corporates, schools & pilgrimage from Chandigarh",
        paragraphs: [
          `Wedding bus rental in Chandigarh is a choreography problem disguised as a transport problem. Families need baraat legs timed against muhurat windows, parallel guest shuttles between hotel clusters in Sector 35 and banquet roads in Peer Muchalla, and sometimes overnight security for parked coaches. Luxury positioning is not vanity—it reduces friction when VIP elders board with limited mobility and when photographers need clean, well‑lit door frames for candid shots. Clear escalation contacts and a single convoy lead on WhatsApp reduce the chaos that otherwise spills into the wedding planner’s timeline.`,
          `Corporate bus hire across Chandigarh’s IT corridors and industrial pockets requires SLAs closer to aviation than traditional road charter: repeated monthly routes, on‑time dashboards, and occasionally branded seat‑backs for townhalls. Organisers should document night‑driving policies, especially when returning from Delhi NCR after single‑day reviews—fatigue rules for drivers are not bureaucratic footnotes; they are liability guardrails.`,
          `Schools and universities booking bus rental in Chandigarh for Naina Devi, Morni Hills, or Pinjore Garden excursions should standardise teacher‑to‑student ratios per bus and pre‑assign seats to speed boarding at Sector 43 ISBT‑adjacent pickups. Pilgrimage groups heading toward Vaishno Devi or Haridwar often need luggage discipline for prasad cartons and walking sticks; specifying under‑belly cubic capacity upfront avoids roof‑rack debates at the last mile.`,
        ],
      },
      {
        id: "pricing",
        heading: "Pricing, GST, tolls & what to clarify before you pay",
        paragraphs: [
          `Transparent luxury bus rental pricing in Chandigarh separates headline rental from fully loaded trip economics. Ask whether tolls and parking at popular venues (exhibition grounds, cricket stadium peripheries, elite farmhouses on Kharar Road) are actuals with receipts or lump‑sum estimates. Driver night allowance and hill‑state green‑tax line items should appear in writing before you transfer advance—Kartar Travels Pvt Ltd emphasises GST‑visible totals on Luxury Bus Rental confirmations so you see taxable value, GST rate, and grand total aligned with Indian invoicing norms.`,
          `Advance schedules vary by season; wedding peak weekends around Diwali and New Year can compress fleet availability despite higher pricing. If your itinerary includes multiple empty legs—ferrying empty from a Mohali depot to a Panchkula first pickup—ask whether garage‑to‑garage or point‑to‑point kilometre logic applies. Misalignment here is a frequent source of invoice disputes after the trip.`,
        ],
      },
      {
        id: "routes",
        heading: "Popular outstation corridors from Chandigarh",
        paragraphs: [
          `Groups chartering luxury buses from Chandigarh frequently target Shimla and Kasauli for weekend elevation gain, Amritsar for heritage and cuisine tours, and Delhi‑Gurgaon for exhibitions and aviation connections. Manali and Spiti‑bound convoys require altitude‑aware maintenance histories—brake cooling on Rohtang approach roads and fuel planning for long non‑stop climbs. For each corridor, share accurate passenger counts, luggage dimensions, and halt expectations; operators then right‑size axles and tyre compounds instead of sending an under‑powered coach that struggles on steep ramps.`,
          `Within Haryana and Punjab plains, routes to Ludhiana, Jalandhar, Patiala, and Bathinda remain strong for sports tournaments and university fests. Corporate roadshows sometimes chain three cities in forty‑eight hours; in those cases, dual‑driver rotations may be safer than stretching single‑driver statutory limits—request this explicitly in your briefing note.`,
        ],
      },
      {
        id: "booking",
        heading: "How to book luxury bus rental with Luxury Bus Rental",
        paragraphs: [
          `Start on the Book page: capture every pickup pin, sequencing, reporting time window, return leg, and special needs (wheelchair access, extra icebox storage, PA system for announcements). Uploading a rough Google Maps timeline reduces ambiguity more than verbal descriptions alone. After operators respond, compare not only rupee totals but also inclusion lists, contingency posture, and communication quality—slow responders during sales rarely improve on trip day.`,
          `Once you shortlist a luxury coach, confirm the payment plan—advance versus full—and cancellation windows aligned with your event insurance. Kartar Travels Pvt Ltd’s marketplace standards encourage documented handoffs so both sides know who holds operational truth at 6:00 AM on departure day. Keep PDF confirmations accessible offline; mobile network gaps still appear on certain Himalayan stretches.`,
        ],
      },
      {
        id: "why-kartar",
        heading: `Why organisers trust ${brandShort} for Chandigarh charters`,
        paragraphs: [
          `${COMPANY.legalName} has operated since 2018 with a North India mindset: premium fleets, route‑literate teams, and billing hygiene suitable for corporate auditors and wedding CFOs alike. Luxury Bus Rental extends that operational DNA into a comparison workflow—so you spend less time chasing phone quotes and more time rehearsing your event run‑of‑show.`,
          `Whether your next movement is a single‑day delegate loop within the Tricity or a multi‑day hill expedition, begin with structured requirements. The return is predictable pricing visibility, cleaner manifests, and coaches that show up looking as serious about your schedule as you are.`,
        ],
      },
    ],
  },
];

const bySlug = new Map(SERVICE_CITY_PAGES.map((p) => [p.slug, p]));

export function getServiceCityPage(slug: string): ServiceCityPage | undefined {
  return bySlug.get(slug);
}

export function listServiceCitySlugs(): string[] {
  return SERVICE_CITY_PAGES.map((p) => p.slug);
}

/** Public URL path for a service city page */
export function serviceCityPath(slug: string): `/service-city/${string}` {
  return `/service-city/${slug}`;
}

export function serviceCityImageUrl(slug: string): string {
  const p = getServiceCityPage(slug);
  if (!p) return fleetImages.coachFrontMountain;
  // Stable Unsplash coach hero — local service-city JPEGs are not shipped in public/
  return fleetImages.coachFrontMountain;
}
