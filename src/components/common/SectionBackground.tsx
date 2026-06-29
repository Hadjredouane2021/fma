import { cn } from "@/lib/utils";
import { sectionBgClassName } from "@/lib/section-backgrounds";

/** Enveloppe page / bloc avec fond décoratif admin (`deco-section-bg--{id}`) */
export function SectionBackground({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(sectionBgClassName(id), "deco-section-bg-shell relative bg-transparent", className)}>
      {children}
    </div>
  );
}
