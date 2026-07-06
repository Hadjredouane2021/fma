import { EqualHeightGrid } from "@/components/common/EqualHeightGrid";
import { LaFmaPremiumCard } from "@/components/common/LaFmaPremiumCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import { localizedText } from "@/lib/localized-content";
import type { LaFmaOrgBloc } from "@/lib/la-fma-site-public";
import type { Locale } from "@/types";

type LaFmaOrganisationSectionProps = {
  locale: Locale;
  title: string;
  blocs: LaFmaOrgBloc[];
};

export function LaFmaOrganisationSection({ locale, title, blocs }: LaFmaOrganisationSectionProps) {
  const l = locale;

  return (
    <Section className="la-fma-organisation">
      <SectionHeader title={title} />
      <EqualHeightGrid className="la-fma-organisation__grid mt-10 sm:mt-12">
        {blocs.map((bloc, idx) => (
          <article
            key={`la-fma-org-${idx}`}
            data-equal-height-item
            className="la-fma-team-card la-fma-mission-card"
          >
            <div className="la-fma-org-card__accent" aria-hidden />
            <div className="la-fma-team-card__content flex h-full min-h-0 flex-col">
              <LaFmaPremiumCard
                icon={localizedText(bloc.icon, l)}
                title={localizedText(bloc.title, l)}
                description={localizedText(bloc.description, l)}
                showAccent={false}
              />
            </div>
          </article>
        ))}
      </EqualHeightGrid>
    </Section>
  );
}
