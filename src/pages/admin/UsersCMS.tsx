import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, UserPlus } from "lucide-react";

const ROLES = ["admin", "editor", "analyst", "contributor"] as const;

export default function UsersCMS() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<typeof ROLES[number]>("contributor");

  const { data: profiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*, user_roles(role)").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: invites } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invitations").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const invite = async () => {
    if (!email.includes("@")) return toast.error("Valid email required");
    const { error } = await supabase.from("invitations").insert({ email: email.trim().toLowerCase(), role });
    if (error) return toast.error(error.message);
    toast.success("Invitation recorded. Share the /auth link with the invitee.");
    setEmail("");
    qc.invalidateQueries({ queryKey: ["invitations"] });
  };

  const setUserRole = async (user_id: string, newRole: typeof ROLES[number]) => {
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", user_id);
    if (delErr) return toast.error(delErr.message);
    const { error } = await supabase.from("user_roles").insert({ user_id, role: newRole });
    if (error) return toast.error(error.message);
    toast.success("Role updated");
    qc.invalidateQueries({ queryKey: ["all-profiles"] });
  };

  const removeInvite = async (id: string) => {
    await supabase.from("invitations").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["invitations"] });
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <header>
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Access Control</p>
        <h1 className="font-display text-2xl font-semibold">Users & Invitations</h1>
      </header>

      <Card className="p-5">
        <h2 className="font-medium mb-3 flex items-center gap-2"><UserPlus className="h-4 w-4" /> Invite collaborator</h2>
        <div className="flex gap-2 items-end">
          <div className="flex-1"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" /></div>
          <div><Label>Role</Label>
            <select className="border rounded-md h-10 px-3 bg-background" value={role} onChange={(e) => setRole(e.target.value as any)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Button onClick={invite}>Send invite</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Invitations record the intended role. The invitee signs up at <code className="bg-muted px-1 rounded">/auth</code> with the same email; an admin then assigns their role below.
        </p>
      </Card>

      <div>
        <h2 className="font-medium mb-3">Pending invitations</h2>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Sent</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {(invites ?? []).length === 0 && <TableRow><TableCell colSpan={4} className="text-muted-foreground text-center py-6">No pending invitations.</TableCell></TableRow>}
              {invites?.map(i => (
                <TableRow key={i.id}>
                  <TableCell>{i.email}</TableCell>
                  <TableCell className="capitalize">{i.role}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeInvite(i.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-3">Members</h2>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Display name</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
            <TableBody>
              {profiles?.map((p: any) => {
                const current = p.user_roles?.[0]?.role ?? "contributor";
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.display_name ?? "—"}</TableCell>
                    <TableCell>
                      <select className="border rounded-md h-8 px-2 bg-background text-sm" value={current} onChange={(e) => setUserRole(p.id, e.target.value as any)}>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
