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
import { Switch } from "@/components/ui/switch";
import { Check, X, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import CMSToolbar from "@/components/admin/CMSToolbar";
import ImageUpload from "@/components/admin/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

type Row = any;

export default function ResearchCMS() {
  const qc = useQueryClient();
  const { user, canManage } = useAuth();
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated"); const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Row | null>(null); const [open, setOpen] = useState(false);
  const PAGE = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["research-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("research_articles").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Row[];
    },
  });

  const categories = useMemo(() => Array.from(new Set((data ?? []).map(r => r.category).filter(Boolean))), [data]);
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (search) rows = rows.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
    if (status !== "all") rows = rows.filter(r => r.status === status);
    if (category !== "all") rows = rows.filter(r => r.category === category);
    rows = [...rows].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "created") return +new Date(b.created_at) - +new Date(a.created_at);
      return +new Date(b.updated_at) - +new Date(a.updated_at);
    });
    return rows;
  }, [data, search, status, sort, category]);

  const paged = filtered.slice(page * PAGE, page * PAGE + PAGE);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));

  const setStatusOf = async (id: string, next: string) => {
    const patch: any = { status: next };
    if (next === "published") patch.published_at = new Date().toISOString();
    const { error } = await supabase.from("research_articles").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status: ${next}`);
    qc.invalidateQueries({ queryKey: ["research-list"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete article permanently?")) return;
    const { error } = await supabase.from("research_articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["research-list"] });
  };

  const openNew = () => { setEditing({ title: "", slug: "", category: "", excerpt: "", body: "", featured_image: "", tags: [], references_list: [], publish_date: "", status: "draft", featured: false, seo_title: "", seo_description: "", og_image: "", canonical_url: "" }); setOpen(true); };
  const openEdit = (r: Row) => { setEditing(r); setOpen(true); };

  const save = async () => {
    if (!editing.title) return toast.error("Title required");
    if (!editing.featured_image) return toast.error("Featured image is required for research articles");
    const tags = Array.isArray(editing.tags) ? editing.tags : (editing.tags || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    const refs = Array.isArray(editing.references_list) ? editing.references_list : (editing.references_list || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
    const payload: any = {
      title: editing.title.trim(),
      slug: editing.slug?.trim() || slugify(editing.title),
      category: editing.category || null,
      excerpt: editing.excerpt || null,
      body: editing.body || null,
      featured_image: editing.featured_image,
      tags, references_list: refs,
      publish_date: editing.publish_date || null,
      status: editing.status,
      featured: !!editing.featured,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      og_image: editing.og_image || null,
      canonical_url: editing.canonical_url || null,
    };
    if (editing.id) {
      if (payload.status === "published" && editing.status !== "published") payload.published_at = new Date().toISOString();
      const { error } = await supabase.from("research_articles").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      payload.author_id = user?.id;
      if (payload.status === "published") payload.published_at = new Date().toISOString();
      const { error } = await supabase.from("research_articles").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["research-list"] });
  };

  return (
    <div className="p-8">
      <header className="mb-6">
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Research</p>
        <h1 className="font-display text-2xl font-semibold">Research Articles</h1>
      </header>

      <CMSToolbar
        search={search} onSearch={(v) => { setSearch(v); setPage(0); }}
        status={status} onStatus={(v) => { setStatus(v); setPage(0); }}
        sort={sort} onSort={setSort}
        categories={categories as string[]} category={category} onCategory={(v) => { setCategory(v); setPage(0); }}
        onNew={openNew}
      />

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 font-mono text-xs">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-36">Category</TableHead>
              <TableHead className="w-32">Publish Date</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-20 text-right">Approve</TableHead>
              <TableHead className="w-20 text-right">Decline</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Loading…</TableCell></TableRow>}
            {!isLoading && paged.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No articles. Click "New" to create one.</TableCell></TableRow>}
            {paged.map((r) => (
              <TableRow key={r.id} className="cursor-pointer" onClick={() => openEdit(r)}>
                <TableCell className="font-mono text-xs text-muted-foreground">{String(r.serial).padStart(4, "0")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {r.featured_image && <img src={r.featured_image} alt="" className="w-10 h-7 object-cover rounded-sm border" />}
                    <div>
                      <div className="font-medium">{r.title}{r.featured && <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">★ featured</span>}</div>
                      <div className="text-xs text-muted-foreground">{r.slug}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{r.category ?? "—"}</TableCell>
                <TableCell className="text-sm font-mono text-xs">{r.publish_date ?? "—"}</TableCell>
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
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Edit research article" : "New research article"}</SheetTitle></SheetHeader>
          {editing && (
            <Tabs defaultValue="content" className="mt-6">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4 mt-4">
                <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
                <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto from title" /></div>
                <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
                <div><Label>Body (Markdown)</Label><Textarea rows={16} className="font-mono text-sm" value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
                <ImageUpload value={editing.featured_image} onChange={(url) => setEditing({ ...editing, featured_image: url })} label="Featured image (required)" />
              </TabsContent>
              <TabsContent value="meta" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                  <div><Label>Publish date</Label><Input type="date" value={editing.publish_date ?? ""} onChange={(e) => setEditing({ ...editing, publish_date: e.target.value })} /></div>
                </div>
                <div><Label>Tags (comma separated)</Label><Input value={Array.isArray(editing.tags) ? editing.tags.join(", ") : editing.tags ?? ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></div>
                <div><Label>References (one per line)</Label><Textarea rows={4} value={Array.isArray(editing.references_list) ? editing.references_list.join("\n") : editing.references_list ?? ""} onChange={(e) => setEditing({ ...editing, references_list: e.target.value })} /></div>
                <div className="flex items-center gap-3"><Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} /><Label className="!mt-0">Featured on homepage</Label></div>
                <div><Label>Status</Label>
                  <select className="w-full border rounded-md h-10 px-3 bg-background" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                    {["draft", "pending", "approved", "published", "declined"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </TabsContent>
              <TabsContent value="seo" className="space-y-4 mt-4">
                <div><Label>SEO Title</Label><Input value={editing.seo_title ?? ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} /></div>
                <div><Label>Meta Description</Label><Textarea rows={3} value={editing.seo_description ?? ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} /></div>
                <div><Label>OG Image URL</Label><Input value={editing.og_image ?? ""} onChange={(e) => setEditing({ ...editing, og_image: e.target.value })} /></div>
                <div><Label>Canonical URL</Label><Input value={editing.canonical_url ?? ""} onChange={(e) => setEditing({ ...editing, canonical_url: e.target.value })} /></div>
              </TabsContent>
            </Tabs>
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
