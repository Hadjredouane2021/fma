import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

export default async function FormationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const [formations, heroImageRow] = await Promise.all([
    prisma.formation.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ startDate: "desc" }] }).catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.FORMATIONS_HERO } }).catch(() => null),
  ]);
  const heroImage = heroImageRow?.value ?? "";
  const formatMap: Record<string, string> = { presentiel: "🏢 Présentiel", distanciel: "💻 Distanciel", hybride: "🔀 Hybride" };
  const levelColors: Record<string, string> = {
    debutant: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
    intermediaire: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    avance: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
  };

  return (
    <div>
      <PageHero locale={l}>
        {heroImage ? (
          <PageHeroImage src={heroImage} alt="Formations" />
        ) : null}
      </PageHero>
      <Section>
          {formations.length === 0 ? (
            <div className="text-center py-20 text-[var(--text-3)]"><div className="text-5xl mb-4">🎓</div><p>{l === "ar" ? "لا توجد تدريبات حالياً" : l === "en" ? "No training available" : "Aucune formation disponible"}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {formations.map((f) => {
                const title = l === "ar" ? (f.titleAr || f.titleFr) : l === "en" ? (f.titleEn || f.titleFr) : f.titleFr;
                const desc = l === "ar" ? (f.descriptionAr || f.descriptionFr || "") : l === "en" ? (f.descriptionEn || f.descriptionFr || "") : (f.descriptionFr || "");
                return (
                  <div key={f.id} className="glass-liquid rounded-2xl p-6 card-hover">
                    <div className="relative z-10 flex items-start justify-between mb-3">
                      <h3 className="text-base font-bold text-primary leading-snug">{title}</h3>
                      {f.level && <span className={`ml-3 px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${levelColors[f.level] || "bg-[var(--bg-alt)] text-[var(--text-2)]"}`}>{f.level}</span>}
                    </div>
                    {desc && <div className="relative z-10 prose-fma text-sm mb-4" dangerouslySetInnerHTML={{ __html: desc }} />}
                    <div className="relative z-10 flex flex-wrap gap-3 mb-4">
                      {f.startDate && <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]"><Calendar className="w-3.5 h-3.5 text-gold" />{formatDate(f.startDate, l)}</span>}
                      {f.location && <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]"><MapPin className="w-3.5 h-3.5 text-gold" />{f.location}</span>}
                      {f.duration && <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]"><Clock className="w-3.5 h-3.5 text-gold" />{f.duration}</span>}
                      {f.format && <span className="text-xs text-[var(--text-2)]">{formatMap[f.format] || f.format}</span>}
                    </div>
                    {f.registrationUrl && (
                      <a href={f.registrationUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold transition-colors">
                        {l === "ar" ? "التسجيل" : l === "en" ? "Register" : "S'inscrire"} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </Section>
    </div>
  );
}
