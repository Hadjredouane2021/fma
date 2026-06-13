import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import type { LaFmaStat } from "@/lib/la-fma-site-public";
import type { Locale } from "@/types";

type LaFmaPresentationSectionProps = {
  locale: Locale;
  title: string;
  bodyHtml: string;
  stats: LaFmaStat[];
};

export function LaFmaPresentationSection({
  locale,
  title,
  bodyHtml,
  stats,
}: LaFmaPresentationSectionProps) {
  const l = locale;

  return (
    <Section bordered="y" className="la-fma-presentation" containerClassName="la-fma-presentation__inner">
      <div className="la-fma-presentation__grid">
        <article className="la-fma-presentation__panel">
          <div className="la-fma-presentation__panel-accent" aria-hidden />
          <SectionHeader title={title} className="mb-5 sm:mb-6 lg:mb-8" />
          <div
            className="prose-fma la-fma-presentation__prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </article>

        <aside className="la-fma-presentation__stats" aria-label={l === "ar" ? "أرقام رئيسية" : l === "en" ? "Key figures" : "Chiffres clés"}>
          {stats.map((stat, idx) => (
            <div key={`la-fma-stat-${idx}`} className="la-fma-presentation-stat">
              <div className="la-fma-presentation-stat__body">
                <p className="la-fma-presentation-stat__value font-display">{stat.value}</p>
                <p className="la-fma-presentation-stat__label">{stat.label[l]}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </Section>
  );
}
