import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/documents")({
  component: VendorDocuments,
});

const DOCS = [
  { key: "aadhar", label: "Aadhar" },
  { key: "pan", label: "PAN" },
  { key: "gst", label: "GST" },
  { key: "drivingLicense", label: "Driving License" },
  { key: "rc", label: "RC" },
  { key: "insurance", label: "Insurance" },
  { key: "businessProof", label: "Business Proof" },
  { key: "cancelledCheque", label: "Cancelled Cheque" },
];

function VendorDocuments() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-portal-profile"],
    queryFn: () => api<any>("/api/vendor/profile"),
  });

  const uploadMut = useMutation({
    mutationFn: async ({ key, file }: { key: string; file: File }) => {
      const fd = new FormData();
      fd.append("file", file);
      return api(`/api/vendor/onboarding/documents/${key}`, { method: "POST", body: fd });
    },
    onSuccess: () => {
      toast.success("Uploaded for review");
      qc.invalidateQueries({ queryKey: ["vendor-portal-profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={panelStatePadding}>Loading documents…</div>;
  const docs = data?.documents || {};

  return (
    <div className={panelPage}>
      <h1 className="text-2xl font-bold mb-1">Documents</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Status: <span className="font-medium text-foreground">{data?.documentsStatus || "incomplete"}</span>
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {DOCS.map((d) => {
          const row = docs[d.key] || {};
          return (
            <div key={d.key} className="border rounded-xl p-4 bg-card">
              <div className="flex justify-between gap-2 mb-2">
                <p className="font-medium">{d.label}</p>
                <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-muted">{row.status || "missing"}</span>
              </div>
              {row.url ? (
                <a href={row.url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">
                  View uploaded file
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Not uploaded</p>
              )}
              {row.remark ? <p className="text-xs text-destructive mt-1">{row.remark}</p> : null}
              <Input
                type="file"
                accept="image/*,.pdf"
                className="mt-3"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadMut.mutate({ key: d.key, file });
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = () => {
              const file = input.files?.[0];
              if (file) uploadMut.mutate({ key: "vehicleImages", file });
            };
            input.click();
          }}
        >
          Upload vehicle image
        </Button>
        <div className="flex flex-wrap gap-2 mt-3">
          {(docs.vehicleImages || []).map((img: any, i: number) => (
            <a key={i} href={img.url} target="_blank" rel="noreferrer" className="text-xs underline text-primary">
              Image {i + 1} ({img.status})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
