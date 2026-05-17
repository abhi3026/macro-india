import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

export default function ProtectedAdminRoute({ children, requireManage = false }: { children: ReactNode; requireManage?: boolean }) {
  const { user, loading, canManage, roles, roleError } = useAuth();
  const loc = useLocation();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  if (roleError && roles.length === 0) {
    return <div className="min-h-screen flex flex-col items-center justify-center text-sm text-muted-foreground p-6 text-center gap-2">
      <div>We could not verify your admin access. Please refresh and try again.</div>
      <div className="text-xs opacity-70">Error: {roleError}</div>
    </div>;
  }
  // Any authenticated user with at least one role can enter admin shell (read-only views allowed for analyst/contributor)
  if (roles.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
      Your account is not authorised for the admin console. Contact an administrator.
    </div>;
  }
  if (requireManage && !canManage) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
