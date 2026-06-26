import { cn } from "@/lib/utils";

/** Typographie fluide des titres de section (accueil, La FMA, etc.). */
export const SECTION_HEADER_TITLE_CLASSES =
  "font-display text-pretty break-words font-bold tracking-tight text-[var(--fma-blue)] gold-accent text-[clamp(1.375rem,1.05rem+1.5vw,2.65rem)] leading-[1.22] sm:leading-[1.18] lg:leading-[1.12]";

/** Titres longs (phrase) — une ligne sur desktop, retour à la ligne sur mobile. */
export const SECTION_HEADER_LONG_TITLE_CLASSES =
  "font-display break-words font-bold tracking-tight text-[var(--fma-blue)] gold-accent text-[clamp(1.0625rem,0.65rem+1.35vw,1.875rem)] leading-[1.3] sm:leading-[1.24] md:leading-[1.2] lg:leading-[1.16] lg:whitespace-nowrap lg:max-w-none";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  /** Classes fusionnées sur le titre (h2), après les styles par défaut. */
  titleClassName?: string;
  /** Centre le titre et le sous-titre. */
  centered?: boolean;
  /** Phrase longue — taille et interligne adaptés au mobile. */
  longTitle?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  className,
  titleClassName,
  centered = false,
  longTitle = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 sm:mb-10 lg:mb-14 xl:mb-16",
        centered ? "text-center" : "text-start",
        className
      )}
    >
      <h2
        className={cn(
          longTitle ? SECTION_HEADER_LONG_TITLE_CLASSES : SECTION_HEADER_TITLE_CLASSES,
          centered && "after:mx-auto",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-pretty text-sm font-medium leading-relaxed text-[var(--text-2)] sm:mt-6 sm:text-base lg:mt-8 lg:text-lg",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
