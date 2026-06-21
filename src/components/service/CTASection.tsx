export default function CTASection() {
    return (
        <section className="mx-4 my-6 rounded-3xl bg-primary py-10 sm:py-14 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                    Need Bus Rental Services?
                </h2>

                <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/90 leading-7 mb-8">
                    Get affordable and reliable transportation solutions for your
                    business. We provide customized bus rental services for
                    corporates, industries, educational institutions, hospitals,
                    airports, and more.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto rounded-2xl bg-white px-8 py-4 font-semibold text-primary shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        Request a Quote
                    </button>

                    <button className="w-full sm:w-auto rounded-2xl border border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-primary">
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    );
}