import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const { user, loading } = useAuth();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scopes, setScopes] = useState<string>("");

  useEffect(() => {
    let active = true;
    if (!authorizationId) {
      setError("This authorization link is missing its request ID. Please start the connection again from your app.");
      return;
    }
    if (!loading && !user) {
      const consentUrl = window.location.pathname + window.location.search;
      window.location.href = "/auth?next=" + encodeURIComponent(consentUrl);
      return;
    }
    (async () => {
      if (!user) return;
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message || "Could not load this authorization request.");
        return;
      }
      const immediate = (data as any)?.redirect_url ?? (data as any)?.redirect_to;
      if (immediate && !(data as any)?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
      setScopes((data as any)?.requested_scope ?? (data as any)?.scope ?? "openid email profile");
    })();
    return () => { active = false; };
  }, [authorizationId, user, loading]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorizationId)
      : await supabase.auth.oauth.denyAuthorization(authorizationId);
    if (error) { setBusy(false); setError(error.message || "Could not process your decision."); return; }
    const target = (data as any)?.redirect_url ?? (data as any)?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect was returned by the authorization server."); return; }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "this app";
  const redirectUri = details?.redirect_uri ?? details?.client?.redirect_uris?.[0] ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <SEOHead title="Authorize connection | IndianMacro" description="Confirm an external app's access to your IndianMacro account." canonicalUrl="/" noindex />
      <Card className="w-full max-w-lg p-8 shadow-elegant">
        {loading && <p className="text-sm text-muted-foreground text-center">Checking your session…</p>}

        {!loading && error && (
          <div className="text-center space-y-3">
            <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
            <h1 className="font-display text-2xl font-semibold">Connection unavailable</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && !user && <p className="text-sm text-muted-foreground text-center">Signing in…</p>}

        {!loading && !error && user && !details && <p className="text-sm text-muted-foreground text-center">Loading authorization…</p>}

        {!loading && !error && user && details && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Authorize connection</p>
            </div>
            <h1 className="font-display text-2xl font-semibold">Connect {clientName} to your account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Signed in as <span className="text-foreground font-medium">{user.email}</span>
            </p>

            <div className="mt-6 rounded-lg border bg-background/50 p-4 text-sm space-y-2">
              <p>
                <span className="font-medium">{clientName}</span> will be able to call this app's enabled tools while you are signed in.
              </p>
              <p className="text-muted-foreground">Connection: {redirectUri || "the requesting app"}</p>
              <p className="text-muted-foreground">Shared identity data: basic profile and email address.</p>
              {scopes && scopes !== "openid email profile" && (
                <p className="text-muted-foreground">Additional permission requested: {scopes}</p>
              )}
              <p className="text-xs text-muted-foreground">This does not bypass IndianMacro's permissions or backend policies.</p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button disabled={busy} onClick={() => decide(true)} className="flex-1">Approve</Button>
              <Button disabled={busy} variant="outline" onClick={() => decide(false)} className="flex-1">Cancel connection</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
