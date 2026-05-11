import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export default function ImageUpload({ value, onChange, label = "Featured image" }: { value?: string | null; onChange: (url: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("cms-media").upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("cms-media").getPublicUrl(path);
      onChange(publicUrl);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      {value ? (
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden border">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-7 w-7" onClick={() => onChange("")}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video bg-muted/30 rounded-md border-2 border-dashed cursor-pointer hover:bg-muted transition">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-1.5">{busy ? "Uploading…" : "Click to upload"}</span>
          <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        </label>
      )}
      <Input className="text-xs h-8" placeholder="Or paste URL…" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
