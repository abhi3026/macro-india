import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, GraduationCap, FileText, Gauge, Globe2, Percent, Newspaper, Users, LogOut, Lock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/ai-agent", icon: Bot, label: "AI Agent" },
  { to: "/admin/education", icon: GraduationCap, label: "Educational" },
  { to: "/admin/research", icon: FileText, label: "Research" },
  { to: "/admin/snapshot", icon: Gauge, label: "India at a glance" },
  { to: "/admin/country-indicators", icon: Globe2, label: "Economic Indicators" },
  { to: "/admin/interest-rates", icon: Percent, label: "Interest Rates & Bonds" },
  { to: "/admin/weekly", icon: Newspaper, label: "This Week's Read" },
  { to: "/admin/users", icon: Users, label: "Users", adminOnly: true },
];

export default function AdminLayout() {
  const { user, roles, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex bg-muted/20">
      <aside className="w-60 shrink-0 border-r bg-card flex flex-col">
        <div className="px-5 py-5 border-b">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">Editorial Console</span>
          </div>
          <h1 className="mt-1 font-display text-lg font-semibold tracking-tight">IndianMacro CMS</h1>
        </div>
        <nav className="p-2 flex-1 overflow-y-auto">
          {items.filter(i => !i.adminOnly || isAdmin).map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) => cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"
              )}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="px-2 mb-2">
            <p className="text-xs font-medium truncate">{user?.email}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{roles.join(" · ") || "no role"}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={async () => { await signOut(); nav("/auth"); }}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
