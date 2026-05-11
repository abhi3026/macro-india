import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = ["all", "draft", "pending", "approved", "published", "declined"] as const;

export default function CMSToolbar({
  search, onSearch, status, onStatus, sort, onSort, onNew, categories = [], category, onCategory,
}: {
  search: string; onSearch: (v: string) => void;
  status: string; onStatus: (v: string) => void;
  sort: string; onSort: (v: string) => void;
  onNew?: () => void;
  categories?: string[]; category?: string; onCategory?: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 h-9" placeholder="Search title…" value={search} onChange={(e) => onSearch(e.target.value)} />
      </div>
      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
      </Select>
      {onCategory && (
        <Select value={category ?? "all"} onValueChange={onCategory}>
          <SelectTrigger className="w-[170px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      <Select value={sort} onValueChange={onSort}>
        <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Newest update</SelectItem>
          <SelectItem value="created">Newest created</SelectItem>
          <SelectItem value="status">By status</SelectItem>
          <SelectItem value="title">By title</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex-1" />
      {onNew && <Button size="sm" className="h-9" onClick={onNew}><Plus className="h-4 w-4" /> New</Button>}
    </div>
  );
}
