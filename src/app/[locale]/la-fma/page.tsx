import Image from "next/image";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { SectionBackground } from "@/components/common/SectionBackground";
import { ComiteDirecteurBoard, COMITE_DIRECTEUR_SECTION_TITLE } from "@/components/common/ComiteDirecteurBoard";
import { LaFmaMissionsSection } from "@/components/common/LaFmaMissionsSection";
import { LaFmaOrganisationSection } from "@/components/common/LaFmaOrganisationSection";
import { LaFmaPresentationSection } from "@/components/common/LaFmaPresentationSection";
import { LaFmaValeursSection } from "@/components/common/LaFmaValeursSection";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import { getLaFmaContent } from "@/lib/site-content";
import { getLaFmaPageData } from "@/lib/la-fma-page-cache";
import { DEFAULT_LA_FMA_CONTENT } from "@/lib/la-fma-site-public";
import { cn } from "@/lib/utils";
import type { Locale, TeamMember, Member } from "@/types";
import type { Metadata } from "next";

export const revalidate = 300;

function OrgCard({ member, locale }: { member: TeamMember; locale: Locale }) {
  const name =
    locale === "ar" ? member.nameAr || member.nameFr
    : locale === "en" ? member.nameEn || member.nameFr
    : member.nameFr;
  const title =
    locale === "ar" ? member.titleAr || member.titleFr || ""
    : locale === "en" ? member.titleEn || member.titleFr || ""
    : member.titleFr || "";

  return (
    <div
      className={cn(
        "la-fma-team-card la-fma-org-chart-card flex flex-col items-center justify-center text-center"
      )}
    >
      <div className="la-fma-team-card__content">
        <p className="font-bold leading-snug text-[var(--text-1)]">{name}</p>
        {title ? <p className="leading-snug text-[var(--blue)]">{title}</p> : null}
      </div>
    </div>
  );
}

function OrgChart({ members, locale }: { members: TeamMember[]; locale: Locale }) {
  const orgRow = (order: number) => (order >= 10 ? Math.floor(order / 10) : order);
  const orgCol = (order: number) => (order >= 10 ? order % 10 : 0);

  const sorted = [...members].sort((a, b) => {
    const rowA = orgRow(a.order ?? 0);
    const rowB = orgRow(b.order ?? 0);
    if (rowA !== rowB) return rowA - rowB;
    const colA = orgCol(a.order ?? 0);
    const colB = orgCol(b.order ?? 0);
    if (colA !== colB) return colA - colB;
    return a.nameFr.localeCompare(b.nameFr, "fr");
  });

  const rowMap = sorted.reduce<Record<number, TeamMember[]>>((acc, m) => {
    const key = orgRow(m.order ?? 0);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const levels = Object.keys(rowMap).map(Number).sort((a, b) => a - b);

  return (
    <div className="mt-12 overflow-x-auto pb-6">
      <div className="flex min-w-fit flex-col items-center gap-6 mx-auto">
        {levels.map((level) => (
          <div key={level} className="flex items-center justify-center gap-4 flex-wrap">
            {rowMap[level].map((m) => (
              <OrgCard key={m.id} member={m} locale={locale} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) ?? "fr";
  const page = await getLaFmaContent();
  return {
    title: `${page.heroTitle[l]} | FMA`,
    description: page.heroSubtitle[l],
  };
}

export default async function FMAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  const [pageData, content] = await Promise.all([getLaFmaPageData(), getLaFmaContent()]);
  const { members, direction: allTeam, comiteDirecteur, statsImageUrl } = pageData;

  return (
    <SectionBackground id="la-fma">
      <PageHero locale={l}>
        <PageHeroImage src={statsImageUrl} alt={content.heroTitle[l]} />
      </PageHero>

      <LaFmaPresentationSection
        locale={l}
        title={content.presentationTitle[l]}
        bodyHtml={content.presentationP1[l]}
        stats={content.stats}
      />

      <LaFmaMissionsSection
        locale={l}
        title={content.missionsSectionTitle[l]}
        missions={content.missions}
      />

      {/* Organisation */}
      {(() => {
        const orgBlocs = content.orgBlocs?.length ? content.orgBlocs : DEFAULT_LA_FMA_CONTENT.orgBlocs;
        const orgTitle = content.organisationSectionTitle ?? DEFAULT_LA_FMA_CONTENT.organisationSectionTitle;
        return (
          <LaFmaOrganisationSection locale={l} title={orgTitle[l]} blocs={orgBlocs} />
        );
      })()}

      {/* Comité Directeur */}
      {comiteDirecteur.length > 0 && (
        <Section>
            <SectionHeader
              title={COMITE_DIRECTEUR_SECTION_TITLE[l]}
              longTitle
              className="mb-8 lg:mb-10"
            />
            <ComiteDirecteurBoard members={comiteDirecteur} locale={l} />
        </Section>
      )}

      {/* Valeurs */}
      {(() => {
        const valeurs = content.valeurs?.length ? content.valeurs : DEFAULT_LA_FMA_CONTENT.valeurs;
        const valeursTitle = content.valeursSectionTitle ?? DEFAULT_LA_FMA_CONTENT.valeursSectionTitle;
        const valeursDesc = content.valeursDescription ?? DEFAULT_LA_FMA_CONTENT.valeursDescription;
        return (
          <LaFmaValeursSection
            locale={l}
            title={valeursTitle[l]}
            description={valeursDesc[l] || undefined}
            valeurs={valeurs}
          />
        );
      })()}

      {/* Équipe — organigramme hiérarchique */}
      {allTeam.length > 0 && (
        <Section>
            <SectionHeader
              title={l === "ar" ? "الفريق التشغيلي" : l === "en" ? "The Operational Team" : "L'Équipe Opérationnelle"}
            />
            <OrgChart members={allTeam} locale={l} />
        </Section>
      )}

      {/* Membres */}
      {members.length > 0 && (() => {
        const grouped = members.reduce<Record<string, Member[]>>((acc, m) => {
          const cat = m.category?.trim() || "Autres";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(m);
          return acc;
        }, {});
        const categories = Object.keys(grouped).sort((a, b) => {
          const orderA = Math.min(...grouped[a].map((m) => m.order));
          const orderB = Math.min(...grouped[b].map((m) => m.order));
          return orderA - orderB;
        });
        const hasCategories = categories.length > 1 || (categories.length === 1 && categories[0] !== "Autres");
        return (
          <Section>
              <SectionHeader title={content.membersSectionTitle[l]} />
              <div className="mt-12 space-y-12">
                {categories.map((cat) => (
                  <div key={cat}>
                    {hasCategories && (
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 text-center">{cat}</h3>
                    )}
                    <div className="la-fma-members-grid">
                      {grouped[cat].map((member) => {
                        const memberName =
                          l === "ar"
                            ? member.nameAr || member.nameFr
                            : l === "en"
                              ? member.nameEn || member.nameFr
                              : member.nameFr;
                        return (
                        <div
                          key={member.id}
                          className="la-fma-team-card la-fma-member-card"
                        >
                          <div className="la-fma-team-card__content la-fma-member-card__content">
                          {member.logo ? (
                            <div className="la-fma-member-card__logo">
                              <Image
                                src={member.logo}
                                alt={memberName}
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 33vw, 320px"
                                unoptimized={member.logo.startsWith("/uploads")}
                              />
                            </div>
                          ) : (
                            <span className="flex flex-1 items-center justify-center text-center text-sm font-medium leading-tight text-[var(--text-3)]">
                              {memberName}
                            </span>
                          )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
          </Section>
        );
      })()}
    </SectionBackground>
  );
}
