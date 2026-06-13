import { BackToHomeLink } from "@/components/common/BackToHomeLink";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

interface PageHeroProps {
  locale: Locale;
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({ locale, className, children }: PageHeroProps) {
  return (
    <section className={cn("page-hero relative overflow-hidden", className)}>
      <div className="container-custom relative z-[1]">
        <BackToHomeLink locale={locale} />
        {children}
      </div>
    </section>
  );
}
