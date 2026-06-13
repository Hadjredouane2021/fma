import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { buttonTabInactive } from "@/lib/button-styles";
import type { Locale } from "@/types";

export default async function VocabulairePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  const terms = await prisma.glossaryTerm.findMany({ orderBy: [{ letter: "asc" }, { order: "asc" }] }).catch(() => []);
  type TermRow = { id: string; termFr: string; termEn: string | null; termAr: string | null; definitionFr: string; definitionEn: string | null; definitionAr: string | null; letter: string; order: number };
  const grouped = (terms as TermRow[]).reduce((acc: Record<string, TermRow[]>, term: TermRow) => {
    const letter = term.letter.toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <div>
      <PageHero locale={l} />
      <Section>
          {letters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
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
            <div className="text-center py-20 text-[var(--text-3)]"><div className="text-5xl mb-4">📖</div><p>{l === "ar" ? "لا توجد مصطلحات" : l === "en" ? "No terms available" : "Aucun terme disponible"}</p></div>
          ) : (
            <div className="space-y-12">
              {letters.map((letter) => (
                <div key={letter} id={`letter-${letter}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-gold">{letter}</span>
                    <div className="flex-1 h-px bg-[var(--bg-alt)]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grouped[letter].map((term) => (
                      <div key={term.id} className="glass-liquid rounded-xl p-5 card-hover">
                        <h3 className="relative z-10 font-bold text-primary mb-2 text-sm">
                          {l === "ar" ? (term.termAr || term.termFr) : l === "en" ? (term.termEn || term.termFr) : term.termFr}
                        </h3>
                        <p className="relative z-10 text-[var(--text-2)] text-sm leading-relaxed">
                          {l === "ar" ? (term.definitionAr || term.definitionFr) : l === "en" ? (term.definitionEn || term.definitionFr) : term.definitionFr}
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
