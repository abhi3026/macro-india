import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
  approved: "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900",
  published: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
  declined: "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-sm border text-[10px] font-medium uppercase tracking-wider",
      map[status] ?? map.draft
    )}>
      {status}
    </span>
  );
}
