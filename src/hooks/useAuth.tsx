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

  const loadRoles = async (uid: string | undefined) => {
    if (!uid) { setRoles([]); setRoleError(null); return; }
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    if (error) {
      setRoles([]);
      setRoleError(error.message);
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
    await loadRoles(sess?.user?.id);
    if (authLoadId.current === loadId) setLoading(false);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      // Defer to avoid recursive call during auth callback
      setTimeout(() => { applySession(sess); }, 0);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      applySession(sess);
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
      refreshRoles: () => loadRoles(user?.id),
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
