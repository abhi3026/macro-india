import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Command as CommandIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { subscribeToNewsletter } from "@/utils/newsletter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const navItems = [
  { name: "Home", path: "/", description: "Overview & live indicators" },
  { name: "Research", path: "/research", description: "In-depth reports & analysis" },
  { name: "Data Dashboard", path: "/data-dashboard", description: "Live macro & market data" },
  { name: "Education", path: "/education", description: "Macro concepts explained" },
  { name: "About", path: "/about", description: "Our methodology" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false,
      });
      setTime(t);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const isMarketOpen = () => {
    const now = new Date();
    const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = ist.getDay();
    const mins = ist.getHours() * 60 + ist.getMinutes();
    return day >= 1 && day <= 5 && mins >= 555 && mins <= 930; // 9:15-15:30 IST
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        localStorage.setItem("newsletter-subscribed", "true");
        toast({ title: "Subscribed", description: result.message });
        setEmail("");
        setSubscribeOpen(false);
      } else {
        toast({ title: "Subscription failed", description: result.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Subscription failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const open = isMarketOpen();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-background/60 backdrop-blur-md border-b border-transparent"
      )}
    >
      {/* Utility strip */}
      <div className="hidden md:block border-b border-border/60 bg-background/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", open ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40")} />
              NSE {open ? "Open" : "Closed"}
            </span>
            <span className="font-mono tabular-nums">IST {time}</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("flex items-center justify-between transition-all", scrolled ? "h-14" : "h-16")}>
          <Link to="/" className="flex items-center gap-2.5" aria-label="IndianMacro Home">
            <img src="/logo.svg" alt="" className="h-7 w-7" width={28} height={28} />
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Indian<span className="text-[hsl(var(--brand))]">Macro</span>
            </span>
            <span className="hidden sm:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
              Research
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute left-3 right-3 -bottom-px h-px bg-[hsl(var(--brand))]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => navigate("/search")}
              className="hidden md:inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1 font-mono text-[10px]">
                <CommandIcon className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            <ThemeToggle />

            <Button
              variant="default"
              size="sm"
              className="hidden md:inline-flex bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]/90"
              onClick={() => setSubscribeOpen(true)}
            >
              Get research <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>

            {/* Mobile sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm p-0 flex flex-col">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">
                    Indian<span className="text-[hsl(var(--brand))]">Macro</span>
                  </span>
                </div>
                <form onSubmit={handleSearch} className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search markets, research…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </form>
                <nav className="flex-1 overflow-y-auto p-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg transition-colors",
                        isActive(item.path) ? "bg-muted" : "hover:bg-muted"
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-border">
                  <Button
                    className="w-full bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]/90"
                    onClick={() => { setMobileOpen(false); setSubscribeOpen(true); }}
                  >
                    Get research <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Dialog open={subscribeOpen} onOpenChange={setSubscribeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Get IndianMacro research</DialogTitle>
            <DialogDescription>
              Weekly briefings on India's economy, markets and policy — straight to your inbox.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubscribe} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="subscribe-email">Email address</Label>
              <Input
                id="subscribe-email" type="email" required placeholder="you@firm.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit" disabled={submitting}
              className="w-full bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand))]/90"
            >
              {submitting ? "Subscribing…" : "Subscribe"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Unsubscribe anytime. We never share your email.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
