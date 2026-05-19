import { cn } from "@/lib/utils";

interface CountryFlagProps {
  code: string;
  className?: string;
}

/**
 * Renders an SVG flag from flagcdn.com using the ISO country code.
 * Falls back gracefully on platforms that don't render regional-indicator emojis (e.g. Windows).
 */
export function CountryFlag({ code, className }: CountryFlagProps) {
  const cc = (code || "").toLowerCase();
  if (!cc) return null;
  return (
    <img
      src={`https://flagcdn.com/${cc}.svg`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={cn("inline-block h-4 w-6 object-cover rounded-[2px] shrink-0", className)}
    />
  );
}
