import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { buildPageMeta } from "@/lib/seo/buildMeta";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    buildPageMeta({
      title: `Contact Us | Book Tempo Traveller & Bus Rental — ${COMPANY.legalName}`,
      description: `Contact ${COMPANY.legalName} to book tempo traveller on rent, luxury bus hire or get a free bus rental quote. Call, WhatsApp or email for the best bus rental service in India.`,
      path: "/contact",
      keywords: "contact bus rental India, book tempo traveller online, bus hire enquiry, luxury bus rental contact, affordable bus hire India",
    }),
});

function ContactPage() {
  const wa = `https://wa.me/${COMPANY.whatsappE164}`;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Contact Us — Book Tempo Traveller &amp; Bus Rental</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Reach {COMPANY.legalName} for tempo traveller bookings, luxury bus rental quotes &amp; support. Serving all major cities in India.
          </p>
          <ul className="space-y-6">
            <li className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <a href={`tel:+91${COMPANY.contactPhone}`} className="text-primary hover:underline">
                  {COMPANY.contactPhoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <Phone className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">WhatsApp</p>
                <a href={wa} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Chat on WhatsApp ({COMPANY.contactPhoneDisplay})
                </a>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                <a href={`mailto:${COMPANY.contactEmail}`} className="text-primary hover:underline">
                  {COMPANY.contactEmail}
                </a>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Service areas</p>
                <p className="text-muted-foreground">{COMPANY.operatingLocations}</p>
              </div>
            </li>
          </ul>

          <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Get Best Bus Rental Quote Now</p>
              <p className="text-sm text-muted-foreground mt-1">Book tempo traveller on rent or luxury bus hire online — operators respond with affordable, GST-clear pricing.</p>
            </div>
            <Link to="/book" className="shrink-0">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Get bus quotes <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
