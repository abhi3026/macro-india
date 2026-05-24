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
import { Search, Pencil, Check, X } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { fetchInterestRatesBundle, type InterestRateRow } from "@/lib/interestRates";

type Sentiment = "positive" | "negative" | "neutral";
type Draft = {
  interest_rate: string;
  interest_rate_change: string;
  interest_rate_updated: string;
  interest_rate_sentiment: Sentiment;
  bond_yield: string;
  bond_yield_change: string;
  bond_yield_updated: string;
  bond_yield_sentiment: Sentiment;
};

const emptyDraft = (): Draft => ({
  interest_rate: "",
  interest_rate_change: "",
  interest_rate_updated: "",
  interest_rate_sentiment: "neutral",
  bond_yield: "",
  bond_yield_change: "",
  bond_yield_updated: "",
  bond_yield_sentiment: "neutral",
});

const fromRow = (r?: InterestRateRow): Draft => ({
  interest_rate: r?.interest_rate?.toString() ?? "",
  interest_rate_change: r?.interest_rate_change?.toString() ?? "",
  interest_rate_updated: r?.interest_rate_updated ?? "",
  interest_rate_sentiment: (r?.interest_rate_sentiment as Sentiment) ?? "neutral",
  bond_yield: r?.bond_yield?.toString() ?? "",
  bond_yield_change: r?.bond_yield_change?.toString() ?? "",
  bond_yield_updated: r?.bond_yield_updated ?? "",
  bond_yield_sentiment: (r?.bond_yield_sentiment as Sentiment) ?? "neutral",
});

const toNum = (v: string): number | null => (v === "" ? null : Number(v));
const toDate = (v: string): string | null => (v === "" ? null : v);

export default function InterestRatesCMS() {
  const qc = useQueryClient();
  const { canManage } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["cms-interest-rates"],
    queryFn: () => fetchInterestRatesBundle({ homepageOnly: false }),
    staleTime: 30_000,
  });

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);

  const countries = data?.countries ?? [];
  const byCode = data?.byCode ?? {};

  const filtered = useMemo(
    () => countries.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const startEdit = (cc: string) => {
    if (!canManage) return toast.error("You don't have permission to edit.");
    setDraft(fromRow(byCode[cc]));
    setEditing(cc);
  };
  const cancel = () => { setEditing(null); setDraft(emptyDraft()); };

  const save = async (cc: string) => {
    setSaving(true);
    try {
      const existing = byCode[cc];
      const payload = {
        country_code: cc,
        interest_rate: toNum(draft.interest_rate),
        interest_rate_change: toNum(draft.interest_rate_change),
        interest_rate_updated: toDate(draft.interest_rate_updated),
        interest_rate_sentiment: draft.interest_rate_sentiment,
        bond_yield: toNum(draft.bond_yield),
        bond_yield_change: toNum(draft.bond_yield_change),
        bond_yield_updated: toDate(draft.bond_yield_updated),
        bond_yield_sentiment: draft.bond_yield_sentiment,
        status: "published" as const,
      };
      if (existing) {
        const { error } = await supabase.from("interest_rates").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("interest_rates").insert(payload);
        if (error) throw error;
      }
      toast.success("Updated · live on website");
      cancel();
      qc.invalidateQueries({ queryKey: ["cms-interest-rates"] });
      qc.invalidateQueries({ queryKey: ["interest-rates"] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const upd = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const sentClass = (s: Sentiment) =>
    s === "positive" ? "text-[hsl(var(--gain))]" : s === "negative" ? "text-[hsl(var(--loss))]" : "text-muted-foreground";

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Macro Data</p>
          <h1 className="font-display text-2xl font-semibold">Interest Rates & Bonds</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            One row per country with central bank interest rate, 10-year bond yield, their changes and last-updated dates. Click <strong>Edit</strong> to modify, then <strong>Update</strong> to push live.
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
              <TableHead className="text-right min-w-[120px]">Interest Rate (%)</TableHead>
              <TableHead className="text-right min-w-[120px]">Δ Change (%)</TableHead>
              <TableHead className="min-w-[140px]">Rate Updated</TableHead>
              <TableHead className="text-right min-w-[120px]">10Y Bond Yield (%)</TableHead>
              <TableHead className="text-right min-w-[120px]">Δ Change (%)</TableHead>
              <TableHead className="min-w-[140px]">Yield Updated</TableHead>
              <TableHead className="text-right min-w-[180px] sticky right-0 bg-card z-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No countries match your search.</TableCell></TableRow>
            )}
            {!isLoading && filtered.map((c) => {
              const r = byCode[c.code];
              const isEditing = editing === c.code;
              return (
                <TableRow key={c.code}>
                  <TableCell className="sticky left-0 bg-background z-10">
                    <div className="flex items-center gap-2 font-medium">
                      <CountryFlag code={c.code} />
                      <span>{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input className="h-8 text-right text-xs" inputMode="decimal" value={draft.interest_rate} onChange={(e) => upd("interest_rate", e.target.value)} />
                    ) : (
                      <span className="tabular-nums">{r?.interest_rate ?? "—"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input className="h-8 text-right text-xs" inputMode="decimal" value={draft.interest_rate_change} onChange={(e) => upd("interest_rate_change", e.target.value)} />
                        <select className="h-7 text-[11px] w-full border rounded bg-background px-1" value={draft.interest_rate_sentiment} onChange={(e) => upd("interest_rate_sentiment", e.target.value as Sentiment)}>
                          <option value="positive">Positive (green)</option>
                          <option value="negative">Negative (red)</option>
                          <option value="neutral">Neutral</option>
                        </select>
                      </div>
                    ) : (
                      <span className={`tabular-nums ${sentClass((r?.interest_rate_sentiment as Sentiment) ?? "neutral")}`}>{r?.interest_rate_change ?? "—"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input className="h-8 text-xs" type="date" value={draft.interest_rate_updated} onChange={(e) => upd("interest_rate_updated", e.target.value)} />
                    ) : (
                      <span className="text-xs text-muted-foreground">{r?.interest_rate_updated ?? "—"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input className="h-8 text-right text-xs" inputMode="decimal" value={draft.bond_yield} onChange={(e) => upd("bond_yield", e.target.value)} />
                    ) : (
                      <span className="tabular-nums">{r?.bond_yield ?? "—"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input className="h-8 text-right text-xs" inputMode="decimal" value={draft.bond_yield_change} onChange={(e) => upd("bond_yield_change", e.target.value)} />
                        <select className="h-7 text-[11px] w-full border rounded bg-background px-1" value={draft.bond_yield_sentiment} onChange={(e) => upd("bond_yield_sentiment", e.target.value as Sentiment)}>
                          <option value="positive">Positive (green)</option>
                          <option value="negative">Negative (red)</option>
                          <option value="neutral">Neutral</option>
                        </select>
                      </div>
                    ) : (
                      <span className={`tabular-nums ${sentClass((r?.bond_yield_sentiment as Sentiment) ?? "neutral")}`}>{r?.bond_yield_change ?? "—"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input className="h-8 text-xs" type="date" value={draft.bond_yield_updated} onChange={(e) => upd("bond_yield_updated", e.target.value)} />
                    ) : (
                      <span className="text-xs text-muted-foreground">{r?.bond_yield_updated ?? "—"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background z-10">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => save(c.code)} disabled={saving} className="h-8">
                          <Check className="h-3.5 w-3.5 mr-1" />{saving ? "Updating…" : "Update"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancel} disabled={saving} className="h-8">
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => startEdit(c.code)} disabled={!canManage} className="h-8">
                        <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
