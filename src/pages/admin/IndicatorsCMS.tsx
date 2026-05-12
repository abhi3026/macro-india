import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Save, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

type Row = any;

export default function IndicatorsCMS() {
  const qc = useQueryClient();
  const { canManage } = useAuth();
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Record<string, Row>>({});
  const [adding, setAdding] = useState(false);
  const [neu, setNeu] = useState<any>({ indicator: "", current_value: "", previous_value: "", unit: "", source: "", source_url: "", status: "published" });

  const { data, isLoading } = useQuery({
    queryKey: ["ind-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("economic_indicators").select("*").order("serial", { ascending: true });
      if (error) throw error;
      return data as Row[];
    },
  });

  const filtered = useMemo(() => (data ?? []).filter(r => !search || r.indicator.toLowerCase().includes(search.toLowerCase())), [data, search]);

  const merged = (r: Row) => ({ ...r, ...draft[r.id] });

  const setField = (id: string, field: string, value: any) =>
    setDraft(d => ({ ...d, [id]: { ...d[id], [field]: value } }));

  const save = async (r: Row) => {
    const patch = draft[r.id];
    if (!patch) return;
    const { error } = await supabase.from("economic_indicators").update({ ...patch, last_updated: new Date().toISOString() }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(d => { const c = { ...d }; delete c[r.id]; return c; });
    qc.invalidateQueries({ queryKey: ["ind-list"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete indicator?")) return;
    const { error } = await supabase.from("economic_indicators").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["ind-list"] });
  };

  const create = async () => {
    if (!neu.indicator) return toast.error("Indicator name required");
    const { error } = await supabase.from("economic_indicators").insert({ ...neu });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setAdding(false); setNeu({ indicator: "", current_value: "", previous_value: "", unit: "", source: "", source_url: "", status: "published" });
    qc.invalidateQueries({ queryKey: ["ind-list"] });
  };

  return (
    <div className="p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Macro Data</p>
          <h1 className="font-display text-2xl font-semibold">Economic Indicators</h1>
        </div>
        {canManage && <Button size="sm" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add indicator</Button>}
      </header>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 h-9" placeholder="Search indicators…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 font-mono text-xs">#</TableHead>
              <TableHead>Indicator</TableHead>
              <TableHead className="w-32">Current</TableHead>
              <TableHead className="w-32">Previous</TableHead>
              <TableHead className="w-24">Unit</TableHead>
              <TableHead className="w-44">Source</TableHead>
              <TableHead className="w-40">Last Updated</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adding && (
              <TableRow className="bg-muted/30">
                <TableCell className="text-xs text-muted-foreground">new</TableCell>
                <TableCell><Input className="h-8" value={neu.indicator} onChange={e => setNeu({ ...neu, indicator: e.target.value })} placeholder="e.g. CPI Inflation" /></TableCell>
                <TableCell><Input className="h-8" value={neu.current_value} onChange={e => setNeu({ ...neu, current_value: e.target.value })} /></TableCell>
                <TableCell><Input className="h-8" value={neu.previous_value} onChange={e => setNeu({ ...neu, previous_value: e.target.value })} /></TableCell>
                <TableCell><Input className="h-8" value={neu.unit} onChange={e => setNeu({ ...neu, unit: e.target.value })} placeholder="%" /></TableCell>
                <TableCell><Input className="h-8" value={neu.source} onChange={e => setNeu({ ...neu, source: e.target.value })} placeholder="MoSPI" /></TableCell>
                <TableCell className="text-xs text-muted-foreground">on save</TableCell>
                <TableCell><StatusBadge status={neu.status} /></TableCell>
                <TableCell className="space-x-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={create}><Save className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setAdding(false)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            )}
            {isLoading && <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && filtered.length === 0 && !adding && <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No indicators yet.</TableCell></TableRow>}
            {filtered.map((r) => {
              const m = merged(r);
              const dirty = !!draft[r.id];
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{String(r.serial).padStart(3, "0")}</TableCell>
                  <TableCell><Input className="h-8 border-transparent hover:border-input focus:border-input" value={m.indicator} disabled={!canManage} onChange={e => setField(r.id, "indicator", e.target.value)} /></TableCell>
                  <TableCell><Input className="h-8 font-mono border-transparent hover:border-input focus:border-input" value={m.current_value ?? ""} disabled={!canManage} onChange={e => setField(r.id, "current_value", e.target.value)} /></TableCell>
                  <TableCell><Input className="h-8 font-mono border-transparent hover:border-input focus:border-input" value={m.previous_value ?? ""} disabled={!canManage} onChange={e => setField(r.id, "previous_value", e.target.value)} /></TableCell>
                  <TableCell><Input className="h-8 border-transparent hover:border-input focus:border-input" value={m.unit ?? ""} disabled={!canManage} onChange={e => setField(r.id, "unit", e.target.value)} /></TableCell>
                  <TableCell><Input className="h-8 border-transparent hover:border-input focus:border-input" value={m.source ?? ""} disabled={!canManage} onChange={e => setField(r.id, "source", e.target.value)} /></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{new Date(r.last_updated).toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                  <TableCell className="space-x-1">
                    {dirty && <Button size="icon" variant="default" className="h-7 w-7" onClick={() => save(r)}><Save className="h-3.5 w-3.5" /></Button>}
                    {canManage && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> Edits autosave on Save click. Last Updated stamp is refreshed automatically.</p>
    </div>
  );
}
