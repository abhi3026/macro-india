import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Check, X, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import CMSToolbar from "@/components/admin/CMSToolbar";
import ImageUpload from "@/components/admin/ImageUpload";

const SECTIONS = ["Policy", "Market", "Risk"] as const;

export default function WeeklyReadCMS() {
  const qc = useQueryClient();
  const { user, canManage } = useAuth();
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated"); const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<any | null>(null); const [open, setOpen] = useState(false);
  const PAGE = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["weekly-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("weekly_reads").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (search) rows = rows.filter(r => r.heading.toLowerCase().includes(search.toLowerCase()));
    if (status !== "all") rows = rows.filter(r => r.status === status);
    rows = [...rows].sort((a, b) => {
      if (sort === "title") return a.heading.localeCompare(b.heading);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "created") return +new Date(b.created_at) - +new Date(a.created_at);
      return +new Date(b.updated_at) - +new Date(a.updated_at);
    });
    return rows;
  }, [data, search, status, sort]);

  const paged = filtered.slice(page * PAGE, page * PAGE + PAGE);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));

  const setStatusOf = async (id: string, next: string) => {
    const patch: any = { status: next };
    if (next === "published") patch.published_at = new Date().toISOString();
    const { error } = await supabase.from("weekly_reads").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status: ${next}`);
    qc.invalidateQueries({ queryKey: ["weekly-list"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete entry?")) return;
    const { error } = await supabase.from("weekly_reads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["weekly-list"] });
  };

  const openNew = () => { setEditing({ section: "Policy", heading: "", body: "", image: "", link_url: "", status: "draft" }); setOpen(true); };

  const save = async () => {
    if (!editing.heading) return toast.error("Heading required");
    const payload: any = {
      section: editing.section, heading: editing.heading.trim(),
      body: editing.body || null, image: editing.image || null, link_url: editing.link_url || null,
      status: editing.status,
    };
    if (editing.id) {
      if (payload.status === "published" && editing.status !== "published") payload.published_at = new Date().toISOString();
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
  };

  return (
    <div className="p-8">
      <header className="mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Editorial</p>
        <h1 className="font-display text-2xl font-semibold">This Week's Read</h1>
      </header>

      <CMSToolbar
        search={search} onSearch={(v) => { setSearch(v); setPage(0); }}
        status={status} onStatus={(v) => { setStatus(v); setPage(0); }}
        sort={sort} onSort={setSort}
        onNew={openNew}
      />

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 font-mono text-xs">#</TableHead>
              <TableHead className="w-28">Section</TableHead>
              <TableHead>Heading</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-20 text-right">Approve</TableHead>
              <TableHead className="w-20 text-right">Decline</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && paged.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No entries.</TableCell></TableRow>}
            {paged.map((r) => (
              <TableRow key={r.id} className="cursor-pointer" onClick={() => { setEditing(r); setOpen(true); }}>
                <TableCell className="font-mono text-xs text-muted-foreground">{String(r.serial).padStart(4, "0")}</TableCell>
                <TableCell><span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-sm">{r.section}</span></TableCell>
                <TableCell className="font-medium">{r.heading}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" disabled={!canManage || r.status === "published"} onClick={() => setStatusOf(r.id, "published")}><Check className="h-4 w-4 text-emerald-600" /></Button>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" disabled={!canManage || r.status === "declined"} onClick={() => setStatusOf(r.id, "declined")}><X className="h-4 w-4 text-rose-600" /></Button>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {canManage && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
        <span>{filtered.length} entries</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="px-2 self-center">{page + 1} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Edit entry" : "New entry"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-6 space-y-4">
              <div><Label>Section</Label>
                <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.section} onChange={(e) => setEditing({ ...editing, section: e.target.value })}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><Label>Heading</Label><Input value={editing.heading} onChange={(e) => setEditing({ ...editing, heading: e.target.value })} /></div>
              <div><Label>Body</Label><Textarea rows={8} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
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
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
