type Props = {
    keywords: string[];
};

export default function KeywordsSection({
    keywords,
}: Props) {
    return (
        <section className="my-6 mx-4 rounded-2xl bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Popular Services
                </h2>

                <div className="flex flex-wrap gap-3">
                    {keywords.map((keyword) => (
                        <div
                            key={keyword}
                            className="rounded-full bg-white px-4 py-2 text-sm sm:text-base text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-md"
                        >
                            {keyword}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}