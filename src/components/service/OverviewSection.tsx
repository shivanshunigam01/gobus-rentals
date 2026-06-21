type Props = {
    overview: string;
};

export default function OverviewSection({
    overview,
}: Props) {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Overview
                </h2>

                <p className="max-w-4xl text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
                    {overview}
                </p>
            </div>
        </section>
    );
}