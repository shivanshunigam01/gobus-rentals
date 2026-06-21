import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Props {
    vehicle: {
        slug: string;
        seats: string;
        title: string;
        description: string;
        bestFor: string;
    };
}

export function CapacityPage({ vehicle }: Props) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-24">
                <div className="max-w-5xl mx-auto px-4">

                    {/* Hero */}
                    <section className="mb-10">
                        <h1 className="text-4xl font-bold mb-4">
                            {vehicle.seats} Bus Rental
                        </h1>

                        <p className="text-muted-foreground text-lg">
                            Book {vehicle.seats.toLowerCase()} buses at affordable prices.
                            Suitable for family trips, weddings, corporate outings,
                            pilgrimages, and group tours.
                        </p>

                        <div className="mt-6">
                            <Button size="lg">
                                Get Free Quotes
                            </Button>
                        </div>
                    </section>

                    {/* About */}
                    <section className="rounded-xl border p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            About {vehicle.seats} Rental
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            {vehicle.description}
                        </p>
                    </section>

                    {/* Features */}
                    <section className="rounded-xl border p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Features
                        </h2>

                        <ul className="space-y-3">
                            <li>✓ Pushback seats</li>
                            <li>✓ Fully air-conditioned</li>
                            <li>✓ Professional driver</li>
                            <li>✓ Music system</li>
                            <li>✓ Ample luggage space</li>
                            <li>✓ Sanitized interiors</li>
                        </ul>
                    </section>

                    {/* Best For */}
                    <section className="rounded-xl border p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Best For
                        </h2>

                        <p className="text-muted-foreground">
                            {vehicle.bestFor}
                        </p>
                    </section>

                    {/* FAQs */}
                    <section className="rounded-xl border p-6">
                        <h2 className="text-2xl font-semibold mb-6">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold">
                                    What is the price of {vehicle.seats} bus rental?
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Pricing depends on distance, duration and city.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Is AC available?
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Yes, most vehicles come with AC.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Can I book for outstation trips?
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Yes, these vehicles are available for local and outstation travel.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}