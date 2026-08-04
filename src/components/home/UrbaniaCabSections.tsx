import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function UrbaniaSection() {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm font-medium text-primary mb-2">Premium vans</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Force Urbania for corporate teams</h2>
          <p className="text-muted-foreground mb-5">
            Comfortable 9–17 seater Urbania vans for executive travel, airport runs, and small employee clusters —
            with AC comfort and professional chauffeurs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/book" search={{ busType: "Urbania" } as never}>
                Book Urbania
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/services/$serviceSlug" params={{ serviceSlug: "urbania-rental-for-corporates" }}>
                Learn more
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border bg-gradient-to-br from-muted to-background aspect-[4/3] flex items-center justify-center p-8">
          <p className="font-display text-3xl font-bold text-center">Urbania &amp; Force Urbania</p>
        </div>
      </div>
    </section>
  );
}

export function CabSection() {
  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1 rounded-2xl border bg-gradient-to-br from-background to-muted aspect-[4/3] flex items-center justify-center p-8">
          <p className="font-display text-3xl font-bold text-center">Sedan · SUV · Innova Crysta</p>
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-medium text-primary mb-2">Business cabs</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Cabs for executives &amp; point-to-point travel</h2>
          <p className="text-muted-foreground mb-5">
            Extend your corporate program with sedan, SUV, MUV, hatchback, and Innova Crysta — ideal for leadership,
            client visits, and airport transfers.
          </p>
          <Button asChild>
            <Link to="/services/$serviceSlug" params={{ serviceSlug: "cab-and-car-rental-for-business" }}>
              Explore cab rental
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
