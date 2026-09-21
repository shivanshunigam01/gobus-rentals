import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowBookingButton } from "@/components/motion/GlowBookingButton";
import { COMPANY } from "@/lib/company";

export function StickyLeadBar() {
  const wa = `https://wa.me/${COMPANY.whatsappE164}?text=${encodeURIComponent("Hi, I want the best bus rental quotes.")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden">
      <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2">
        <Link to="/book" className="flex-1">
          <GlowBookingButton size="sm" emoji="✨" className="w-full gap-1.5 font-semibold">
            Best bus quotes
          </GlowBookingButton>
        </Link>
        <a href={wa} target="_blank" rel="noreferrer" className="shrink-0">
          <Button size="sm" variant="outline" className="gap-1 px-3" aria-label="WhatsApp">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </a>
        <a href={`tel:+91${COMPANY.contactPhone}`} className="shrink-0">
          <Button size="sm" variant="secondary" className="gap-1 px-3" aria-label="Call">
            <Phone className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
