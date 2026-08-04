import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, ArrowRight, User, Bus, ShieldCheck, Eye, EyeOff, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import { setAuth, type StoredUser } from "@/lib/auth-storage";
import { buildPageMeta } from "@/lib/seo/buildMeta";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    role:
      search.role === "vendor" ||
      search.role === "admin" ||
      search.role === "customer" ||
      search.role === "b2b"
        ? search.role
        : undefined,
  }),
  component: LoginPage,
  head: () =>
    buildPageMeta({
      title: "Login",
      description: "Customer, vendor, B2B, and admin sign-in for Luxury Bus Rental.",
      path: "/login",
      noindex: true,
    }),
});

type LoginRes = { token: string; user: StoredUser };
type AccountRole = "customer" | "vendor" | "admin" | "b2b";
const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";
let googleScriptPromise: Promise<void> | null = null;
let googleInitializedClientId: string | null = null;

function ensureGoogleScript() {
  if (globalThis.window === undefined) return Promise.resolve();
  if ((globalThis.window as any).google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
    if (existing) {
      // If script is already loaded, resolve immediately instead of waiting on a past load event.
      if ((globalThis.window as any).google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity script")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity script"));
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

const roleLabels: Record<AccountRole, { title: string; description: string }> = {
  customer: { title: "Customer", description: "Book buses, quotes & trips" },
  vendor: { title: "Vendor", description: "Operators & fleet dashboard" },
  b2b: { title: "B2B", description: "Corporate travel portal" },
  admin: { title: "Admin", description: "Platform staff only" },
};

function LoginPage() {
  const navigate = useNavigate();
  const { role: roleFromUrl } = Route.useSearch();
  const [accountRole, setAccountRole] = useState<AccountRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [vendorCompanyName, setVendorCompanyName] = useState("");
  const [isGooglePrompting, setIsGooglePrompting] = useState(false);
  const googleClientId =
    typeof import.meta.env.VITE_GOOGLE_CLIENT_ID === "string" ? import.meta.env.VITE_GOOGLE_CLIENT_ID.trim() : "";

  useEffect(() => {
    return () => {
      const google = (globalThis.window as any)?.google;
      if (google?.accounts?.id && typeof google.accounts.id.cancel === "function") {
        try {
          google.accounts.id.cancel();
        } catch {
          // Ignore cleanup races from third-party widgets.
        }
      }
    };
  }, []);

  useEffect(() => {
    if (
      roleFromUrl === "vendor" ||
      roleFromUrl === "admin" ||
      roleFromUrl === "customer" ||
      roleFromUrl === "b2b"
    ) {
      setAccountRole(roleFromUrl);
    } else {
      setAccountRole("customer");
    }
  }, [roleFromUrl]);

  const setRoleInUrl = (role: AccountRole) => {
    navigate({
      to: "/login",
      search: { role },
      replace: true,
    });
  };

  const loginMut = useMutation({
    mutationFn: () =>
      api<LoginRes>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: (data) => {
      const role = data.user.role;
      if (accountRole === "customer") {
        if (role !== "customer") {
          toast.error("This account is not a customer. Choose Vendor or Admin above.");
          return;
        }
        setAuth(data.token, data.user);
        toast.success("Welcome back!");
        navigate({ to: "/customer/dashboard" });
        return;
      }
      if (accountRole === "vendor") {
        if (role !== "vendor") {
          toast.error("This account is not registered as a vendor.");
          return;
        }
        setAuth(data.token, data.user);
        toast.success("Vendor session started");
        navigate({ to: "/vendor/dashboard" });
        return;
      }
      if (accountRole === "b2b") {
        if (role !== "b2b") {
          toast.error("This account is not a B2B corporate account.");
          return;
        }
        setAuth(data.token, data.user);
        toast.success("Corporate session started");
        navigate({ to: "/b2b/dashboard" });
        return;
      }
      if (accountRole === "admin") {
        if (role !== "admin") {
          toast.error("Administrator access only. This email is not an admin.");
          return;
        }
        setAuth(data.token, data.user);
        toast.success("Admin session started");
        navigate({ to: "/admin/dashboard" });
      }
    },
    onError: (e: Error) => toast.error(e.message || "Login failed"),
  });
  const googleMut = useMutation({
    mutationFn: (idToken: string) =>
      api<LoginRes>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      }),
    onSuccess: (data) => {
      const role = data.user.role;
      if (accountRole === "customer" && role !== "customer") {
        toast.error("This Google account is not a customer account. Choose Vendor or Admin above.");
        return;
      }
      if (accountRole === "vendor" && role !== "vendor") {
        toast.error("This Google account is not registered as a vendor.");
        return;
      }
      if (accountRole === "admin" && role !== "admin") {
        toast.error("Administrator access only. This Google account is not an admin.");
        return;
      }
      setAuth(data.token, data.user);
      toast.success("Signed in with Google");
      if (role === "vendor") {
        navigate({ to: "/vendor/dashboard" });
        return;
      }
      if (role === "admin") {
        navigate({ to: "/admin/dashboard" });
        return;
      }
      navigate({ to: "/customer/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message || "Google login failed"),
  });
  const googleVendorRegisterMut = useMutation({
    mutationFn: ({ idToken, companyName }: { idToken: string; companyName: string }) =>
      api<LoginRes>("/api/auth/google/vendor/register", {
        method: "POST",
        body: JSON.stringify({ idToken, companyName }),
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success("Vendor account created with Google");
      navigate({ to: "/vendor/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message || "Vendor Google registration failed"),
  });
  const googleAdminRegisterMut = useMutation({
    mutationFn: (idToken: string) =>
      api<LoginRes>("/api/auth/google/admin/register", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success("Admin account created with Google");
      navigate({ to: "/admin/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message || "Admin Google registration failed"),
  });

  const handleGoogleLogin = async () => {
    if (!googleClientId) {
      toast.error("Missing VITE_GOOGLE_CLIENT_ID. Set it in local .env or Vercel Environment Variables.");
      return;
    }
    if (!import.meta.env.VITE_API_URL?.trim()) {
      toast.error("Missing VITE_API_URL. Set it in local .env or Vercel Environment Variables.");
      return;
    }
    try {
      await ensureGoogleScript();
      const google = (globalThis.window as any).google;
      if (!google?.accounts?.id) throw new Error("Google Identity Services not available");
      if (googleInitializedClientId !== googleClientId) {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: ({ credential }: { credential?: string }) => {
            setIsGooglePrompting(false);
            if (!credential) {
              toast.error("Google did not return a credential");
              return;
            }
            googleMut.mutate(credential);
          },
        });
        googleInitializedClientId = googleClientId;
      }
      setIsGooglePrompting(true);
      // Cancel any stale pending prompt before opening a new one.
      if (typeof google.accounts.id.cancel === "function") {
        google.accounts.id.cancel();
      }
      google.accounts.id.prompt(() => {
        setIsGooglePrompting(false);
      });
    } catch (e) {
      setIsGooglePrompting(false);
      const msg = e instanceof Error ? e.message : "Google login setup failed";
      toast.error(msg);
    }
  };
  const handleGoogleRegister = async () => {
    if (!googleClientId) {
      toast.error("Missing VITE_GOOGLE_CLIENT_ID. Set it in local .env or Vercel Environment Variables.");
      return;
    }
    if (!import.meta.env.VITE_API_URL?.trim()) {
      toast.error("Missing VITE_API_URL. Set it in local .env or Vercel Environment Variables.");
      return;
    }
    try {
      await ensureGoogleScript();
      const google = (globalThis.window as any).google;
      if (!google?.accounts?.id) throw new Error("Google Identity Services not available");
      if (googleInitializedClientId !== googleClientId) {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: ({ credential }: { credential?: string }) => {
            setIsGooglePrompting(false);
            if (!credential) {
              toast.error("Google did not return a credential");
              return;
            }
            if (accountRole === "vendor") {
              if (!vendorCompanyName || vendorCompanyName.trim().length < 2) {
                toast.error("Company name is required for vendor registration");
                return;
              }
              googleVendorRegisterMut.mutate({ idToken: credential, companyName: vendorCompanyName.trim() });
              return;
            }
            if (accountRole === "admin") {
              googleAdminRegisterMut.mutate(credential);
              return;
            }
            googleMut.mutate(credential);
          },
        });
        googleInitializedClientId = googleClientId;
      }
      setIsGooglePrompting(true);
      if (typeof google.accounts.id.cancel === "function") {
        google.accounts.id.cancel();
      }
      google.accounts.id.prompt(() => {
        setIsGooglePrompting(false);
      });
    } catch (e) {
      setIsGooglePrompting(false);
      const msg = e instanceof Error ? e.message : "Google registration setup failed";
      toast.error(msg);
    }
  };

  const subtitle =
    accountRole === "customer"
      ? "Sign in to manage bookings and quotes"
      : accountRole === "vendor"
        ? "Sign in to your operator dashboard"
        : accountRole === "b2b"
          ? "Sign in to your corporate travel portal"
          : "Sign in to the admin console";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pb-16 pt-24">
        <div className="mx-4 w-full max-w-md">
          <div className="mb-6 text-center">
            <img
              src="/images/logo.png"
              alt="Luxury Bus Rental"
              className="mx-auto mb-4 h-[4.5rem] w-auto object-contain sm:h-[5.25rem]"
              width={884}
              height={458}
              decoding="async"
            />
            <h1 className="font-display text-2xl font-bold text-foreground">Account portals</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in or open the right dashboard</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-8">
            <div className="mt-0 outline-none">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Portal</p>
                <Tabs
                  value={accountRole}
                  onValueChange={(v) => {
                    const r = v as AccountRole;
                    setAccountRole(r);
                    setRoleInUrl(r);
                  }}
                >
                  <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
                    <TabsTrigger value="customer" className="flex flex-col gap-1 py-3 text-xs sm:text-sm">
                      <User className="mx-auto h-4 w-4 shrink-0" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger value="vendor" className="flex flex-col gap-1 py-3 text-xs sm:text-sm">
                      <Bus className="mx-auto h-4 w-4 shrink-0" />
                      Vendor
                    </TabsTrigger>
                    <TabsTrigger value="b2b" className="flex flex-col gap-1 py-3 text-xs sm:text-sm">
                      <Briefcase className="mx-auto h-4 w-4 shrink-0" />
                      B2B
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex flex-col gap-1 py-3 text-xs sm:text-sm">
                      <ShieldCheck className="mx-auto h-4 w-4 shrink-0" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <p className="mb-4 text-center text-sm text-muted-foreground">{subtitle}</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loginMut.mutate();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-primary" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-primary" /> Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <a
                      href="mailto:kartartravelsltd@gmail.com?subject=Password%20reset"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Button className="w-full" size="lg" type="submit" disabled={loginMut.isPending}>
                    {loginMut.isPending ? "Signing in…" : `Continue as ${roleLabels[accountRole].title}`}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full gap-2"
                  size="lg"
                  onClick={handleGoogleLogin}
                  disabled={googleMut.isPending || isGooglePrompting}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {googleMut.isPending || isGooglePrompting ? "Signing in with Google..." : "Sign in with Google"}
                </Button>
                {(accountRole === "vendor" || accountRole === "admin") ? (
                  <>
                    {accountRole === "vendor" ? (
                      <div className="mt-3 space-y-2">
                        <Label htmlFor="vendor-google-company" className="text-xs text-muted-foreground">
                          Company name (required for vendor registration)
                        </Label>
                        <Input
                          id="vendor-google-company"
                          placeholder="Enter company name"
                          value={vendorCompanyName}
                          onChange={(e) => setVendorCompanyName(e.target.value)}
                        />
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-3 w-full"
                      onClick={handleGoogleRegister}
                      disabled={isGooglePrompting || googleVendorRegisterMut.isPending || googleAdminRegisterMut.isPending}
                    >
                      {accountRole === "vendor"
                        ? (googleVendorRegisterMut.isPending ? "Registering Vendor..." : "Register as Vendor with Google")
                        : (googleAdminRegisterMut.isPending ? "Registering Admin..." : "Register as Admin with Google")}
                    </Button>
                  </>
                ) : null}

                {accountRole === "customer" ? (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-medium text-primary hover:underline">
                      Sign Up
                    </Link>
                  </p>
                ) : accountRole === "vendor" ? (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    New operator?{" "}
                    <Link to="/vendor/register" className="font-medium text-primary hover:underline">
                      Register as vendor
                    </Link>
                  </p>
                ) : accountRole === "b2b" ? (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    New company?{" "}
                    <Link to="/b2b/register" className="font-medium text-primary hover:underline">
                      Register for B2B
                    </Link>
                  </p>
                ) : (
                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    Admin accounts are created by platform staff only.
                  </p>
                )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
