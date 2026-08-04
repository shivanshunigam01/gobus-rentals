import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Bot, Bus, Calendar, CheckCircle2, MapPin, Users } from "lucide-react";
import { api } from "@/lib/api";
import { COMPANY } from "@/lib/company";
import { BOOKING_BUS_TYPES } from "@/data/booking-bus-types";
import { fetchVehicleTypes } from "@/lib/api/content";

const purposes = ["Wedding", "Corporate", "Tour", "School/College", "Pilgrimage", "Airport Transfer", "Other"];

type StepKey =
  | "pickup"
  | "drop"
  | "journeyDate"
  | "journeyTime"
  | "passengers"
  | "busType"
  | "acPreference"
  | "purpose"
  | "contact"
  | "notes";

type FormState = {
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  returnDate: string;
  passengers: string;
  busType: string;
  acPreference: string;
  purpose: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  notes: string;
};

const steps: { key: StepKey; question: string; optional?: boolean }[] = [
  { key: "pickup", question: "Hi! I am Priya, your quote assistant. Where is your pickup city?" },
  { key: "drop", question: "Great. Where should we drop your group?" },
  { key: "journeyDate", question: "When is your journey date?" },
  { key: "journeyTime", question: "What is your preferred pickup time?" },
  { key: "passengers", question: "How many passengers are travelling?" },
  { key: "busType", question: "Which bus type do you prefer?" },
  { key: "acPreference", question: "Do you need AC, Non-AC, or any option?" },
  { key: "purpose", question: "What is the purpose of this trip?" },
  { key: "contact", question: "Please share your name and mobile number so operators can send quotes." },
  { key: "notes", question: "Any special instructions for the trip?", optional: true },
];

const validators: Record<StepKey, (form: FormState) => string | null> = {
  pickup: (form) => (form.pickup.trim() ? null : "Please enter pickup location."),
  drop: (form) => (form.drop.trim() ? null : "Please enter drop location."),
  journeyDate: (form) => (form.journeyDate ? null : "Please select journey date."),
  journeyTime: (form) => (form.journeyTime ? null : "Please select journey time."),
  passengers: (form) => {
    const n = Number(form.passengers);
    return form.passengers && !Number.isNaN(n) && n > 0 ? null : "Please enter valid passenger count.";
  },
  busType: (form) => (form.busType ? null : "Please select bus type."),
  acPreference: (form) => (form.acPreference ? null : "Please select AC preference."),
  purpose: (form) => (form.purpose ? null : "Please select trip purpose."),
  contact: (form) => {
    if (!form.guestName.trim()) return "Please enter your name.";
    return form.guestPhone.trim() ? null : "Please enter your mobile number.";
  },
  notes: () => null,
};

function validateStep(step: StepKey, form: FormState): string | null {
  return validators[step](form);
}

const answerRenderers: Record<StepKey, (form: FormState) => string> = {
  pickup: (form) => form.pickup,
  drop: (form) => form.drop,
  journeyDate: (form) => form.journeyDate,
  journeyTime: (form) => form.journeyTime,
  passengers: (form) => `${form.passengers} passenger(s)`,
  busType: (form) => form.busType,
  acPreference: (form) => form.acPreference.toUpperCase(),
  purpose: (form) => form.purpose,
  contact: (form) => `${form.guestName} · ${form.guestPhone}`,
  notes: (form) => form.notes.trim() || "No special notes",
};

function answerPreview(step: StepKey, form: FormState): string {
  return answerRenderers[step](form);
}

