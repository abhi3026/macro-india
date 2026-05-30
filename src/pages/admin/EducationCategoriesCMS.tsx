import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";

interface CategoryRow {
  slug: string;
  title: string;
  intro_markdown: string;
  display_order: number;
  seo_title?: string | null;
  seo_description?: string | null;
}

const empty: CategoryRow = { slug: "", title: "", intro_markdown: "", display_order: 1000, seo_title: "", seo_description: "" };

export default function EducationCategoriesCMS() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["education-categories-cms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education_categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as CategoryRow[];
    },
  });

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) {
      toast.error("Slug and title are required");
      return;
    }
    const payload = {
      slug: editing.slug.toLowerCase().trim(),
      title: editing.title.trim(),
      intro_markdown: editing.intro_markdown,
      display_order: editing.display_order,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
    };
    const { error } = isNew
      ? await supabase.from("education_categories").insert(payload)
      : await supabase.from("education_categories").update(payload).eq("slug", payload.slug);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Category added" : "Category saved");
    setEditing(null);
    setIsNew(false);
    qc.invalidateQueries({ queryKey: ["education-categories-cms"] });
    qc.invalidateQueries({ queryKey: ["education-category"] });
  };

  const remove = async (slug: string) => {
    if (!confirm(`Delete category "${slug}"? Posts in this category will remain but the intro page will revert to defaults.`)) return;
    const { error } = await supabase.from("education_categories").delete().eq("slug", slug);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["education-categories-cms"] });
  };

  return (
    <div className="p-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Education</p>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            <FolderTree className="h-6 w-6" /> Education Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Each category powers a public page at <code>/education/&lt;slug&gt;</code> with an editable intro and an auto-listed grid of posts.
          </p>
        </div>
        <Button onClick={() => { setIsNew(true); setEditing({ ...empty }); }} size="lg">
          <Plus className="h-4 w-4" /> New category
        </Button>
      </header>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Order</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Intro</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading…</TableCell></TableRow>}
            {!isLoading && (data ?? []).length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No categories yet.</TableCell></TableRow>
            )}
            {(data ?? []).map((c) => (
              <TableRow key={c.slug}>
                <TableCell className="font-mono text-xs">{c.display_order}</TableCell>
                <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-md truncate">{c.intro_markdown}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setIsNew(false); setEditing(c); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(c.slug)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setIsNew(false); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "New category" : `Edit ${editing?.title}`}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} disabled={!isNew}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="macroeconomics" />
                  <p className="text-[11px] text-muted-foreground mt-1">URL: /education/{editing.slug || "<slug>"}</p>
                </div>
                <div>
                  <Label>Display order</Label>
                  <Input type="number" value={editing.display_order}
                    onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) || 1000 })} />
                </div>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Macroeconomics" />
              </div>
              <div>
                <Label>Intro (markdown)</Label>
                <Textarea rows={6} value={editing.intro_markdown}
                  onChange={(e) => setEditing({ ...editing, intro_markdown: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>SEO title <span className="text-muted-foreground">(optional, ~55 chars)</span></Label>
                  <Input value={editing.seo_title ?? ""}
                    onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
                </div>
                <div>
                  <Label>SEO description <span className="text-muted-foreground">(optional, ~150 chars)</span></Label>
                  <Textarea rows={2} value={editing.seo_description ?? ""}
                    onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
