import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const tables = ["educational_posts", "research_articles", "weekly_reads"] as const;
const statuses = ["draft", "pending", "approved", "published", "declined"] as const;

export default function AdminDashboard() {
  const { user, roles } = useAuth();

  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const out: Record<string, Record<string, number>> = {};
      for (const t of tables) {
        out[t] = {};
        for (const s of statuses) {
          const { count } = await supabase.from(t).select("id", { count: "exact", head: true }).eq("status", s);
          out[t][s] = count ?? 0;
        }
      }
      return out;
    },
  });

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Overview</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">Newsroom Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Welcome back, <span className="text-foreground">{user?.email}</span>. Roles: {roles.join(", ") || "none"}.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tables.map(t => (
          <div key={t} className="border bg-card rounded-md p-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{t.replace("_", " ")}</p>
            <p className="font-display text-3xl font-semibold mt-2">
              {data?.[t]?.published ?? 0}
              <span className="text-sm text-muted-foreground font-normal ml-1">published</span>
            </p>
            <div className="mt-4 space-y-1.5 text-xs">
              {statuses.map(s => (
                <div key={s} className="flex justify-between">
                  <span className="capitalize text-muted-foreground">{s}</span>
                  <span className="font-mono">{data?.[t]?.[s] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
