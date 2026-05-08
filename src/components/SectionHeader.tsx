import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  id?: string;
}

const SectionHeader = ({ eyebrow, title, description, action, align = "left", id }: SectionHeaderProps) => {
  const isCenter = align === "center";
  return (
    <div
      className={`flex flex-col ${
        action && !isCenter ? "sm:flex-row sm:items-end sm:justify-between" : ""
      } gap-3 mb-6 sm:mb-8 ${isCenter ? "text-center items-center" : ""}`}
    >
      <div className={isCenter ? "max-w-2xl mx-auto" : "max-w-2xl"}>
        {eyebrow && (
          <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2 font-medium">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="font-display text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight leading-[1.1]"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