function StepInput({
  step,
  form,
  setForm,
  vehicleTypes = [],
}: Readonly<{
  step: StepKey;
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  vehicleTypes?: string[];
}>) {
  const optionBtn =
    "rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-primary/10 hover:border-primary/40 transition-colors";

  switch (step) {
    case "pickup":
      return (
        <Input
          placeholder="e.g. Chandigarh"
          value={form.pickup}
          onChange={(e) => setForm((f) => ({ ...f, pickup: e.target.value }))}
        />
      );
    case "drop":
      return (
        <Input
          placeholder="e.g. Delhi"
          value={form.drop}
          onChange={(e) => setForm((f) => ({ ...f, drop: e.target.value }))}
        />
      );
    case "journeyDate":
      return <Input type="date" value={form.journeyDate} onChange={(e) => setForm((f) => ({ ...f, journeyDate: e.target.value }))} />;
    case "journeyTime":
      return <Input type="time" value={form.journeyTime} onChange={(e) => setForm((f) => ({ ...f, journeyTime: e.target.value }))} />;
    case "passengers":
      return (
        <Input
          type="number"
          min={1}
          max={200}
          placeholder="e.g. 35"
          value={form.passengers}
          onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value }))}
        />
      );
    case "busType":
      return (
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {(vehicleTypes.length ? vehicleTypes : BOOKING_BUS_TYPES).map((t) => (
            <button
              key={t}
              type="button"
              className={`${optionBtn} ${form.busType === t ? "bg-primary text-primary-foreground border-primary" : ""}`}
              onClick={() => setForm((f) => ({ ...f, busType: t }))}
            >
              {t}
            </button>
          ))}
        </div>
      );
    case "acPreference":
      return (
        <div className="flex flex-wrap gap-2">
          {[
            { value: "ac", label: "AC" },
            { value: "non-ac", label: "Non-AC" },
            { value: "any", label: "No Preference" },
          ].map((o) => (
            <button
              key={o.value}
              type="button"
              className={`${optionBtn} ${form.acPreference === o.value ? "bg-primary text-primary-foreground border-primary" : ""}`}
              onClick={() => setForm((f) => ({ ...f, acPreference: o.value }))}
            >
              {o.label}
            </button>
          ))}
        </div>
      );
    case "purpose":
      return (
        <div className="flex flex-wrap gap-2">
          {purposes.map((p) => (
            <button
              key={p}
              type="button"
              className={`${optionBtn} ${form.purpose === p ? "bg-primary text-primary-foreground border-primary" : ""}`}
              onClick={() => setForm((f) => ({ ...f, purpose: p }))}
            >
              {p}
            </button>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="space-y-3">
          <Input
            placeholder="Your full name"
            value={form.guestName}
            onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
          />
          <Input
            type="tel"
            placeholder="Mobile number"
            value={form.guestPhone}
            onChange={(e) => setForm((f) => ({ ...f, guestPhone: e.target.value }))}
          />
          <Input
            type="email"
            placeholder="Email (optional)"
            value={form.guestEmail}
            onChange={(e) => setForm((f) => ({ ...f, guestEmail: e.target.value }))}
          />
        </div>
      );
    case "notes":
      return (
        <div className="space-y-3">
          <Textarea
            rows={3}
            placeholder="Any special request? Luggage, pickup points, etc."
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <Input
            type="date"
            value={form.returnDate}
            onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))}
            placeholder="Return date (optional)"
          />
          <p className="text-xs text-muted-foreground">Return date is optional.</p>
        </div>
      );
    default:
      return null;
  }
}

