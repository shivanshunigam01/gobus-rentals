import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { panelPage } from "@/lib/panel-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/seo")({
  component: AdminSeoPage,
});

function AdminSeoPage() {
  const qc = useQueryClient();
  const siteQ = useQuery({
    queryKey: ["admin-seo-site"],
    queryFn: () => api<Record<string, unknown>>("/api/admin/seo/site"),
  });
  const redirectsQ = useQuery({
    queryKey: ["admin-seo-redirects"],
    queryFn: () => api<{ redirects: { _id: string; fromPath: string; toPath: string; statusCode: number }[] }>("/api/admin/seo/redirects"),
  });
  const orphansQ = useQuery({
    queryKey: ["admin-seo-orphans"],
    queryFn: () => api<{ totalPages: number; orphans: string[] }>("/api/admin/seo/orphans"),
  });

  const [siteForm, setSiteForm] = useState<Record<string, string>>({});
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");

  const site = { ...(siteQ.data || {}), ...siteForm };

  const saveSite = useMutation({
    mutationFn: () => api("/api/admin/seo/site", { method: "PATCH", body: JSON.stringify(siteForm) }),
    onSuccess: () => {
      toast.success("SEO site settings saved");
      qc.invalidateQueries({ queryKey: ["admin-seo-site"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveRedirect = useMutation({
    mutationFn: () =>
      api("/api/admin/seo/redirects", {
        method: "POST",
        body: JSON.stringify({ fromPath, toPath, statusCode: 301, enabled: true }),
      }),
    onSuccess: () => {
      toast.success("Redirect saved");
      setFromPath("");
      setToPath("");
      qc.invalidateQueries({ queryKey: ["admin-seo-redirects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const generate = useMutation({
    mutationFn: () =>
      api<{ upserted?: number }>("/api/admin/seo/programmatic/generate", {
        method: "POST",
        body: JSON.stringify({ maxTier: 1 }),
      }),
    onSuccess: (d) => toast.success(`Generated ${d.upserted ?? 0} programmatic pages`),
    onError: (e: Error) => toast.error(e.message),
  });

  const setField = (k: string, v: string) => setSiteForm((p) => ({ ...p, [k]: v }));

  return (
    <div className={panelPage.md}>
      <h1 className="font-display text-2xl font-bold mb-1">SEO Management</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Edit sitewide meta defaults, robots.txt, analytics/pixels, redirects, and regenerate programmatic SEO pages.
      </p>

      <Tabs defaultValue="site">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          <TabsTrigger value="site">Site SEO</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="robots">Robots.txt</TabsTrigger>
          <TabsTrigger value="redirects">Redirects</TabsTrigger>
          <TabsTrigger value="orphans">Orphans</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Canonical host</Label>
            <Input
              defaultValue={String(site.canonicalHost || "")}
              onChange={(e) => setField("canonicalHost", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Default meta title</Label>
            <Input
              defaultValue={String(site.defaultMetaTitle || "")}
              onChange={(e) => setField("defaultMetaTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Default meta description</Label>
            <Textarea
              defaultValue={String(site.defaultMetaDescription || "")}
              onChange={(e) => setField("defaultMetaDescription", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Google Search Console verification</Label>
            <Input
              defaultValue={String(site.googleSiteVerification || "")}
              onChange={(e) => setField("googleSiteVerification", e.target.value)}
              placeholder="content value only"
            />
          </div>
          <Button onClick={() => saveSite.mutate()} disabled={saveSite.isPending}>
            Save site SEO
          </Button>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label>GA Measurement ID</Label>
            <Input defaultValue={String(site.gaMeasurementId || "")} onChange={(e) => setField("gaMeasurementId", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>GTM Container ID</Label>
            <Input defaultValue={String(site.gtmContainerId || "")} onChange={(e) => setField("gtmContainerId", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Meta / Facebook Pixel ID</Label>
            <Input defaultValue={String(site.facebookPixelId || "")} onChange={(e) => setField("facebookPixelId", e.target.value)} />
          </div>
          <Button onClick={() => saveSite.mutate()} disabled={saveSite.isPending}>
            Save tracking
          </Button>
        </TabsContent>

        <TabsContent value="robots" className="space-y-4 max-w-2xl">
          <Label>robots.txt body</Label>
          <Textarea
            rows={12}
            className="font-mono text-xs"
            defaultValue={String(site.robotsTxtBody || "")}
            onChange={(e) => setField("robotsTxtBody", e.target.value)}
          />
          <Button onClick={() => saveSite.mutate()} disabled={saveSite.isPending}>
            Save robots.txt
          </Button>
        </TabsContent>

        <TabsContent value="redirects" className="space-y-4 max-w-2xl">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From path</Label>
              <Input value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="/old-url" />
            </div>
            <div className="space-y-2">
              <Label>To path</Label>
              <Input value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/new-url" />
            </div>
          </div>
          <Button onClick={() => saveRedirect.mutate()} disabled={!fromPath || !toPath || saveRedirect.isPending}>
            Add 301 redirect
          </Button>
          <ul className="text-sm space-y-2 mt-4">
            {(redirectsQ.data?.redirects || []).map((r) => (
              <li key={r._id} className="border rounded px-3 py-2">
                {r.statusCode}: {r.fromPath} → {r.toPath}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="orphans">
          {orphansQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div>
              <p className="text-sm mb-3">
                Indexed-ish pages: {orphansQ.data?.totalPages}. Potential orphans: {orphansQ.data?.orphans?.length || 0}
              </p>
              <ul className="text-xs space-y-1 max-h-96 overflow-auto">
                {(orphansQ.data?.orphans || []).map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Regenerate Tier-1 intent×city programmatic pages from active SeoIntent × SeoLocation rows.
          </p>
          <Button onClick={() => generate.mutate()} disabled={generate.isPending}>
            Generate programmatic SEO pages
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
