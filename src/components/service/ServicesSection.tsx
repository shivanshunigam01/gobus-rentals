type Props = {
    services: string[];
};

export default function ServicesSection({
    services,
}: Props) {
    return (
        <section className="my-6 mx-4 rounded-2xl bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Services We Provide
                </h2>

                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service}
                            className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex items-start gap-3">
                                <span className="mt-1 text-primary">✓</span>

                                <p className="text-sm sm:text-base leading-6 text-muted-foreground">
                                    {service}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}