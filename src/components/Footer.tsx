import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/company";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
function whatsappChatHref() {
  const text = encodeURIComponent(
    `Hi ${COMPANY.platformBrand}, I'd like to enquire about bus rental.`,
  );
  return `https://wa.me/${COMPANY.whatsappE164}?text=${text}`;
}

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10">
          <div>
            <img
              src="/images/logo.svg"
              alt={COMPANY.platformBrand}
              className="h-16 sm:h-[4.5rem] w-auto mb-4 object-contain object-left"
              width={884}
              height={458}
              decoding="async"
            />
            <p className="text-primary-foreground/70 text-sm leading-relaxed font-medium">
              {COMPANY.legalName}
            </p>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mt-2">
              {COMPANY.about.slice(0, 120)}…
            </p>
            <p className="text-primary-foreground/60 text-xs mt-3">
              Serving {COMPANY.operatingLocations}. GST{" "}
              {COMPANY.gstEnabled ? `${COMPANY.gstPercentage}%` : "exempt"} on
              bookings — see checkout & invoice.
            </p>
            <p className="text-primary-foreground/60 text-xs mt-2">{COMPANY.serviceBillingTagline}</p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Book a Bus
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/refund-cancellation"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Refund &amp; cancellation
                </Link>
              </li>
              <li>
                <a
                  href="#fleet"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Our Fleet
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-primary-foreground transition-colors"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              Portal Access
            </h4>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/vendor/login"
                className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm hover:bg-primary-foreground/20 transition-colors"
              >
                Vendor Login
              </Link>

              <Link
                to="/agent/login"
                className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm hover:bg-primary-foreground/20 transition-colors"
              >
                Agent Login
              </Link>

              <Link
                to="/admin/login"
                className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm hover:bg-primary-foreground/20 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              SEO &amp; guides
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/blog"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/bus-rental-guides"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/bus-types-for-hire"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Bus types
                </Link>
              </li>
              <li>
                <Link
                  to="/bus-rental"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Bus rental — cities hub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              Bus Types
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>12 Seater Mini Bus</li>
              <li>26 Seater AC Bus</li>
              <li>40 Seater Luxury Bus</li>
              <li>49/52 Seater Coach</li>
              <li>Sleeper Bus</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href={`tel:+91${COMPANY.contactPhone}`}
                  className="hover:text-primary-foreground"
                >
                  {COMPANY.contactPhoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappChatHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#20bd5a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 shrink-0"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href={`mailto:${COMPANY.contactEmail}`}
                  className="hover:text-primary-foreground"
                >
                  {COMPANY.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{COMPANY.operatingLocations}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
            <Link
              to="/policies/refund-cancellation"
              className="hover:text-primary-foreground transition-colors"
            >
              Refund &amp; cancellation
            </Link>
            <button
              type="button"
              className="hover:text-primary-foreground transition-colors"
              onClick={() => setPrivacyOpen(true)}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="hover:text-primary-foreground transition-colors"
              onClick={() => setTermsOpen(true)}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {COMPANY.legalName} collects trip and contact details to connect you
            with bus operators. We do not sell your personal data. Operators you
            choose may contact you about quotes and bookings.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Quotes and final transport agreements are between you and the
            selected operator. Cancellations and disputes follow our{" "}
            <Link to="/policies/refund-cancellation" className="underline">
              refund &amp; cancellation policy
            </Link>{" "}
            and your confirmed booking.
          </p>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
