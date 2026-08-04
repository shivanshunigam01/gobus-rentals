import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { setAuth, type StoredUser } from "@/lib/auth-storage";
import { buildPageMeta } from "@/lib/seo/buildMeta";

export const Route = createFileRoute("/b2b/register")({
  component: B2BRegister,
  head: () =>
    buildPageMeta({
      title: "B2B Corporate Registration",
      description: "Register your company for corporate bus hire and employee transportation.",
      path: "/b2b/register",
    }),
});

type RegRes = { token: string; user: StoredUser; company: { id: string; status: string } };

function B2BRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState({
    companyName: "",
    gstin: "",
    pan: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    companyPhone: "",
    companyEmail: "",
    employeeCount: "",
  });
  const [contact, setContact] = useState({
    contactName: "",
    email: "",
    phone: "",
    password: "",
  });

  const mut = useMutation({
    mutationFn: () =>
      api<RegRes>("/api/auth/b2b/register", {
        method: "POST",
        body: JSON.stringify({
          ...company,
          ...contact,
          employeeCount: Number(company.employeeCount) || 0,
          companyEmail: company.companyEmail || contact.email,
          companyPhone: company.companyPhone || contact.phone,
        }),
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success(
        data.company?.status === "pending"
          ? "Registered — pending admin approval"
          : "Corporate account created",
      );
      navigate({ to: "/b2b/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-28">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">B2B Registration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Corporate travel portal — company details, then primary contact
          </p>
          <div className="mt-4 flex justify-center gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1. Company
            </span>
            <span className={`rounded-full px-3 py-1 ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2. Contact
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> Company details
              </div>
              {(
                [
                  ["companyName", "Company name *"],
                  ["gstin", "GSTIN"],
                  ["pan", "PAN"],
                  ["businessType", "Business type"],
                  ["address", "Address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pin", "PIN"],
                  ["companyPhone", "Company phone"],
                  ["companyEmail", "Company email"],
                  ["employeeCount", "Employee count"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    value={company[key]}
                    onChange={(e) => setCompany((c) => ({ ...c, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <Button
                type="button"
                className="w-full gap-2"
                onClick={() => {
                  if (company.companyName.trim().length < 2) {
                    toast.error("Company name is required");
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                mut.mutate();
              }}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-primary" /> Primary contact
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactName">Full name *</Label>
                <Input
                  id="contactName"
                  required
                  value={contact.contactName}
                  onChange={(e) => setContact((c) => ({ ...c, contactName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  required
                  minLength={10}
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={contact.password}
                  onChange={(e) => setContact((c) => ({ ...c, password: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="gap-2" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="flex-1" disabled={mut.isPending}>
                  {mut.isPending ? "Submitting…" : "Create corporate account"}
                </Button>
              </div>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" search={{ role: "b2b" }} className="text-primary underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
