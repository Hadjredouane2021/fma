import { EqualHeightGrid } from "@/components/common/EqualHeightGrid";
import { LaFmaPremiumCard } from "@/components/common/LaFmaPremiumCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import { localizedText } from "@/lib/localized-content";
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
            className="la-fma-team-card la-fma-mission-card"
          >
            <div className="la-fma-org-card__accent" aria-hidden />
            <div className="la-fma-team-card__content flex h-full min-h-0 flex-col">
              <LaFmaPremiumCard
                icon={localizedText(mission.icon, l)}
                title={localizedText(mission.title, l)}
                description={localizedText(mission.description, l)}
                showAccent={false}
              />
            </div>
          </article>
        ))}
      </EqualHeightGrid>
    </Section>
  );
}
