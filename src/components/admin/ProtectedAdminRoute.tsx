import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

export default function ProtectedAdminRoute({ children, requireManage = false }: { children: ReactNode; requireManage?: boolean }) {
  const { user, loading, canManage, roles } = useAuth();
  const loc = useLocation();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  // Any authenticated user with at least one role can enter admin shell (read-only views allowed for analyst/contributor)
  if (roles.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
      Your account is not authorised for the admin console. Contact an administrator.
    </div>;
  }
  if (requireManage && !canManage) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
