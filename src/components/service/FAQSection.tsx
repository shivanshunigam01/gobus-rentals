import type { FAQ } from "@/data/service-type-pages";

type Props = {
    faqs: FAQ[];
};

export default function FAQSection({
    faqs,
}: Props) {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4 sm:space-y-6">
                    {faqs.map((faq) => (
                        <div
                            key={faq.question}
                            className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            <h3 className="mb-3 text-lg sm:text-xl font-semibold text-foreground">
                                {faq.question}
                            </h3>

                            <p className="text-sm sm:text-base leading-7 text-gray-600">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}