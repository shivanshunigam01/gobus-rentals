import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqs,
});

type Row = {
  _id?: string;
  id?: string;
  question: string;
  answer: string;
  group?: string;
  sortOrder?: number;
  status?: string;
};

function AdminFaqs() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Row | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    group: "home",
    sortOrder: "100",
    status: "active",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: () => api<{ items: Row[] }>("/api/admin/faqs"),
  });

  const reset = () => {
    setEdit(null);
    setForm({ question: "", answer: "", group: "home", sortOrder: "100", status: "active" });
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const body = {
        question: form.question,
        answer: form.answer,
        group: form.group,
        sortOrder: Number(form.sortOrder) || 100,
        status: form.status,
      };
      const id = edit?._id || edit?.id;
      if (id) return api(`/api/admin/faqs/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      return api("/api/admin/faqs", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      reset();
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/admin/faqs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className={panelPage}>
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Site FAQs</h1>
          <p className="text-sm text-muted-foreground">Homepage and general FAQs</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>
      {isLoading && <p className={panelStatePadding}>Loading…</p>}
      <div className="space-y-2">
        {(data?.items || []).map((row) => {
          const id = String(row._id || row.id);
          return (
            <div key={id} className="border rounded-lg p-3 bg-card">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{row.question}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{row.answer}</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {row.group} · {row.status}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEdit(row);
                      setForm({
                        question: row.question,
                        answer: row.answer,
                        group: row.group || "home",
                        sortOrder: String(row.sortOrder ?? 100),
                        status: row.status || "active",
                      });
                      setOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMut.mutate(id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Group</Label>
                <Select value={form.group} onValueChange={(v) => setForm((f) => ({ ...f, group: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">home</SelectItem>
                    <SelectItem value="general">general</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="hidden">hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => saveMut.mutate()} disabled={!form.question || !form.answer}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
