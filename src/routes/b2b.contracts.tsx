import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/b2b/contracts")({
  component: B2BContracts,
});

function B2BContracts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["b2b-contracts"],
    queryFn: () =>
      api<{
        contracts: Array<{
          id: string;
          title: string;
          discountPercent: number;
          paymentTermsDays: number;
          status: string;
          pricingRules: Array<{ vehicleTypeSlug: string; ratePerKm: number; ratePerDay: number }>;
        }>;
      }>("/api/b2b/contracts"),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Contracts</h1>
      <p className="text-muted-foreground text-sm mb-6">Active corporate pricing agreements</p>
      <div className="space-y-4">
        {(data?.contracts ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No contracts assigned yet.</p>
        ) : (
          data!.contracts.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="font-display font-semibold">{c.title}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{c.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discount {c.discountPercent}% · Payment terms {c.paymentTermsDays} days
              </p>
              {(c.pricingRules || []).length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {c.pricingRules.map((r) => (
                    <li key={r.vehicleTypeSlug}>
                      {r.vehicleTypeSlug}: ₹{r.ratePerKm}/km · ₹{r.ratePerDay}/day
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
