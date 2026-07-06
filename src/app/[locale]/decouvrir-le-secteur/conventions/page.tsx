import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { FileText, Calendar } from "lucide-react";
import { PdfViewerLink } from "@/components/common/PdfViewerModal";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/common/PageHero";
import { SectionBackground } from "@/components/common/SectionBackground";
import { Section } from "@/components/ui/Section";
import {
  conventionsHeroImageUrl,
  parseConventionsHeroImageUrlsFromSetting,
} from "@/lib/conventions-hero-image";
import type { Locale } from "@/types";

export default async function ConventionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const [conventions, heroImageRow] = await Promise.all([
    prisma.convention.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }, { signedAt: "desc" }] }).catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.CONVENTIONS_HERO } }).catch(() => null),
  ]);
  const heroImages = parseConventionsHeroImageUrlsFromSetting(heroImageRow?.value);
  const heroImage = conventionsHeroImageUrl(heroImages, l);

  return (
    <SectionBackground id="conventions">
      <PageHero locale={l}>
        {heroImage ? (
          <PageHeroImage src={heroImage} alt="Conventions professionnelles" />
        ) : null}
      </PageHero>
      <Section>
          {conventions.length === 0 ? (
            <div className="text-center py-20 text-[var(--text-3)]"><div className="text-5xl mb-4">📋</div><p>{l === "ar" ? "لا توجد اتفاقيات" : l === "en" ? "No conventions available" : "Aucune convention disponible"}</p></div>
          ) : (
            <div className="space-y-4">
              {conventions.map((c) => {
                const title = l === "ar" ? (c.titleAr || c.titleFr) : l === "en" ? (c.titleEn || c.titleFr) : c.titleFr;
                const desc = l === "ar" ? (c.descriptionAr || c.descriptionFr || "") : l === "en" ? (c.descriptionEn || c.descriptionFr || "") : (c.descriptionFr || "");
                return (
                  <article key={c.id} className="convention-card-glass flex gap-5 p-6">
                    <div className="convention-card-glass__accent" aria-hidden />
                    <div className="convention-card-glass__icon">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="convention-card-glass__body">
                      <h3 className="font-bold text-primary text-base mb-2">{title}</h3>
                      {desc && <div className="prose-fma text-sm mb-3" dangerouslySetInnerHTML={{ __html: desc }} />}
                      <div className="flex items-center gap-4">
                        {c.signedAt && <span className="flex items-center gap-1.5 text-xs text-[var(--text-3)]"><Calendar className="w-3.5 h-3.5 text-gold" />{formatDate(c.signedAt, l)}</span>}
                        {c.category && <span className="px-2.5 py-1 bg-primary/8 text-primary text-xs rounded-full font-medium">{c.category}</span>}
                        {c.pdfFile && (
                          <PdfViewerLink
                            url={c.pdfFile}
                            title={title}
                            locale={l}
                            className="inline-flex"
                            label={l === "ar" ? "عرض PDF" : l === "en" ? "View PDF" : "Consulter le PDF"}
                          />
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </Section>
    </SectionBackground>
  );
}
