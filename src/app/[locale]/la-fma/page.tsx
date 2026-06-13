import Image from "next/image";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { ComiteDirecteurBoard, COMITE_DIRECTEUR_SECTION_TITLE } from "@/components/common/ComiteDirecteurBoard";
import { LaFmaMissionsSection } from "@/components/common/LaFmaMissionsSection";
import { LaFmaOrganisationSection } from "@/components/common/LaFmaOrganisationSection";
import { LaFmaPresentationSection } from "@/components/common/LaFmaPresentationSection";
import { LaFmaValeursSection } from "@/components/common/LaFmaValeursSection";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { getLaFmaContent } from "@/lib/site-content";
import { DEFAULT_LA_FMA_CONTENT } from "@/lib/la-fma-site-public";
import { cn } from "@/lib/utils";
import type { Locale, TeamMember, Member } from "@/types";
import type { Metadata } from "next";

const laFmaFlatCard =
  "rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-none";
const laFmaFlatCardSm =
  "rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-none";

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
      className={cn(laFmaFlatCardSm, "flex min-h-[112px] w-[360px] shrink-0 flex-col items-center justify-center px-6 py-6 text-center")}
    >
      <p className="text-[15px] font-bold leading-snug text-[var(--text-1)]">{name}</p>
      {title ? <p className="mt-2.5 text-[14px] leading-snug text-[var(--blue)]">{title}</p> : null}
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
          <div key={level} className="flex items-start justify-center gap-4 flex-wrap">
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

  const [members, allTeam, comiteDirecteur, content, statsImageRow] = await Promise.all([
    prisma.member.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
    prisma.teamMember.findMany({ where: { active: true, department: "direction" }, orderBy: { order: "asc" } }).catch(() => []),
    prisma.teamMember.findMany({ where: { active: true, department: "comite_directeur" }, orderBy: [{ order: "asc" }, { nameFr: "asc" }] }).catch(() => []),
    getLaFmaContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.LA_FMA_STATS_IMAGE } }).catch(() => null),
  ]);

  const statsImageUrl = statsImageRow?.value?.trim() || "/hero4.PNG";

  return (
    <div>
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
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                      {grouped[cat].map((member) => (
                        <div
                          key={member.id}
                          className={cn(laFmaFlatCardSm, "flex h-32 flex-col p-4")}
                        >
                          {member.logo ? (
                            <div className="relative min-h-0 w-full flex-1">
                              <Image
                                src={member.logo}
                                alt={member.nameFr}
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                              />
                            </div>
                          ) : (
                            <span className="flex flex-1 items-center justify-center text-center text-sm font-medium leading-tight text-[var(--text-3)]">
                              {member.nameFr}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
          </Section>
        );
      })()}
    </div>
  );
}
