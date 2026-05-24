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
import { Search, Pencil, Check, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchIndicatorsBundle,
  computeDiff,
  formatDiff,
  sentimentColorClass,
  type CountryIndicator,
  type IndicatorDef,
  type Country,
  type Sentiment,
} from "@/lib/countryIndicators";

// Fixed columns that mirror the homepage Economic Indicators table.
const HOMEPAGE_KEYS = [
  "gdp",
  "gdp_growth",
  "pmi",
  "unemployment",
  "inflation",
  "exports",
  "business_confidence",
  "consumer_confidence",
] as const;

type CellDraft = { current_value: string; previous_value: string; sentiment: Sentiment };
type RowDraftMap = Record<string, CellDraft>; // key = indicator_key

export default function CountryIndicatorsCMS() {
  const qc = useQueryClient();
  const { canManage } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["cms-country-indicators"],
    queryFn: () => fetchIndicatorsBundle({ homepageOnly: false }),
    staleTime: 30_000,
  });

  const [search, setSearch] = useState("");
  const [editingCountry, setEditingCountry] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<RowDraftMap>({});
  const [saving, setSaving] = useState(false);

  const countries: Country[] = data?.countries ?? [];
  const defs: IndicatorDef[] = useMemo(() => {
    const byKey = new Map((data?.defs ?? []).map((d) => [d.key, d]));
    return HOMEPAGE_KEYS.map((k) => byKey.get(k)).filter(Boolean) as IndicatorDef[];
  }, [data?.defs]);
  const matrix = data?.matrix ?? {};

  const filteredCountries = useMemo(
    () => countries.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const startEdit = (cc: string) => {
    if (!canManage) {
      toast.error("You don't have permission to edit indicators.");
      return;
    }
    const row = matrix[cc] ?? {};
    const next: RowDraftMap = {};
    for (const def of defs) {
      const c = row[def.key];
      next[def.key] = {
        current_value: c?.current_value?.toString() ?? "",
        previous_value: c?.previous_value?.toString() ?? "",
        sentiment: ((c as CountryIndicator | undefined)?.sentiment as Sentiment | undefined) ?? "neutral",
      };
    }
    setDrafts(next);
    setEditingCountry(cc);
  };

  const cancelEdit = () => {
    setEditingCountry(null);
    setDrafts({});
  };

  const update = async (cc: string) => {
    setSaving(true);
    try {
      const row = matrix[cc] ?? {};
      const ops = defs.map(async (def) => {
        const d = drafts[def.key];
        if (!d) return;
        const existing = row[def.key];
        const payload = {
          country_code: cc,
          indicator_key: def.key,
          current_value: d.current_value === "" ? null : Number(d.current_value),
          previous_value: d.previous_value === "" ? null : Number(d.previous_value),
          status: "published" as const,
          last_updated: new Date().toISOString(),
        };
        if (existing) {
          const { error } = await supabase
            .from("country_indicators")
            .update(payload)
            .eq("id", existing.id);
          if (error) throw error;
        } else if (payload.current_value !== null || payload.previous_value !== null) {
          const { error } = await supabase.from("country_indicators").insert(payload);
          if (error) throw error;
        }
      });
      await Promise.all(ops);
      toast.success("Updated · live on website");
      setEditingCountry(null);
      setDrafts({});
      qc.invalidateQueries({ queryKey: ["cms-country-indicators"] });
      qc.invalidateQueries({ queryKey: ["economic-indicators"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Macro Data</p>
          <h1 className="font-display text-2xl font-semibold">Economic Indicators</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Two rows per country — <strong>Current</strong> and <strong>Previous</strong>. Click <strong>Edit</strong> to modify values, then <strong>Update</strong> to push live to the homepage and Data Dashboard. The change vs. previous is auto-calculated on the public site.
          </p>
        </div>
        <div className="relative">
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
              <TableHead className="sticky left-0 bg-card z-10 min-w-[200px]">Country</TableHead>
              <TableHead className="min-w-[90px] text-center">
                <Globe className="h-3.5 w-3.5 inline mr-1" />Homepage
              </TableHead>
              <TableHead className="min-w-[90px]">Row</TableHead>
              {defs.map((d) => (
                <TableHead key={d.key} className="text-right min-w-[130px] whitespace-nowrap">
                  {d.label}
                  {d.unit && <span className="text-muted-foreground text-[11px]"> ({d.unit})</span>}
                </TableHead>
              ))}
              <TableHead className="min-w-[180px] text-right sticky right-0 bg-card z-10">Actions</TableHead>
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
            {!isLoading && filteredCountries.length === 0 && (
              <TableRow>
                <TableCell colSpan={defs.length + 4} className="text-center py-12 text-muted-foreground">
                  No countries match your search.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filteredCountries.map((country) => (
                <CountryRows
                  key={country.code}
                  country={country}
                  defs={defs}
                  matrix={matrix}
                  editing={editingCountry === country.code}
                  drafts={drafts}
                  setDrafts={setDrafts}
                  onEdit={() => startEdit(country.code)}
                  onCancel={cancelEdit}
                  onUpdate={() => update(country.code)}
                  onToggleHomepage={(v) => toggleHomepage(country, v)}
                  canManage={canManage}
                  saving={saving}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CountryRows({
  country,
  defs,
  matrix,
  editing,
  drafts,
  setDrafts,
  onEdit,
  onCancel,
  onUpdate,
  onToggleHomepage,
  canManage,
  saving,
}: {
  country: Country;
  defs: IndicatorDef[];
  matrix: Record<string, Record<string, CountryIndicator>>;
  editing: boolean;
  drafts: RowDraftMap;
  setDrafts: React.Dispatch<React.SetStateAction<RowDraftMap>>;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: () => void;
  onToggleHomepage: (v: boolean) => void;
  canManage: boolean;
  saving: boolean;
}) {
  const updateDraft = (key: string, field: keyof CellDraft, value: string) => {
    setDrafts((d) => ({
      ...d,
      [key]: { ...(d[key] ?? { current_value: "", previous_value: "" }), [field]: value },
    }));
  };

  return (
    <>
      {/* CURRENT row */}
      <TableRow className="border-t-2 border-t-border">
        <TableCell rowSpan={2} className="sticky left-0 bg-background align-middle z-10">
          <div className="flex items-center gap-2 font-medium">
            {country.flag_emoji && <span className="text-lg">{country.flag_emoji}</span>}
            <span>{country.name}</span>
          </div>
        </TableCell>
        <TableCell rowSpan={2} className="align-middle text-center">
          <Switch
            checked={country.show_on_homepage}
            disabled={!canManage}
            onCheckedChange={onToggleHomepage}
          />
        </TableCell>
        <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">Current</TableCell>
        {defs.map((d) => {
          const cell = matrix[country.code]?.[d.key];
          return (
            <TableCell key={d.key} className="text-right">
              {editing ? (
                <Input
                  className="h-8 text-right text-xs"
                  inputMode="decimal"
                  value={drafts[d.key]?.current_value ?? ""}
                  onChange={(e) => updateDraft(d.key, "current_value", e.target.value)}
                />
              ) : (
                <span className="font-medium tabular-nums">
                  {cell?.current_value ?? <span className="text-muted-foreground">—</span>}
                </span>
              )}
            </TableCell>
          );
        })}
        <TableCell rowSpan={2} className="align-middle text-right sticky right-0 bg-background z-10">
          {editing ? (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="default" onClick={onUpdate} disabled={saving} className="h-8">
                <Check className="h-3.5 w-3.5 mr-1" />
                {saving ? "Updating…" : "Update"}
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving} className="h-8">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              disabled={!canManage}
              className="h-8"
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
        </TableCell>
      </TableRow>

      {/* PREVIOUS row */}
      <TableRow className="bg-muted/10">
        <TableCell className="text-[11px] uppercase tracking-wider text-muted-foreground">Previous</TableCell>
        {defs.map((d) => {
          const cell = matrix[country.code]?.[d.key];
          const diff = computeDiff(cell?.current_value ?? null, cell?.previous_value ?? null);
          return (
            <TableCell key={d.key} className="text-right">
              {editing ? (
                <Input
                  className="h-8 text-right text-xs"
                  inputMode="decimal"
                  value={drafts[d.key]?.previous_value ?? ""}
                  onChange={(e) => updateDraft(d.key, "previous_value", e.target.value)}
                />
              ) : (
                <div className="space-y-0.5">
                  <div className="text-muted-foreground tabular-nums">
                    {cell?.previous_value ?? "—"}
                  </div>
                  <div className={cn("text-[10px] tabular-nums", diffColorClass(diff, d.higher_is_better))}>
                    Δ {formatDiff(diff)}
                  </div>
                </div>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );
}
