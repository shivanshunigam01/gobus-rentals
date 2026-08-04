/**
 * Navbar → Services menu — hubs + featured solutions.
 */
export type NavbarServiceTypeLink = Readonly<{
  label: string;
  to: string;
}>;

export const NAVBAR_SERVICE_TYPE_LINKS: readonly NavbarServiceTypeLink[] = [
  { label: "All Services", to: "/services" },
  { label: "Corporate Solutions", to: "/corporate" },
  { label: "Industry Solutions", to: "/industries" },
  { label: "Corporate Bus Rental", to: "/corporate/corporate-bus-rental" },
  { label: "Employee Transportation", to: "/corporate/employee-transportation-services" },
  { label: "Corporate Shuttle", to: "/corporate/corporate-shuttle-services" },
  { label: "Executive Transportation", to: "/corporate/executive-transportation" },
  { label: "IT Company Transportation", to: "/industries/it-company-transportation" },
  { label: "Airport Transportation", to: "/industries/airport-transportation" },
  { label: "Urbania for Corporates", to: "/services/urbania-rental-for-corporates" },
  { label: "Cab & Car for Business", to: "/services/cab-and-car-rental-for-business" },
];