export function BookingForm({
  compact = false,
  initialBusType,
}: Readonly<{ compact?: boolean; initialBusType?: string }>) {
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const vehicleTypesQ = useQuery({
    queryKey: ["booking-vehicle-types"],
    queryFn: () => fetchVehicleTypes(),
  });
  const vehicleTypeNames = useMemo(
    () => (vehicleTypesQ.data?.length ? vehicleTypesQ.data.map((v) => v.name) : [...BOOKING_BUS_TYPES]),
    [vehicleTypesQ.data],
  );
  const prefilledBusType =
    initialBusType && vehicleTypeNames.some((t) => t.toLowerCase() === initialBusType.toLowerCase())
      ? vehicleTypeNames.find((t) => t.toLowerCase() === initialBusType.toLowerCase()) || initialBusType
      : initialBusType && (BOOKING_BUS_TYPES as readonly string[]).includes(initialBusType)
        ? initialBusType
        : "";
  const [form, setForm] = useState<FormState>({
    pickup: "",
    drop: "",
    journeyDate: "",
    journeyTime: "",
    returnDate: "",
    passengers: "",
    busType: prefilledBusType,
    acPreference: "",
    purpose: "",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    notes: "",
  });

  const current = steps[activeStep];
  const doneSteps = useMemo(
    () => steps.slice(0, activeStep).filter((s) => validateStep(s.key, form) === null),
    [activeStep, form],
  );

  const mut = useMutation({
    mutationFn: () =>
      api<{ notifiedVendors?: number }>("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          pickup: form.pickup,
          drop: form.drop,
          journeyDate: form.journeyDate,
          journeyTime: form.journeyTime,
          returnDate: form.returnDate || undefined,
          passengers: Number(form.passengers),
          busType: form.busType,
          acPreference: form.acPreference,
          purpose: form.purpose,
          notes: form.notes,
          guestName: form.guestName,
          guestPhone: form.guestPhone,
          guestEmail: form.guestEmail || undefined,
        }),
      }),
    onSuccess: (data) => {
      setSubmitted(true);
      if (data.notifiedVendors == null) {
        toast.success("Requirement submitted.");
      } else {
        toast.success(`Submitted — ${data.notifiedVendors} active operator(s) can respond.`);
      }
    },
    onError: (e: Error) => toast.error(e.message || "Could not submit"),
  });

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl shadow-xl border border-border ring-1 ring-primary/10 p-10 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bus className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Requirement Submitted!
        </h2>
        <p className="text-muted-foreground mb-6">
          Awesome. Partner operators will now send their best quotes on your trip route.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" size="lg">
          Submit Another Request
        </Button>
      </div>
    );
  }

  const goNext = () => {
    const err = validateStep(current.key, form);
    if (err) {
      toast.error(err);
      return;
    }
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  return (
    <section className="bg-card rounded-2xl shadow-xl border border-border ring-1 ring-primary/10 overflow-hidden">
      <div className={`p-4 sm:p-6 ${compact ? "space-y-4" : "space-y-5"}`}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Step {activeStep + 1} of {steps.length}
          </span>
          <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% complete</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3 max-h-56 overflow-y-auto rounded-xl border border-border bg-muted/20 p-3">
          {doneSteps.length === 0 ? (
            <p className="text-xs text-muted-foreground">Your chat summary will appear here as you answer.</p>
          ) : (
            doneSteps.map((s) => (
              <div key={s.key} className="space-y-1">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex flex-col items-center gap-0.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-semibold text-primary leading-none">Priya</span>
                  </div>
                  <p className="text-sm text-foreground/90">{s.question}</p>
                </div>
                <div className="flex items-start gap-2 justify-end">
                  <p className="text-sm bg-primary text-primary-foreground rounded-lg px-3 py-1.5 max-w-[85%]">
                    {answerPreview(s.key, form)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-xl border border-border p-4 sm:p-5 bg-background space-y-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-primary leading-none">Priya</span>
            </div>
            <div>
              <p className="font-medium text-foreground">{current.question}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Select an option or type your answer below.</p>
            </div>
          </div>

          <StepInput step={current.key} form={form} setForm={setForm} vehicleTypes={vehicleTypeNames} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={goBack} disabled={activeStep === 0}>
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button type="button" onClick={goNext} className="gap-2">
              Next question
            </Button>
          ) : (
            <Button
              type="button"
              size={compact ? "default" : "lg"}
              disabled={mut.isPending}
              className="gap-2"
              onClick={() => {
                const err = validateStep(current.key, form);
                if (err) {
                  toast.error(err);
                  return;
                }
                mut.mutate();
              }}
            >
              {mut.isPending ? "Submitting..." : "Get Free Quotes"}
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Route-based matching
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Fast step flow
          </p>
          <p className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Verified operators
          </p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          By submitting, you agree to our Terms and{" "}
          <Link to="/policies/refund-cancellation" className="text-primary underline-offset-2 hover:underline">
            refund &amp; cancellation policy
          </Link>
          . Quotes show rental + {COMPANY.gstPercentage}% GST at checkout. {COMPANY.serviceBillingTagline}
        </p>
      </div>
    </section>
  );
}
