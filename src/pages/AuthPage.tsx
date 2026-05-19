import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const credsSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

type Mode = "signin" | "signup" | "forgot" | "otp";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Admin Sign In | IndianMacro"; }, []);

  if (!loading && user && mode !== "otp") return <Navigate to="/admin" replace />;

  const submitCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally { setBusy(false); }
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) { toast.error("Enter a valid email"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("OTP sent. Check your email.");
      setMode("otp");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send OTP");
    } finally { setBusy(false); }
  };

  const verifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 6) { toast.error("Enter the 6-digit code"); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setBusy(true);
    try {
      const { error: vErr } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "recovery" });
      if (vErr) throw vErr;
      const { error: uErr } = await supabase.auth.updateUser({ password: newPassword });
      if (uErr) throw uErr;
      toast.success("Password reset. You're signed in.");
      setMode("signin");
    } catch (err: any) {
      toast.error(err.message ?? "Could not reset password");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <SEOHead title="Admin Sign In | IndianMacro" description="Restricted editorial access" canonicalUrl="/auth" />
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Restricted access</p>
        </div>
        <h1 className="font-display text-2xl font-semibold">
          {mode === "forgot" ? "Reset password" : mode === "otp" ? "Enter code" : "Editorial Console"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signin" && "Sign in to manage research, education and macro data."}
          {mode === "signup" && "Create a contributor account."}
          {mode === "forgot" && "We'll email you a one-time code to reset your password."}
          {mode === "otp" && `Enter the code sent to ${email} and choose a new password.`}
        </p>

        {(mode === "signin" || mode === "signup") && (
          <form onSubmit={submitCreds} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={sendOtp} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Sending…" : "Send code"}
            </Button>
          </form>
        )}

        {mode === "otp" && (
          <form onSubmit={verifyAndReset} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="otp">One-time code</Label>
              <Input id="otp" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" autoComplete="new-password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Resetting…" : "Reset password"}
            </Button>
            <button type="button" onClick={() => sendOtp(new Event("submit") as any)} disabled={busy} className="text-xs text-muted-foreground hover:text-foreground w-full text-center">
              Resend code
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
          {mode === "signin" && (
            <>
              <button onClick={() => setMode("forgot")} className="hover:text-foreground text-center">Forgot password?</button>
              <button onClick={() => setMode("signup")} className="hover:text-foreground text-center">Need an account? Sign up</button>
            </>
          )}
          {mode === "signup" && (
            <button onClick={() => setMode("signin")} className="hover:text-foreground text-center">Already have an account? Sign in</button>
          )}
          {(mode === "forgot" || mode === "otp") && (
            <button onClick={() => { setMode("signin"); setOtp(""); setNewPassword(""); }} className="hover:text-foreground text-center">Back to sign in</button>
          )}
        </div>
      </Card>
    </div>
  );
}
