import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowUpRight, ArrowDownRight, Minus, Pencil, Plus, Trash2, Save } from "lucide-react";

type Trend = "up" | "down" | "flat";
type Sentiment = "positive" | "negative" | "neutral";
type Row = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  sentiment: Sentiment;
  context: string;
  display_order: number;
  status: string;
};

const sentimentClass = (s: Sentiment) =>
  s === "positive" ? "text-[hsl(var(--gain))]" : s === "negative" ? "text-[hsl(var(--loss))]" : "text-muted-foreground";


const TrendIcon = ({ trend }: { trend: Trend }) => {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--gain))]" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-[hsl(var(--loss))]" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

export default function SnapshotCMS() {
  const qc = useQueryClient();
  const { canManage } = useAuth();
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["snapshot-cms"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("macro_snapshot")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Row[];
    },
  });

  const openNew = () =>
    setEditing({
      label: "", value: "", delta: "", trend: "flat", sentiment: "neutral",
      context: "", display_order: (data?.length ?? 0) + 1, status: "published",
    });

  const openEdit = (r: Row) => setEditing(r);

  const save = async () => {
    if (!editing || !editing.label) return toast.error("Label required");
    const payload = {
      label: editing.label,
      value: editing.value ?? "",
      delta: editing.delta ?? "",
      trend: editing.trend ?? "flat",
      sentiment: editing.sentiment ?? "neutral",
      context: editing.context ?? "",
      display_order: editing.display_order ?? 1000,
      status: editing.status ?? "published",
    };
    if ((editing as Row).id) {
      const { error } = await (supabase as any).from("macro_snapshot").update(payload).eq("id", (editing as Row).id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await (supabase as any).from("macro_snapshot").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setEditing(null); setOpen(false);
    qc.invalidateQueries({ queryKey: ["snapshot-cms"] });
    qc.invalidateQueries({ queryKey: ["macro-snapshot-home"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete metric?")) return;
    const { error } = await (supabase as any).from("macro_snapshot").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["snapshot-cms"] });
    qc.invalidateQueries({ queryKey: ["macro-snapshot-home"] });
  };

  // sync sheet open state with editing
  if (editing && !open) setOpen(true);

  const metrics = data ?? [];

  return (
    <div className="p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Homepage</p>
          <h1 className="font-display text-2xl font-semibold">India at a glance</h1>
          <p className="text-sm text-muted-foreground mt-1">Wired to the Macro Snapshot strip on the homepage.</p>
        </div>
        {canManage && <Button size="sm" onClick={openNew}><Plus className="h-4 w-4" /> Add metric</Button>}
      </header>

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border rounded-lg overflow-hidden bg-card divide-x divide-y sm:divide-y-0 [&>*:nth-child(-n+3)]:sm:border-b lg:[&>*]:!border-b-0">
          {metrics.map((m) => (
            <div key={m.id} className="group relative p-4">
              <p className="text-[10px] tracking-wider uppercase text-muted-foreground truncate">{m.label}</p>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-xl font-semibold tabular-nums">{m.value}</span>
                <TrendIcon trend={m.trend} />
              </div>
              <p className={`mt-0.5 text-[11px] font-medium tabular-nums ${sentimentClass(m.sentiment ?? "neutral")}`}>
                {m.delta}
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">{m.context}</p>

              {canManage && (
                <div className="mt-3 flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => openEdit(m)}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => remove(m.id)}>
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
          {metrics.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground text-sm">No metrics yet.</div>
          )}
        </div>
      )}

      <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>{(editing as Row)?.id ? "Edit metric" : "New metric"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-6 space-y-4">
              <div><Label>Label</Label><Input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Real GDP Growth" /></div>
              <div><Label>Value</Label><Input value={editing.value ?? ""} onChange={(e) => setEditing({ ...editing, value: e.target.value })} placeholder="7.2%" /></div>
              <div><Label>Delta</Label><Input value={editing.delta ?? ""} onChange={(e) => setEditing({ ...editing, delta: e.target.value })} placeholder="+0.3 pp YoY" /></div>
              <div><Label>Sentiment (color)</Label>
                <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.sentiment ?? "neutral"} onChange={(e) => setEditing({ ...editing, sentiment: e.target.value as Sentiment })}>
                  <option value="positive">Positive (green)</option>
                  <option value="negative">Negative (red)</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <div><Label>Trend (icon)</Label>
                <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.trend ?? "flat"} onChange={(e) => setEditing({ ...editing, trend: e.target.value as Trend })}>
                  <option value="up">up</option><option value="down">down</option><option value="flat">flat</option>
                </select>
              </div>
              <div><Label>Context</Label><Input value={editing.context ?? ""} onChange={(e) => setEditing({ ...editing, context: e.target.value })} placeholder="Above 10-yr avg" /></div>
              <div><Label>Display order</Label><Input type="number" value={editing.display_order ?? 1000} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value || "1000", 10) })} /></div>
              <div><Label>Status</Label>
                <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.status ?? "published"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  {["draft", "published"].map(s => <option key={s} value={s}>{s}</option>)}
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
