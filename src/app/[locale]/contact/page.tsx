import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { Section } from "@/components/ui/Section";
import ContactForm from "./_components/ContactForm";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { getContactContent } from "@/lib/contact-site-public";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const content = await getContactContent();
  return { title: `${content.heroTitle[l]} | FMA` };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const [t, content, heroRow] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getContactContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.CONTACT_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value?.trim() || null;

  const infos = [
    { icon: MapPin, label: t("address"), value: content.address },
    { icon: Phone, label: t("phone_label"), value: content.phone },
    { icon: Mail, label: t("email_label"), value: content.email },
    { icon: Clock, label: t("hours"), value: content.hours[l] },
  ];

  return (
    <div>
      <PageHero locale={l}>
        {heroImage && <PageHeroImage src={heroImage} alt={content.heroTitle[l]} />}
      </PageHero>

      <Section containerClassName="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {infos.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-liquid rounded-2xl p-5 flex gap-4 card-hover">
              <div className="relative z-10 glass-panel w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="relative z-10">
                <p className="text-xs text-[var(--text-3)] font-semibold uppercase tracking-wide mb-1">{label}</p>
                <p className="text-[var(--text-1)] font-medium text-sm whitespace-pre-line">{value}</p>
              </div>
            </div>
          ))}

          {content.mapEmbedUrl ? (
            <div className="glass-liquid rounded-2xl overflow-hidden h-52 card-hover">
              <iframe
                src={content.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="FMA Location"
              />
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-3">
          <div className="glass-liquid rounded-2xl p-8 card-hover">
            <h2 className="relative z-10 text-xl font-bold text-primary mb-7">{content.formTitle[l]}</h2>
            <div className="relative z-10">
              <ContactForm locale={l} />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
