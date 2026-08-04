import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type Offer = {
  id: string;
  title: string;
  type: string;
  code?: string;
  description?: string;
  href?: string;
  banner?: { url?: string; alt?: string };
  discountType?: string;
  discountValue?: number;
};

export function OffersSection() {
  const { data } = useQuery({
    queryKey: ["public-offers"],
    queryFn: () => api<{ offers: Offer[] }>("/api/public/offers"),
    staleTime: 60_000,
  });
  const offers = (data?.offers ?? []).filter((o) => o.type === "banner" || o.type === "coupon").slice(0, 6);
  if (!offers.length) return null;

  return (
    <section className="border-y border-border bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Offers & savings</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Limited-time banners and coupon codes for corporate and personal travel.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <a
              key={o.id}
              href={o.href?.startsWith("/") ? o.href : "/book"}
              className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40"
            >
              {o.banner?.url ? (
                <img src={o.banner.url} alt={o.banner.alt || o.title} className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/15 to-transparent">
                  <span className="font-display text-lg font-semibold text-primary">
                    {o.type === "coupon" && o.code ? o.code : o.title}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-foreground group-hover:text-primary">{o.title}</h3>
                {o.description ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{o.description}</p> : null}
                {o.type === "coupon" ? (
                  <p className="mt-2 text-xs font-medium text-primary">
                    Code {o.code}
                    {o.discountType === "percent" ? ` · ${o.discountValue}% off` : o.discountType === "flat" ? ` · ₹${o.discountValue} off` : ""}
                  </p>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
