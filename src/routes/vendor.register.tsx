import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  CheckCircle2,
  FileUp,
  Bus,
  Shield,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import { setAuth, getToken, type StoredUser } from "@/lib/auth-storage";
import { fetchVehicleTypes } from "@/lib/api/content";
import { VEHICLE_TYPE_FALLBACK } from "@/data/vehicle-types";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vendor/register")({
  component: VendorRegisterPage,
  head: () => ({
    meta: [
      { title: "Vendor Registration — Luxury Bus Rental" },
      {
        name: "description",
        content: "Join India's corporate transportation marketplace. Register your fleet in minutes.",
      },
    ],
  }),
});

const BUSINESS_TYPES = [
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "private_limited", label: "Private Limited Company" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "public_limited", label: "Public Limited Company" },
  { value: "opc", label: "One Person Company (OPC)" },
  { value: "other", label: "Other" },
];

const DOC_TYPES = [
  { key: "aadhar", label: "Aadhar" },
  { key: "pan", label: "PAN" },
  { key: "gst", label: "GST Certificate" },
  { key: "drivingLicense", label: "Driving License" },
  { key: "rc", label: "RC" },
  { key: "insurance", label: "Insurance" },
  { key: "businessProof", label: "Business Proof" },
  { key: "cancelledCheque", label: "Cancelled Cheque" },
] as const;

const FLEET_PRESETS = [
  "luxury-bus",
  "tempo-traveller",
  "urbania",
  "cab",
  "suv",
  "sedan",
  "mini-bus",
  "luxury-coach",
];

const STEPS = [
  { n: 1, label: "Account & Contact" },
  { n: 2, label: "Business Address" },
  { n: 3, label: "Documents" },
  { n: 4, label: "Fleet Details" },
];

type RegRes = { token: string; user: StoredUser; vendor?: { registrationStep: number } };

function VendorRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const otpChannel = "email" as const;
  const [otpCode, setOtpCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [f, setF] = useState({
    companyName: "",
    businessType: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [fleetForm, setFleetForm] = useState({
    vehicleTypeSlug: "luxury-bus",
    registrationNumber: "",
    model: "",
    seats: "",
    ac: true,
    fuelType: "diesel",
    transmission: "manual",
    pricingPerDay: "",
    pricingPerKm: "",
    amenities: "AC, Music System, Charging Points",
  });

  const vehicleTypesQ = useQuery({
    queryKey: ["vendor-reg-vehicle-types"],
    queryFn: () => fetchVehicleTypes(),
  });
  const vehicleOptions = useMemo(() => {
    const all = vehicleTypesQ.data?.length ? vehicleTypesQ.data : [...VEHICLE_TYPE_FALLBACK];
    const preferred = FLEET_PRESETS.map((slug) => all.find((v) => v.slug === slug)).filter(Boolean);
    return (preferred.length ? preferred : all) as typeof VEHICLE_TYPE_FALLBACK;
  }, [vehicleTypesQ.data]);

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const sendOtpMut = useMutation({
    mutationFn: () =>
      api<{ ok: boolean; devCode?: string }>("/api/auth/otp/send", {
        method: "POST",
        body: JSON.stringify({
          channel: "email",
          target: f.email,
          purpose: "vendor_register",
        }),
      }),
    onSuccess: (data) => {
      setOtpSent(true);
      setOtpVerified(false);
      if (data.devCode) {
        setDevCode(data.devCode);
        setOtpCode(data.devCode);
      }
      toast.success("OTP sent to your email");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const verifyOtpMut = useMutation({
    mutationFn: () =>
      api("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({
          channel: "email",
          target: f.email,
          code: otpCode,
          purpose: "vendor_register",
        }),
      }),
    onSuccess: () => {
      setOtpVerified(true);
      toast.success("OTP verified");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const registerMut = useMutation({
    mutationFn: () =>
      api<RegRes>("/api/auth/vendor/register", {
        method: "POST",
        body: JSON.stringify({
          companyName: f.companyName,
          businessType: f.businessType,
          name: f.ownerName,
          ownerName: f.ownerName,
          email: f.email,
          phone: f.phone,
          password: f.password,
          otpChannel,
        }),
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success("Account created — continue onboarding");
      setStep(2);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addressMut = useMutation({
    mutationFn: () =>
      api("/api/vendor/onboarding/address", {
        method: "PATCH",
        body: JSON.stringify({
          gstNumber: f.gstNumber,
          panNumber: f.panNumber,
          address: f.address,
          city: f.city,
          state: f.state,
          pin: f.pin,
          operatingCities: f.city,
        }),
      }),
    onSuccess: () => {
      toast.success("Address saved");
      setStep(3);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const uploadDocMut = useMutation({
    mutationFn: async ({ key, file }: { key: string; file: File }) => {
      const fd = new FormData();
      fd.append("file", file);
      return api(`/api/vendor/onboarding/documents/${key}`, { method: "POST", body: fd });
    },
    onSuccess: () => toast.success("Document uploaded"),
    onError: (e: Error) => toast.error(e.message),
  });

  const fleetMut = useMutation({
    mutationFn: () =>
      api("/api/vendor/buses", {
        method: "POST",
        body: JSON.stringify({
          vehicleTypeSlug: fleetForm.vehicleTypeSlug,
          registrationNumber: fleetForm.registrationNumber,
          model: fleetForm.model,
          seats: Number(fleetForm.seats) || 12,
          ac: fleetForm.ac,
          fuelType: fleetForm.fuelType,
          transmission: fleetForm.transmission,
          pricingPerDay: Number(fleetForm.pricingPerDay) || 0,
          pricingPerKm: Number(fleetForm.pricingPerKm) || 0,
          amenities: fleetForm.amenities,
          name: vehicleOptions.find((v) => v.slug === fleetForm.vehicleTypeSlug)?.name,
        }),
      }),
    onSuccess: async () => {
      await api("/api/vendor/onboarding/complete", { method: "POST", body: "{}" });
      toast.success("Application submitted for verification");
      navigate({ to: "/vendor/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const skipFleet = async () => {
    try {
      if (!getToken()) throw new Error("Please complete step 1 first");
      await api("/api/vendor/onboarding/complete", { method: "POST", body: "{}" });
      toast.success("You can add fleet later from the dashboard");
      navigate({ to: "/vendor/dashboard" });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const canContinueStep1 =
    f.companyName &&
    f.ownerName &&
    f.email &&
    f.phone.length >= 10 &&
    f.password.length >= 8 &&
    f.password === confirmPassword &&
    otpVerified;

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(241,180,36,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(56,120,255,0.12),_transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            {COMPANY.platformBrand}
          </Link>
          <Link to="/login" search={{ role: "vendor" } as never} className="text-sm text-white/70 hover:text-amber-300">
            Already a vendor? Login
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-start">
          <section className="space-y-6 lg:sticky lg:top-8">
            <p className="text-amber-300 text-sm font-medium">Free to join — Verified operators only</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Turn your fleet into a{" "}
              <span className="text-amber-300">revenue machine</span>
            </h1>
            <p className="text-white/70 text-base max-w-lg">
              Join {COMPANY.legalName}&apos;s corporate transportation marketplace. Set up your profile in minutes and
              start receiving leads after verification.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                "Earn with corporate contracts",
                "Pan-India customer demand",
                "Get bookings after verification",
                "Transparent payouts",
              ].map((t) => (
                <div key={t} className="flex gap-2 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 max-w-md">
              <p className="text-sm font-semibold mb-3">How it works</p>
              <ol className="space-y-2 text-sm text-white/70">
                <li>01 — Basic info + OTP verification</li>
                <li>02 — Business address & tax details</li>
                <li>03 — Upload KYC documents</li>
                <li>04 — Add fleet & go live after approval</li>
              </ol>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121a2b]/95 backdrop-blur shadow-2xl p-5 sm:p-7">
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className={cn(
                    "flex-1 min-w-[4.5rem] rounded-lg px-2 py-2 text-center border",
                    step === s.n
                      ? "bg-amber-400 text-neutral-950 border-amber-300"
                      : step > s.n
                        ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
                        : "bg-white/5 border-white/10 text-white/50",
                  )}
                >
                  <p className="text-[10px] uppercase tracking-wide">Step {s.n}</p>
                  <p className="text-xs font-semibold leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white/80">Business Name *</Label>
                  <Input className="mt-1 bg-white/5 border-white/15" value={f.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Your transport company" />
                </div>
                <div>
                  <Label className="text-white/80">Business Type</Label>
                  <Select value={f.businessType} onValueChange={(v) => set("businessType", v)}>
                    <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white">
                      <SelectValue placeholder="Select (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/80">Owner / Contact Name *</Label>
                  <Input className="mt-1 bg-white/5 border-white/15" value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/80">Business Email *</Label>
                    <Input type="email" className="mt-1 bg-white/5 border-white/15" value={f.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-white/80">Mobile Number *</Label>
                    <div className="mt-1 flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/15 bg-white/10 text-sm">+91</span>
                      <Input className="rounded-l-none bg-white/5 border-white/15" value={f.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/80">Password *</Label>
                    <Input type="password" className="mt-1 bg-white/5 border-white/15" value={f.password} onChange={(e) => set("password", e.target.value)} minLength={8} />
                  </div>
                  <div>
                    <Label className="text-white/80">Confirm Password *</Label>
                    <Input type="password" className="mt-1 bg-white/5 border-white/15" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-300" /> Email OTP Verification *
                    </p>
                    <p className="text-xs text-white/50">Sent via SMTP to your email</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="border-white/20 bg-transparent" disabled={sendOtpMut.isPending || !f.email} onClick={() => sendOtpMut.mutate()}>
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </Button>
                    {otpVerified && <span className="text-emerald-300 text-sm self-center flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Verified</span>}
                  </div>
                  {otpSent && !otpVerified && (
                    <div className="flex gap-2">
                      <Input className="bg-white/5 border-white/15 tracking-widest" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 6-digit OTP" />
                      <Button type="button" onClick={() => verifyOtpMut.mutate()} disabled={otpCode.length < 4 || verifyOtpMut.isPending}>Verify</Button>
                    </div>
                  )}
                  {devCode && !otpVerified && <p className="text-xs text-amber-200/80">Dev OTP: {devCode}</p>}
                </div>

                <Button className="w-full gap-2 bg-amber-400 text-neutral-950 hover:bg-amber-300" disabled={!canContinueStep1 || registerMut.isPending} onClick={() => registerMut.mutate()}>
                  Next Step for Becoming a Vendor <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-[11px] text-white/50 text-center">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-300" /> Business Address</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/80">GST Number</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={f.gstNumber} onChange={(e) => set("gstNumber", e.target.value.toUpperCase())} />
                  </div>
                  <div>
                    <Label className="text-white/80">PAN Number *</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={f.panNumber} onChange={(e) => set("panNumber", e.target.value.toUpperCase())} />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80">Address *</Label>
                  <Textarea className="mt-1 bg-white/5 border-white/15" value={f.address} onChange={(e) => set("address", e.target.value)} rows={3} />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-white/80">City *</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={f.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-white/80">State *</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={f.state} onChange={(e) => set("state", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-white/80">PIN *</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={f.pin} onChange={(e) => set("pin", e.target.value.replace(/\D/g, "").slice(0, 6))} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="border-white/20 bg-transparent" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button className="flex-1 bg-amber-400 text-neutral-950 hover:bg-amber-300" disabled={!f.address || !f.city || !f.state || !f.pin || addressMut.isPending} onClick={() => addressMut.mutate()}>
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><FileUp className="w-4 h-4 text-amber-300" /> Upload Documents</h2>
                <p className="text-sm text-white/60">Upload clear scans (PDF/JPG/PNG, max 10MB). Admin will verify each document.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {DOC_TYPES.map((d) => (
                    <label key={d.key} className="rounded-xl border border-dashed border-white/20 p-3 hover:border-amber-300/50 cursor-pointer block">
                      <p className="text-sm font-medium mb-2">{d.label}</p>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        className="bg-transparent border-0 p-0 text-xs file:mr-2 file:rounded file:border-0 file:bg-amber-400 file:text-neutral-950 file:px-2 file:py-1"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadDocMut.mutate({ key: d.key, file });
                        }}
                      />
                    </label>
                  ))}
                  <label className="rounded-xl border border-dashed border-white/20 p-3 hover:border-amber-300/50 cursor-pointer block sm:col-span-2">
                    <p className="text-sm font-medium mb-2">Vehicle Images</p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-transparent border-0 p-0 text-xs file:mr-2 file:rounded file:border-0 file:bg-amber-400 file:text-neutral-950 file:px-2 file:py-1"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadDocMut.mutate({ key: "vehicleImages", file });
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="border-white/20 bg-transparent" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button className="flex-1 bg-amber-400 text-neutral-950 hover:bg-amber-300" onClick={() => setStep(4)}>
                    Continue to Fleet <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><Bus className="w-4 h-4 text-amber-300" /> Add your first vehicle</h2>
                <div>
                  <Label className="text-white/80">Vehicle type</Label>
                  <Select value={fleetForm.vehicleTypeSlug} onValueChange={(v) => setFleetForm((p) => ({ ...p, vehicleTypeSlug: v }))}>
                    <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleOptions.map((v) => (
                        <SelectItem key={v.slug} value={v.slug}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/80">Registration No. *</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={fleetForm.registrationNumber} onChange={(e) => setFleetForm((p) => ({ ...p, registrationNumber: e.target.value.toUpperCase() }))} />
                  </div>
                  <div>
                    <Label className="text-white/80">Model</Label>
                    <Input className="mt-1 bg-white/5 border-white/15" value={fleetForm.model} onChange={(e) => setFleetForm((p) => ({ ...p, model: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-white/80">Capacity (seats) *</Label>
                    <Input type="number" className="mt-1 bg-white/5 border-white/15" value={fleetForm.seats} onChange={(e) => setFleetForm((p) => ({ ...p, seats: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-white/80">Fuel</Label>
                    <Select value={fleetForm.fuelType} onValueChange={(v) => setFleetForm((p) => ({ ...p, fuelType: v }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["diesel", "petrol", "cng", "electric", "hybrid"].map((x) => (
                          <SelectItem key={x} value={x}>{x}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/80">Transmission</Label>
                    <Select value={fleetForm.transmission} onValueChange={(v) => setFleetForm((p) => ({ ...p, transmission: v }))}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/80">₹ / day</Label>
                    <Input type="number" className="mt-1 bg-white/5 border-white/15" value={fleetForm.pricingPerDay} onChange={(e) => setFleetForm((p) => ({ ...p, pricingPerDay: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-white/80">₹ / km</Label>
                    <Input type="number" className="mt-1 bg-white/5 border-white/15" value={fleetForm.pricingPerKm} onChange={(e) => setFleetForm((p) => ({ ...p, pricingPerKm: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80">Amenities (comma separated)</Label>
                  <Input className="mt-1 bg-white/5 border-white/15" value={fleetForm.amenities} onChange={(e) => setFleetForm((p) => ({ ...p, amenities: e.target.value }))} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={fleetForm.ac} onChange={(e) => setFleetForm((p) => ({ ...p, ac: e.target.checked }))} />
                  AC vehicle
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" className="border-white/20 bg-transparent" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button type="button" variant="outline" className="border-white/20 bg-transparent" onClick={() => void skipFleet()}>
                    Skip for now
                  </Button>
                  <Button
                    className="flex-1 bg-amber-400 text-neutral-950 hover:bg-amber-300"
                    disabled={!fleetForm.registrationNumber || !fleetForm.seats || fleetMut.isPending}
                    onClick={() => fleetMut.mutate()}
                  >
                    Submit Application <Building2 className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            <p className="mt-6 text-[11px] text-white/40 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> SSL Secured · Your documents stay private
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
