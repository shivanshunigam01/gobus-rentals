type Props = {
    benefits: string[];
};

export default function BenefitsSection({
    benefits,
}: Props) {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Why Choose Us
                </h2>

                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit}
                            className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold">
                                ✓
                            </div>

                            <p className="text-sm sm:text-base leading-6 text-gray-700">
                                {benefit}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}