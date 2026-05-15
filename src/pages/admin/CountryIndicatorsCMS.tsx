import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, Save, Pencil, X, RefreshCw, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchIndicatorsBundle,
  computeDiff,
  formatDiff,
  diffColorClass,
  type CountryIndicator,
  type IndicatorDef,
  type Country,
} from "@/lib/countryIndicators";

type Draft = {
  current_value: string;
  previous_value: string;
  period_label: string;
};

export default function CountryIndicatorsCMS() {
  const qc = useQueryClient();
  const { canManage } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["cms-country-indicators"],
    queryFn: () => fetchIndicatorsBundle({ homepageOnly: false }),
    staleTime: 30_000,
  });

  const [search, setSearch] = useState("");
  const [editingCell, setEditingCell] = useState<string | null>(null); // `${country}-${indicator}`
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  // Editable headers (indicator definitions)
  const [defDrafts, setDefDrafts] = useState<Record<string, { label: string; unit: string }>>({});
  const [editingDef, setEditingDef] = useState<string | null>(null);

  const countries = data?.countries ?? [];
  const defs = useMemo(() => (data?.defs ?? []).filter((d) => d.show_on_dashboard), [data?.defs]);
  const matrix = data?.matrix ?? {};

  const filteredCountries = useMemo(
    () => countries.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const cellKey = (cc: string, ik: string) => `${cc}-${ik}`;

  const startEdit = (cc: string, def: IndicatorDef) => {
    if (!canManage) return;
    const k = cellKey(cc, def.key);
    const cell = matrix[cc]?.[def.key];
    setDrafts((d) => ({
      ...d,
      [k]: {
        current_value: cell?.current_value?.toString() ?? "",
        previous_value: cell?.previous_value?.toString() ?? "",
        period_label: cell?.period_label ?? "",
      },
    }));
    setEditingCell(k);
  };

  const cancelEdit = (k: string) => {
    setEditingCell(null);
    setDrafts((d) => {
      const c = { ...d };
      delete c[k];
      return c;
    });
  };

  const saveCell = async (cc: string, def: IndicatorDef) => {
    const k = cellKey(cc, def.key);
    const draft = drafts[k];
    if (!draft) return;
    const existing = matrix[cc]?.[def.key];

    const payload = {
      country_code: cc,
      indicator_key: def.key,
      current_value: draft.current_value === "" ? null : Number(draft.current_value),
      previous_value: draft.previous_value === "" ? null : Number(draft.previous_value),
      period_label: draft.period_label || null,
      status: "published" as const,
      last_updated: new Date().toISOString(),
    };

    let error;
    if (existing) {
      ({ error } = await supabase.from("country_indicators").update(payload).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("country_indicators").insert(payload));
    }

    if (error) return toast.error(error.message);
    toast.success(`Updated · live on website`);
    cancelEdit(k);
    qc.invalidateQueries({ queryKey: ["cms-country-indicators"] });
    qc.invalidateQueries({ queryKey: ["economic-indicators"] });
  };

  const toggleHomepage = async (country: Country, value: boolean) => {
    if (!canManage) return;
    const { error } = await supabase
      .from("countries")
      .update({ show_on_homepage: value })
      .eq("code", country.code);
    if (error) return toast.error(error.message);
    toast.success(`${country.name} ${value ? "added to" : "removed from"} homepage`);
    qc.invalidateQueries({ queryKey: ["cms-country-indicators"] });
    qc.invalidateQueries({ queryKey: ["economic-indicators"] });
  };

  const startEditDef = (def: IndicatorDef) => {
    if (!canManage) return;
    setDefDrafts((d) => ({ ...d, [def.key]: { label: def.label, unit: def.unit ?? "" } }));
    setEditingDef(def.key);
  };

  const saveDef = async (def: IndicatorDef) => {
    const draft = defDrafts[def.key];
    if (!draft) return;
    const { error } = await supabase
      .from("indicator_definitions")
      .update({ label: draft.label, unit: draft.unit || null })
      .eq("key", def.key);
    if (error) return toast.error(error.message);
    toast.success("Heading updated");
    setEditingDef(null);
    setDefDrafts((d) => {
      const c = { ...d };
      delete c[def.key];
      return c;
    });
    qc.invalidateQueries({ queryKey: ["cms-country-indicators"] });
    qc.invalidateQueries({ queryKey: ["economic-indicators"] });
  };

  return (
    <div className="p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Macro Data</p>
          <h1 className="font-display text-2xl font-semibold">Country Economic Indicators</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Drives the homepage Economic Indicators table and the Data Dashboard page. Click any cell to edit; click Save to push live.
          </p>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-9 w-72"
            placeholder="Search countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card min-w-[220px]">Country</TableHead>
              <TableHead className="min-w-[110px] text-center">
                <Globe className="h-3.5 w-3.5 inline mr-1" /> Homepage
              </TableHead>
              <TableHead className="min-w-[100px]">Row</TableHead>
              {defs.map((d) => (
                <TableHead key={d.key} className="text-right min-w-[170px]">
                  {editingDef === d.key ? (
                    <div className="flex flex-col gap-1">
                      <Input
                        className="h-7 text-right text-xs"
                        value={defDrafts[d.key]?.label ?? ""}
                        onChange={(e) => setDefDrafts((dd) => ({ ...dd, [d.key]: { ...dd[d.key], label: e.target.value } }))}
                        placeholder="Label"
                      />
                      <Input
                        className="h-7 text-right text-xs"
                        value={defDrafts[d.key]?.unit ?? ""}
                        onChange={(e) => setDefDrafts((dd) => ({ ...dd, [d.key]: { ...dd[d.key], unit: e.target.value } }))}
                        placeholder="Unit (e.g. %)"
                      />
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="default" className="h-6 w-6" onClick={() => saveDef(d)}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingDef(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditDef(d)}
                      disabled={!canManage}
                      className="group inline-flex items-center gap-1.5 hover:text-foreground"
                      title="Click to edit heading"
                    >
                      <span className="font-medium">{d.label}</span>
                      {d.unit && <span className="text-muted-foreground text-[11px]">({d.unit})</span>}
                      {canManage && <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60" />}
                    </button>
                  )}
                </TableHead>
              ))}
              <TableHead className="min-w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={defs.length + 4} className="text-center py-12 text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filteredCountries.map((country) => {
                return (
                  <CountryBlock
                    key={country.code}
                    country={country}
                    defs={defs}
                    matrix={matrix}
                    canManage={canManage}
                    editingCell={editingCell}
                    drafts={drafts}
                    setDrafts={setDrafts}
                    startEdit={startEdit}
                    cancelEdit={cancelEdit}
                    saveCell={saveCell}
                    toggleHomepage={toggleHomepage}
                  />
                );
              })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
        <RefreshCw className="h-3 w-3" /> Diff (current − previous) is auto-calculated and color-coded by indicator direction. Saved values push live to the homepage and Data Dashboard immediately.
      </p>
    </div>
  );
}

function CountryBlock({
  country,
  defs,
  matrix,
  canManage,
  editingCell,
  drafts,
  setDrafts,
  startEdit,
  cancelEdit,
  saveCell,
  toggleHomepage,
}: {
  country: Country;
  defs: IndicatorDef[];
  matrix: Record<string, Record<string, CountryIndicator>>;
  canManage: boolean;
  editingCell: string | null;
  drafts: Record<string, Draft>;
  setDrafts: React.Dispatch<React.SetStateAction<Record<string, Draft>>>;
  startEdit: (cc: string, def: IndicatorDef) => void;
  cancelEdit: (k: string) => void;
  saveCell: (cc: string, def: IndicatorDef) => Promise<void>;
  toggleHomepage: (c: Country, v: boolean) => Promise<void>;
}) {
  const cellKey = (ik: string) => `${country.code}-${ik}`;

  return (
    <>
      <TableRow className="border-t-2 border-t-border">
        <TableCell rowSpan={3} className="sticky left-0 bg-background align-top">
          <div className="flex items-center gap-2 font-medium">
            {country.flag_emoji && <span className="text-lg">{country.flag_emoji}</span>}
            <span>{country.name}</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{country.code}</p>
        </TableCell>
        <TableCell rowSpan={3} className="align-top text-center">
          <Switch
            checked={country.show_on_homepage}
            disabled={!canManage}
            onCheckedChange={(v) => toggleHomepage(country, v)}
          />
        </TableCell>
        <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">Current</TableCell>
        {defs.map((d) => {
          const k = cellKey(d.key);
          const editing = editingCell === k;
          const cell = matrix[country.code]?.[d.key];
          return (
            <TableCell key={d.key} className="text-right">
              {editing ? (
                <Input
                  className="h-7 text-right text-xs"
                  value={drafts[k]?.current_value ?? ""}
                  onChange={(e) => setDrafts((dd) => ({ ...dd, [k]: { ...dd[k], current_value: e.target.value } }))}
                />
              ) : (
                <button
                  onClick={() => startEdit(country.code, d)}
                  disabled={!canManage}
                  className="font-medium hover:underline"
                >
                  {cell?.current_value ?? <span className="text-muted-foreground">—</span>}
                </button>
              )}
            </TableCell>
          );
        })}
        <TableCell rowSpan={3} className="align-top text-right">
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">Previous</TableCell>
        {defs.map((d) => {
          const k = cellKey(d.key);
          const editing = editingCell === k;
          const cell = matrix[country.code]?.[d.key];
          return (
            <TableCell key={d.key} className="text-right">
              {editing ? (
                <Input
                  className="h-7 text-right text-xs"
                  value={drafts[k]?.previous_value ?? ""}
                  onChange={(e) => setDrafts((dd) => ({ ...dd, [k]: { ...dd[k], previous_value: e.target.value } }))}
                />
              ) : (
                <button
                  onClick={() => startEdit(country.code, d)}
                  disabled={!canManage}
                  className="text-muted-foreground hover:underline"
                >
                  {cell?.previous_value ?? "—"}
                </button>
              )}
            </TableCell>
          );
        })}
      </TableRow>

      <TableRow className="bg-muted/20">
        <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">Δ / Period</TableCell>
        {defs.map((d) => {
          const k = cellKey(d.key);
          const editing = editingCell === k;
          const cell = matrix[country.code]?.[d.key];
          const diff = computeDiff(cell?.current_value ?? null, cell?.previous_value ?? null);
          return (
            <TableCell key={d.key} className="text-right">
              {editing ? (
                <div className="flex flex-col gap-1.5">
                  <Input
                    className="h-7 text-right text-xs"
                    placeholder="Period (e.g. Mar/24)"
                    value={drafts[k]?.period_label ?? ""}
                    onChange={(e) => setDrafts((dd) => ({ ...dd, [k]: { ...dd[k], period_label: e.target.value } }))}
                  />
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="default" className="h-6 w-6" onClick={() => saveCell(country.code, d)} title="Save & push live">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => cancelEdit(k)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <div className={cn("text-xs font-medium", diffColorClass(diff, d.higher_is_better))}>
                    {formatDiff(diff)}
                  </div>
                  {cell?.period_label && (
                    <div className="text-[10px] text-muted-foreground">{cell.period_label}</div>
                  )}
                </div>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );
}
