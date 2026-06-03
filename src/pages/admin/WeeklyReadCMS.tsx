import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Pencil, Plus, Trash2, Save, Check, X, TrendingUp, Lightbulb, AlertCircle, type LucideIcon } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import StatusBadge from "@/components/admin/StatusBadge";

const SECTIONS = ["Policy", "Market", "Risk"] as const;

const META: Record<string, { icon: LucideIcon; accent: string }> = {
  Policy: { icon: TrendingUp, accent: "text-[hsl(var(--brand))]" },
  Market: { icon: Lightbulb, accent: "text-amber-600 dark:text-amber-400" },
  Risk: { icon: AlertCircle, accent: "text-[hsl(var(--loss))]" },
};

export default function WeeklyReadCMS() {
  const qc = useQueryClient();
  const { user, canManage } = useAuth();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["weekly-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_reads").select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const openNew = () => {
    setEditing({ section: "Policy", heading: "", body: "", image: "", link_url: "", status: "published" });
    setOpen(true);
  };

  const openEdit = (r: any) => { setEditing(r); setOpen(true); };

  const save = async () => {
    if (!editing.heading) return toast.error("Heading required");
    const payload: any = {
      section: editing.section,
      heading: editing.heading.trim(),
      body: editing.body || null,
      image: editing.image || null,
      link_url: editing.link_url || null,
      status: editing.status,
    };
    if (editing.id) {
      if (payload.status === "published" && editing.status !== "published") {
        payload.published_at = new Date().toISOString();
      }
      const { error } = await supabase.from("weekly_reads").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      payload.author_id = user?.id;
      if (payload.status === "published") payload.published_at = new Date().toISOString();
      const { error } = await supabase.from("weekly_reads").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["weekly-list"] });
    qc.invalidateQueries({ queryKey: ["weekly-reads-home"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete entry?")) return;
    const { error } = await supabase.from("weekly_reads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["weekly-list"] });
    qc.invalidateQueries({ queryKey: ["weekly-reads-home"] });
  };

  const PUBLISH_LIMIT = 3;
  const publishedCount = (data ?? []).filter((r: any) => r.status === "published").length;

  const setPublished = async (r: any, publish: boolean) => {
    if (publish) {
      if (r.status === "published") return;
      if (publishedCount >= PUBLISH_LIMIT) {
        return toast.error(`Only ${PUBLISH_LIMIT} posts can be published at a time. Unpublish one first.`);
      }
      const { error } = await supabase
        .from("weekly_reads")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", r.id);
      if (error) return toast.error(error.message);
      toast.success("Published");
    } else {
      if (r.status !== "published") return;
      const { error } = await supabase
        .from("weekly_reads")
        .update({ status: "draft" })
        .eq("id", r.id);
      if (error) return toast.error(error.message);
      toast.success("Unpublished");
    }
    qc.invalidateQueries({ queryKey: ["weekly-list"] });
    qc.invalidateQueries({ queryKey: ["weekly-reads-home"] });
  };


  const rows = data ?? [];

  return (
    <div className="p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Editorial</p>
          <h1 className="font-display text-2xl font-semibold">This Week's Read</h1>
          <p className="text-sm text-muted-foreground mt-1">Wired to the "What the data is telling us" section on the homepage.</p>
        </div>
        {canManage && <Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /> Add entry</Button>}
      </header>

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="border rounded-xl bg-card p-12 text-center text-muted-foreground text-sm">No entries yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((r) => {
            const meta = META[r.section] ?? META.Policy;
            const Icon = meta.icon;
            return (
              <article key={r.id} className="group relative rounded-xl border bg-card p-6 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center h-7 w-7 rounded-md bg-accent ${meta.accent}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground font-medium">
                      {r.section}
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight mb-3">
                  {r.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{r.body}</p>

                {canManage && (
                  <div className="mt-5 pt-4 border-t flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8" onClick={() => openEdit(r)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 disabled:opacity-40"
                      title={r.status === "published" ? "Already published" : (publishedCount >= PUBLISH_LIMIT ? `Limit ${PUBLISH_LIMIT} reached` : "Publish")}
                      disabled={r.status === "published" || publishedCount >= PUBLISH_LIMIT}
                      onClick={() => setPublished(r, true)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 disabled:opacity-40"
                      title={r.status === "published" ? "Unpublish" : "Not published"}
                      disabled={r.status !== "published"}
                      onClick={() => setPublished(r, false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 ml-auto" onClick={() => remove(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

              </article>
            );
          })}
        </div>
      )}

      <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Edit entry" : "New entry"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-6 space-y-4">
              <div><Label>Section</Label>
                <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.section} onChange={(e) => setEditing({ ...editing, section: e.target.value })}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><Label>Heading</Label><Input maxLength={90} value={editing.heading} onChange={(e) => setEditing({ ...editing, heading: e.target.value })} /></div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Body</Label>
                  <span className="text-xs text-muted-foreground">{(editing.body ?? "").length} / 280</span>
                </div>
                <Textarea
                  rows={5}
                  maxLength={280}
                  value={editing.body ?? ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  placeholder="Keep it tight — 2–3 sentences, like the existing entries on the homepage."
                />
              </div>
              <ImageUpload value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} label="Image / chart (optional)" />
              <div><Label>External link (optional)</Label><Input value={editing.link_url ?? ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} placeholder="https://…" /></div>
              <div><Label>Status</Label>
                <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  {["draft", "pending", "approved", "published", "declined"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={save}><Save className="h-4 w-4" /> Update</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
