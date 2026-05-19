import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "editor" | "analyst" | "contributor";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  roleError: string | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  canManage: boolean;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const authLoadId = useRef(0);

  const ensureProfile = async (currentUser: User) => {
    const email = currentUser.email?.trim().toLowerCase();
    if (!email) return;

    const { error } = await supabase.from("profiles").upsert({
      id: currentUser.id,
      email,
      display_name: currentUser.user_metadata?.display_name ?? email.split("@")[0],
    }, { onConflict: "id" });

    if (error) throw error;
  };

  const loadRoles = async (currentUser: User | null, loadId: number) => {
    const uid = currentUser?.id;
    if (!uid) {
      if (authLoadId.current === loadId) { setRoles([]); setRoleError(null); }
      return;
    }
    await ensureProfile(currentUser);

    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    if (authLoadId.current !== loadId) return; // stale
    if (error) {
      console.error("[useAuth] loadRoles error", error);
      setRoles([]);
      setRoleError(error.message || "Failed to load roles");
      return;
    }
    setRoleError(null);
    setRoles((data ?? []).map((r: any) => r.role as AppRole));
  };

  const applySession = async (sess: Session | null) => {
    const loadId = ++authLoadId.current;
    setLoading(true);
    setSession(sess);
    setUser(sess?.user ?? null);
    try {
      await loadRoles(sess?.user ?? null, loadId);
    } catch (err: any) {
      if (authLoadId.current === loadId) {
        console.error("[useAuth] applySession error", err);
        setRoles([]);
        setRoleError(err?.message || "Failed to verify CMS access");
      }
    } finally {
      if (authLoadId.current === loadId) setLoading(false);
    }
  };

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION on mount, so no need to also call getSession().
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setTimeout(() => { applySession(sess); }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");
  const canManage = isAdmin || isEditor;

  return (
    <Ctx.Provider value={{
      user, session, roles, roleError, loading, isAdmin, isEditor, canManage,
      signOut: async () => { await supabase.auth.signOut(); },
      refreshRoles: () => loadRoles(user, ++authLoadId.current),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
