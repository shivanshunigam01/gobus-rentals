type HeroSectionProps = {
    title: string;
    description: string;
};

export default function HeroSection({
    title,
    description,
}: HeroSectionProps) {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
                    {title}
                </h1>

                <p className="max-w-3xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    );
}