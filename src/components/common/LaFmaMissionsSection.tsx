import { EqualHeightGrid } from "@/components/common/EqualHeightGrid";
import { LaFmaPremiumCard } from "@/components/common/LaFmaPremiumCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import type { LaFmaMission } from "@/lib/la-fma-site-public";
import type { Locale } from "@/types";

type LaFmaMissionsSectionProps = {
  locale: Locale;
  title: string;
  missions: LaFmaMission[];
};

export function LaFmaMissionsSection({ locale, title, missions }: LaFmaMissionsSectionProps) {
  const l = locale;

  return (
    <Section className="la-fma-missions">
      <SectionHeader title={title} longTitle />
      <EqualHeightGrid className="la-fma-missions__grid mt-10 sm:mt-12">
        {missions.map((mission, idx) => (
          <article
            key={`la-fma-mission-${idx}`}
            data-equal-height-item
            className="la-fma-org-card la-fma-mission-card"
          >
            <LaFmaPremiumCard
              icon={mission.icon}
              title={mission.title[l]}
              description={mission.description[l]}
            />
          </article>
        ))}
      </EqualHeightGrid>
    </Section>
  );
}
