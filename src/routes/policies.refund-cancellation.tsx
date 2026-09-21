import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { COMPANY } from "@/lib/company";
import { buildPageMeta } from "@/lib/seo/buildMeta";

export const Route = createFileRoute("/policies/refund-cancellation")({
  component: RefundPolicyPage,
  head: () =>
    buildPageMeta({
      title: `Refund & Cancellation — ${COMPANY.legalName}`,
      description: "Refund, cancellation, and payment rules for Kartar Travels / Luxury Bus Rental bookings.",
      path: "/policies/refund-cancellation",
    }),
});

/** Client policy copy — structured for legal clarity; replace with signed-off text if the client supplies a different version. */
const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Scope",
    body: [
      `These Refund & Cancellation Rules apply to bookings made through ${COMPANY.platformBrand} operated by ${COMPANY.legalName} and participating bus operators.`,
      "Confirmed pricing includes applicable GST where displayed at checkout and on your booking summary / invoice.",
    ],
  },
  {
    title: "Booking confirmation & payments",
    body: [
      "You may pay either an advance to confirm the booking or the full amount upfront, as selected at checkout.",
      "A booking is treated as confirmed by the platform only after the required advance (or full payment, if chosen) is successfully received.",
      "Any balance due must be paid in full before the scheduled trip start time. Operators may refuse service if the balance is unpaid.",
    ],
  },
  {
    title: "Cancellations by you (customer)",
    body: [
      "Cancellation requests should be made as early as possible through your account or by contacting support using the phone / WhatsApp or email on our Contact page.",
      "Whether a cancellation fee applies, and the amount, depends on how close the cancellation is to the trip date and what the operator has already committed (vehicle blocking, permits, crew).",
      "If you cancel after the booking is confirmed and the operator incurs costs, a partial or full retention of amounts paid may apply in line with the operator’s commitment and platform rules.",
    ],
  },
  {
    title: "Refunds",
    body: [
      "Refunds, when applicable, are processed back to the original payment method or as platform credit, subject to payment partner timelines (typically several business days).",
      "GST collected and reported per law is handled as per applicable invoicing; any refund of tax components follows statutory and gateway rules.",
      "The platform or admin may record manual adjustments for exceptional cases (e.g. operator no-show verified by support).",
    ],
  },
  {
    title: "Operator cancellation or service failure",
    body: [
      "If the assigned operator cancels or cannot perform the service, we will work to offer an alternative operator where possible.",
      "If no alternative is acceptable, eligible amounts paid may be refunded or re-credited as determined by support after verification.",
    ],
  },
  {
    title: "No-shows & delays",
    body: [
      "Customer no-shows or late arrivals may be treated as service delivered; refunds are generally not applicable unless otherwise agreed in writing.",
      "Delays caused by traffic, weather, or force majeure are outside the operator’s direct control; reschedule rules may apply.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about this policy: ${COMPANY.contactEmail} or ${COMPANY.contactPhoneDisplay} (WhatsApp same number).`,
    ],
  },
];

function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-neutral max-w-none">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Refund &amp; cancellation policy</h1>
          <p className="text-sm text-muted-foreground mb-10 not-prose">
            {COMPANY.legalName} · Last updated April 2026
          </p>
          {SECTIONS.map((sec) => (
            <section key={sec.title} className="mb-10 not-prose">
              <h2 className="text-xl font-semibold text-foreground mb-3">{sec.title}</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {sec.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="text-sm not-prose pt-4">
            <Link to="/book" className="text-primary hover:underline">
              Back to booking
            </Link>
            {" · "}
            <Link to="/" className="text-primary hover:underline">
              Home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
