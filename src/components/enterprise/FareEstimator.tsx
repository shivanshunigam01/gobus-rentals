import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

type FareRes = {
  route: { distanceKm: number; durationMinutes: number; distanceText: string; durationText: string; provider: string };
  estimate: { subtotal: number; gstAmount: number; total: number; breakdown: Record<string, number> };
};

export function FareEstimator() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [busType, setBusType] = useState("urbania");
  const [passengers, setPassengers] = useState("12");

  const mut = useMutation({
    mutationFn: () =>
      api<FareRes>("/api/public/maps/fare-estimate", {
        method: "POST",
        body: JSON.stringify({
          origin,
          destination,
          busType,
          passengers: Number(passengers) || 1,
          days: 1,
        }),
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  const r = mut.data;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Route & fare estimate</h2>
      <p className="mt-1 text-xs text-muted-foreground">Live distance + GST-inclusive estimate</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="fe-origin">Pickup</Label>
          <Input id="fe-origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Chandigarh" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fe-drop">Drop</Label>
          <Input id="fe-drop" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Shimla" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fe-bus">Vehicle</Label>
          <Input id="fe-bus" value={busType} onChange={(e) => setBusType(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fe-pax">Passengers</Label>
          <Input id="fe-pax" value={passengers} onChange={(e) => setPassengers(e.target.value)} />
        </div>
      </div>
      <Button
        type="button"
        className="mt-4"
        disabled={!origin || !destination || mut.isPending}
        onClick={() => mut.mutate()}
      >
        {mut.isPending ? "Calculating…" : "Estimate fare"}
      </Button>
      {r ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p>
            Distance: <strong>{r.route.distanceText}</strong> · Duration: <strong>{r.route.durationText}</strong>
          </p>
          <p className="mt-1">
            Subtotal ₹{r.estimate.subtotal.toLocaleString("en-IN")} + GST ₹{r.estimate.gstAmount.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 font-display text-base font-bold">
            Total ₹{r.estimate.total.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Provider: {r.route.provider}</p>
        </div>
      ) : null}
    </section>
  );
}
