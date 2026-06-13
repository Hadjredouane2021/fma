import Link from "next/link";
import { ArrowRight, FileText, BookOpen, Link as LinkIcon, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

const SECTIONS = [
  { icon: FileText,     href: "conventions",  fr: "Conventions professionnelles", en: "Professional Conventions", ar: "الاتفاقيات المهنية", desc_fr: "Accédez aux conventions professionnelles régissant le secteur de l'assurance au Maroc.", color: "bg-primary" },
  { icon: LinkIcon,     href: "liens-utiles", fr: "Liens utiles",                 en: "Useful Links",             ar: "روابط مفيدة",        desc_fr: "Retrouvez les liens vers les principales institutions et organismes du secteur.", color: "bg-accent" },
  { icon: GraduationCap, href: "formations",  fr: "Formations",                   en: "Training",                 ar: "التدريبات",          desc_fr: "Développez vos compétences grâce à nos programmes de formation professionnelle.", color: "bg-gold" },
  { icon: BookOpen,     href: "vocabulaire",  fr: "Vocabulaire utile",             en: "Useful Vocabulary",        ar: "المعجم التأميني",    desc_fr: "Comprenez les termes techniques et le jargon du secteur de l'assurance.", color: "bg-purple-500" },
];

export default async function DecouvrirleSecteurPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <div>
      <PageHero locale={l} />
      <Section containerClassName="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={`/${locale}/decouvrir-le-secteur/${s.href}`} className="group">
                <div className="glass-liquid rounded-2xl p-8 card-hover h-full flex gap-6">
                  <div className={`relative z-10 w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-lg font-bold text-primary mb-2">{l === "ar" ? s.ar : l === "en" ? s.en : s.fr}</h2>
                    <p className="text-[var(--text-2)] text-sm leading-relaxed mb-4">{s.desc_fr}</p>
                    <span className="flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                      {l === "ar" ? "اكتشف" : l === "en" ? "Discover" : "Découvrir"} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
      </Section>
    </div>
  );
}
