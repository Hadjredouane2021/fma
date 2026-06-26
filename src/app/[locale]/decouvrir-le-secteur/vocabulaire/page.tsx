import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { buttonTabInactive } from "@/lib/button-styles";
import type { Locale } from "@/types";
import type { Metadata } from "next";

function vocabulairePageCopy(locale: Locale) {
  if (locale === "ar") {
    return { title: "المعجم التأميني", empty: "لا توجد مصطلحات" };
  }
  if (locale === "en") {
    return { title: "Useful Vocabulary", empty: "No terms available" };
  }
  return { title: "Vocabulaire utile", empty: "Aucun terme disponible" };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const copy = vocabulairePageCopy(l);
  return { title: `${copy.title} | FMA` };
}

export default async function VocabulairePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const copy = vocabulairePageCopy(l);

  const [terms, heroRow] = await Promise.all([
    prisma.glossaryTerm.findMany({ orderBy: [{ letter: "asc" }, { order: "asc" }] }).catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.VOCABULAIRE_HERO } }).catch(() => null),
  ]);

  const heroImage = heroRow?.value?.trim() || null;

  type TermRow = {
    id: string;
    termFr: string;
    termEn: string | null;
    termAr: string | null;
    definitionFr: string;
    definitionEn: string | null;
    definitionAr: string | null;
    letter: string;
    order: number;
  };

  const grouped = (terms as TermRow[]).reduce((acc: Record<string, TermRow[]>, term: TermRow) => {
    const letter = term.letter.toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <div>
      <PageHero locale={l}>
        {heroImage ? <PageHeroImage src={heroImage} alt={copy.title} /> : null}
      </PageHero>

      <Section>
        {letters.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {letters.map((lt) => (
              <a
                key={lt}
                href={`#letter-${lt}`}
                className={cn(
                  buttonTabInactive,
                  "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[var(--brand)]",
                  "hover:border-transparent hover:bg-[var(--brand)] hover:text-white dark:hover:bg-gradient-to-br dark:hover:from-[var(--brand)] dark:hover:to-[var(--blue)]"
                )}
              >
                {lt}
              </a>
            ))}
          </div>
        )}
        {letters.length === 0 ? (
          <div className="py-20 text-center text-[var(--text-3)]">
            <div className="mb-4 text-5xl" aria-hidden>
              📖
            </div>
            <p>{copy.empty}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {letters.map((letter) => (
              <div key={letter} id={`letter-${letter}`}>
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-4xl font-bold text-gold">{letter}</span>
                  <div className="h-px flex-1 bg-[var(--bg-alt)]" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {grouped[letter].map((term) => (
                    <div key={term.id} className="glass-liquid card-hover rounded-xl p-5">
                      <h3 className="relative z-10 mb-2 text-sm font-bold text-primary">
                        {l === "ar" ? term.termAr || term.termFr : l === "en" ? term.termEn || term.termFr : term.termFr}
                      </h3>
                      <p className="relative z-10 text-sm leading-relaxed text-[var(--text-2)]">
                        {l === "ar"
                          ? term.definitionAr || term.definitionFr
                          : l === "en"
                            ? term.definitionEn || term.definitionFr
                            : term.definitionFr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
