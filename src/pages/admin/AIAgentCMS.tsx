import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Sparkles, Loader2, Bot, BookOpen, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIAgentCMS() {
  const qc = useQueryClient();
  const [running, setRunning] = useState(false);
  const [runningMacro, setRunningMacro] = useState(false);

  const { data: runs, isLoading } = useQuery({
    queryKey: ["ai-agent-runs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agent_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: running ? 3000 : false,
  });

  const invokeAgent = async (trigger: "manual" | "seed_basics", label: string) => {
    setRunning(true);
    toast.info(`${label} started — this can take 2–5 minutes…`);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content-agent", { body: { trigger } });
      if (error) throw error;
      const created = data?.draftsCreated ?? 0;
      if (created === 0 && data?.note) toast.info(data.note);
      else toast.success(`Created ${created} drafts`);
    } catch (e: any) {
      toast.error(e?.message ?? "Run failed");
    } finally {
      setRunning(false);
      qc.invalidateQueries({ queryKey: ["ai-agent-runs"] });
    }
  };

  const invokeMacro = async () => {
    setRunningMacro(true);
    toast.info("Refreshing macro data — usually 1–2 minutes…");
    try {
      const { data, error } = await supabase.functions.invoke("macro-data-agent", { body: { trigger: "manual" } });
      if (error) throw error;
      toast.success(`Macro refresh: ${data?.rows_updated ?? 0} rows updated`);
    } catch (e: any) {
      toast.error(e?.message ?? "Macro refresh failed");
    } finally {
      setRunningMacro(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Automation</p>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            <Bot className="h-6 w-6" /> AI Content Agent
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Runs automatically every day at 02:30 IST. Generates 5 SEO-optimised drafts across
            Educational, Research, and Weekly Reads. All output is saved as <strong>draft</strong> —
            review and publish from the usual CMS sections.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={() => invokeAgent("manual", "Daily run")} disabled={running} size="lg">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {running ? "Generating…" : "Run now"}
          </Button>
          <Button onClick={() => invokeAgent("seed_basics", "Foundational seed run")} disabled={running} size="lg" variant="outline">
            <BookOpen className="h-4 w-4" />
            Seed foundational basics
          </Button>
          <Button onClick={invokeMacro} disabled={runningMacro} size="lg" variant="secondary">
            {runningMacro ? <Loader2 className="h-4 w-4 animate-spin" /> : <LineChart className="h-4 w-4" />}
            {runningMacro ? "Refreshing…" : "Refresh macro data"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link to="/admin/education" className="border rounded-md bg-card p-4 hover:bg-muted/40">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Review</div>
          <div className="font-medium mt-1">Educational drafts →</div>
        </Link>
        <Link to="/admin/research" className="border rounded-md bg-card p-4 hover:bg-muted/40">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Review</div>
          <div className="font-medium mt-1">Research drafts →</div>
        </Link>
        <Link to="/admin/weekly" className="border rounded-md bg-card p-4 hover:bg-muted/40">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Review</div>
          <div className="font-medium mt-1">Weekly Reads drafts →</div>
        </Link>
      </div>

      <h2 className="font-display text-lg font-semibold mb-3">Recent runs</h2>
      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Started</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Drafts</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading…</TableCell></TableRow>}
            {!isLoading && (runs ?? []).length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No runs yet. Click "Run now" to generate the first batch.</TableCell></TableRow>
            )}
            {(runs ?? []).map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{new Date(r.started_at).toLocaleString()}</TableCell>
                <TableCell className="text-sm capitalize">{r.trigger}</TableCell>
                <TableCell>
                  <span className={
                    r.status === "succeeded" ? "text-emerald-600" :
                    r.status === "failed" ? "text-rose-600" :
                    "text-muted-foreground"
                  }>{r.status}</span>
                </TableCell>
                <TableCell className="text-right font-mono">{r.drafts_created}/{r.topics_planned || 5}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                  {r.error ? <span className="text-rose-600">{r.error}</span> :
                    (Array.isArray(r.details) ? r.details.map((d: any) => d.title).filter(Boolean).join(" · ") : "—")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
