import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import {
  useAllIndicatorsAdmin,
  diff,
  type IndicatorDef,
  type CountryIndicator,
} from "@/hooks/useEconomicIndicators";
import { cn } from "@/lib/utils";

type Draft = Partial<CountryIndicator>;

export default function IndicatorsCMS() {
  const qc = useQueryClient();
  const { canManage } = useAuth();
  const { data, isLoading } = useAllIndicatorsAdmin();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null); // country_code
  const [drafts, setDrafts] = useState<Record<string, Record<string, Draft>>>({}); // [code][key] = draft
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [headerDraft, setHeaderDraft] = useState("");
  const [addingCountry, setAddingCountry] = useState(false);
  const [newCountry, setNewCountry] = useState({ code: "", name: "", flag_emoji: "" });
  const [addingDef, setAddingDef] = useState(false);
  const [newDef, setNewDef] = useState({ key: "", label: "", unit: "" });

  const filtered = useMemo(
    () =>
      (data?.countries ?? []).filter(
        (c) => !search || c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["indicators"] });
  };

  const setDraft = (code: string, key: string, field: keyof CountryIndicator, value: any) => {
    setDrafts((d) => ({
      ...d,
      [code]: { ...d[code], [key]: { ...d[code]?.[key], [field]: value } },
    }));
  };

  const startEdit = (code: string) => {
    setEditing(code);
    // pre-load existing values into draft so user sees current values in inputs
    const seed: Record<string, Draft> = {};
    for (const def of data?.defs ?? []) {
      const existing = data?.byCountry[code]?.[def.key];
      if (existing) seed[def.key] = { ...existing };
    }
    setDrafts((d) => ({ ...d, [code]: seed }));
  };

  const cancelEdit = (code: string) => {
    setEditing(null);
    setDrafts((d) => {
      const c = { ...d };
      delete c[code];
      return c;
    });
  };

  const saveRow = async (code: string) => {
    const rowDrafts = drafts[code] ?? {};
    const ops: Promise<any>[] = [];
    for (const def of data?.defs ?? []) {
      const draft = rowDrafts[def.key];
      const existing = data?.byCountry[code]?.[def.key];
      // Skip if nothing entered and no existing row
      const hasAny =
        draft &&
        (draft.current_value != null ||
          draft.previous_value != null ||
          draft.period_label ||
          draft.source);
      if (!hasAny && !existing) continue;
      const payload = {
        country_code: code,
        indicator_key: def.key,
        current_value:
          draft?.current_value === ("" as any) ? null : draft?.current_value ?? existing?.current_value ?? null,
        previous_value:
          draft?.previous_value === ("" as any) ? null : draft?.previous_value ?? existing?.previous_value ?? null,
        period_label: draft?.period_label ?? existing?.period_label ?? null,
        source: draft?.source ?? existing?.source ?? null,
        source_url: draft?.source_url ?? existing?.source_url ?? null,
        notes: draft?.notes ?? existing?.notes ?? null,
        status: draft?.status ?? existing?.status ?? "published",
        last_updated: new Date().toISOString(),
      };
      ops.push(
        supabase
          .from("country_indicators")
          .upsert(payload, { onConflict: "country_code,indicator_key" })
      );
    }
    const results = await Promise.all(ops);
    const err = results.find((r) => r.error)?.error;
    if (err) return toast.error(err.message);
    toast.success("Updated");
    cancelEdit(code);
    invalidate();
  };

  const saveHeader = async (key: string) => {
    if (!headerDraft.trim()) return setEditingHeader(null);
    const { error } = await supabase
      .from("indicator_definitions")
      .update({ label: headerDraft.trim() })
      .eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Heading updated");
    setEditingHeader(null);
    invalidate();
  };

  const toggleHomepageCountry = async (code: string, value: boolean) => {
    const { error } = await supabase.from("countries").update({ show_on_homepage: value }).eq("code", code);
    if (error) return toast.error(error.message);
    invalidate();
  };

  const toggleHomepageDef = async (key: string, field: "show_on_homepage" | "show_on_dashboard", value: boolean) => {
    const { error } = await supabase.from("indicator_definitions").update({ [field]: value }).eq("key", key);
    if (error) return toast.error(error.message);
    invalidate();
  };

  const removeCountry = async (code: string) => {
    if (!confirm(`Remove country ${code} and its indicators?`)) return;
    const { error } = await supabase.from("countries").delete().eq("code", code);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    invalidate();
  };

  const removeDef = async (key: string) => {
    if (!confirm(`Remove indicator '${key}' from all countries?`)) return;
    const { error } = await supabase.from("indicator_definitions").delete().eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    invalidate();
  };

  const createCountry = async () => {
    if (!newCountry.code || !newCountry.name) return toast.error("Code and name required");
    const { error } = await supabase.from("countries").insert({
      code: newCountry.code.toLowerCase(),
      name: newCountry.name,
      flag_emoji: newCountry.flag_emoji || null,
      show_on_homepage: false,
    });
    if (error) return toast.error(error.message);
    toast.success("Country added");
    setAddingCountry(false);
    setNewCountry({ code: "", name: "", flag_emoji: "" });
    invalidate();
  };

  const createDef = async () => {
    if (!newDef.key || !newDef.label) return toast.error("Key and label required");
    const { error } = await supabase.from("indicator_definitions").insert({
      key: newDef.key.toLowerCase().replace(/\s+/g, "_"),
      label: newDef.label,
      unit: newDef.unit || null,
      show_on_dashboard: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Indicator added");
    setAddingDef(false);
    setNewDef({ key: "", label: "", unit: "" });
    invalidate();
  };

  return (
    <div className="p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Macro Data</p>
          <h1 className="font-display text-2xl font-semibold">Economic Indicators Terminal</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Edit a country's row → values, source, period sync to homepage & dashboard. Click a column heading to rename it everywhere.
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setAddingDef(true)}>
              <Plus className="h-4 w-4" /> Indicator
            </Button>
            <Button size="sm" onClick={() => setAddingCountry(true)}>
              <Plus className="h-4 w-4" /> Country
            </Button>
          </div>
        )}
      </header>

      {addingCountry && (
        <div className="mb-4 p-3 border rounded-md bg-card flex gap-2 items-end">
          <div><label className="text-xs">Code (ISO 2)</label><Input className="h-8 w-24" value={newCountry.code} onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })} /></div>
          <div><label className="text-xs">Name</label><Input className="h-8" value={newCountry.name} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} /></div>
          <div><label className="text-xs">Flag emoji</label><Input className="h-8 w-20" value={newCountry.flag_emoji} onChange={(e) => setNewCountry({ ...newCountry, flag_emoji: e.target.value })} /></div>
          <Button size="sm" onClick={createCountry}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => setAddingCountry(false)}>Cancel</Button>
        </div>
      )}
      {addingDef && (
        <div className="mb-4 p-3 border rounded-md bg-card flex gap-2 items-end">
          <div><label className="text-xs">Key</label><Input className="h-8 w-40" value={newDef.key} onChange={(e) => setNewDef({ ...newDef, key: e.target.value })} placeholder="e.g. industrial_production" /></div>
          <div><label className="text-xs">Label</label><Input className="h-8" value={newDef.label} onChange={(e) => setNewDef({ ...newDef, label: e.target.value })} /></div>
          <div><label className="text-xs">Unit</label><Input className="h-8 w-24" value={newDef.unit} onChange={(e) => setNewDef({ ...newDef, unit: e.target.value })} placeholder="%" /></div>
          <Button size="sm" onClick={createDef}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => setAddingDef(false)}>Cancel</Button>
        </div>
      )}

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 h-9" placeholder="Search countries…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead className="sticky left-0 bg-card min-w-[200px]">Country</TableHead>
              <TableHead className="w-20 text-center">Home</TableHead>
              {data?.defs.map((def) => (
                <TableHead key={def.key} className="min-w-[160px] align-top">
                  {editingHeader === def.key ? (
                    <div className="flex gap-1">
                      <Input
                        className="h-7 text-xs"
                        value={headerDraft}
                        onChange={(e) => setHeaderDraft(e.target.value)}
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => saveHeader(def.key)}>
                        <Save className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      className="text-left w-full hover:text-foreground"
                      onClick={() => canManage && (setEditingHeader(def.key), setHeaderDraft(def.label))}
                      title="Click to rename — updates everywhere"
                    >
                      <div className="font-semibold">{def.label}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{def.key} · {def.unit ?? ""}</div>
                    </button>
                  )}
                  {canManage && (
                    <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground">
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={def.show_on_homepage} onChange={(e) => toggleHomepageDef(def.key, "show_on_homepage", e.target.checked)} /> H
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={def.show_on_dashboard} onChange={(e) => toggleHomepageDef(def.key, "show_on_dashboard", e.target.checked)} /> D
                      </label>
                      <button onClick={() => removeDef(def.key)} className="ml-auto text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  )}
                </TableHead>
              ))}
              <TableHead className="w-32 text-right sticky right-0 bg-card">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={(data?.defs?.length ?? 0) + 3} className="text-center py-8 text-muted-foreground">Loading…</TableCell>
              </TableRow>
            )}
            {filtered.map((country) => {
              const isEditing = editing === country.code;
              return (
                <TableRow key={country.code} className={cn(isEditing && "bg-muted/40")}>
                  <TableCell className="sticky left-0 bg-card font-medium align-top">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{country.flag_emoji}</span>
                      <div>
                        <div>{country.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{country.code}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-top">
                    <input
                      type="checkbox"
                      checked={country.show_on_homepage}
                      onChange={(e) => toggleHomepageCountry(country.code, e.target.checked)}
                      disabled={!canManage}
                    />
                  </TableCell>
                  {data?.defs.map((def) => {
                    const row = data.byCountry[country.code]?.[def.key];
                    const draft = drafts[country.code]?.[def.key];
                    const curr = isEditing ? draft?.current_value ?? row?.current_value ?? "" : row?.current_value;
                    const prev = isEditing ? draft?.previous_value ?? row?.previous_value ?? "" : row?.previous_value;
                    const d = diff(
                      typeof curr === "number" ? curr : Number(curr),
                      typeof prev === "number" ? prev : Number(prev)
                    );
                    return (
                      <TableCell key={def.key} className="align-top">
                        {isEditing ? (
                          <div className="space-y-1">
                            <Input
                              className="h-7 text-xs font-mono"
                              type="number"
                              step="any"
                              placeholder="current"
                              value={curr as any}
                              onChange={(e) => setDraft(country.code, def.key, "current_value", e.target.value === "" ? null : Number(e.target.value))}
                            />
                            <Input
                              className="h-7 text-xs font-mono text-muted-foreground"
                              type="number"
                              step="any"
                              placeholder="previous"
                              value={prev as any}
                              onChange={(e) => setDraft(country.code, def.key, "previous_value", e.target.value === "" ? null : Number(e.target.value))}
                            />
                            <Input
                              className="h-7 text-[10px]"
                              placeholder="period (e.g. Q4/24)"
                              value={(draft?.period_label ?? row?.period_label) ?? ""}
                              onChange={(e) => setDraft(country.code, def.key, "period_label", e.target.value)}
                            />
                            <Input
                              className="h-7 text-[10px]"
                              placeholder="source"
                              value={(draft?.source ?? row?.source) ?? ""}
                              onChange={(e) => setDraft(country.code, def.key, "source", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="font-mono text-sm">{curr === "" || curr == null ? "—" : curr}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">prev: {prev === "" || prev == null ? "—" : prev}</div>
                            {d != null && (
                              <div className={cn(
                                "text-[11px] font-mono",
                                d > 0 ? "text-green-600" : d < 0 ? "text-red-600" : "text-muted-foreground"
                              )}>
                                {d > 0 ? "+" : ""}{d}
                              </div>
                            )}
                            {row?.period_label && <div className="text-[10px] text-muted-foreground">{row.period_label}</div>}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right sticky right-0 bg-card align-top">
                    {isEditing ? (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" onClick={() => saveRow(country.code)}>
                          <Save className="h-3.5 w-3.5" /> Update
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => cancelEdit(country.code)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1 justify-end">
                        {canManage && (
                          <Button size="sm" variant="outline" onClick={() => startEdit(country.code)}>
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                        )}
                        {canManage && (
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeCountry(country.code)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        H = show on Homepage · D = show on Dashboard · Differences are auto-calculated from current − previous.
      </p>
    </div>
  );
}
