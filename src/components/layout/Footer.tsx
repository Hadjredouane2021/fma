"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, ArrowUpRight, ChevronDown } from "lucide-react";
import type { Locale } from "@/types";
import type { FooterContent } from "@/lib/footer-site-public";
import { resolveLogoHref, siteLogoImageUnoptimized, DEFAULT_SITE_LOGO, type SiteLogoSettings } from "@/lib/site-logo";
import { resolveHref, type MenuContent, type MenuItem } from "@/lib/menu-site-public";

/* ── Social icons ── */
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const TwIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  f: <FbIcon />, in: <LiIcon />, X: <TwIcon />, "▶": <YtIcon />,
};

/* ── Accordion item for menu entries with children ── */
function FooterAccordion({ item, locale }: { item: MenuItem; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const label = locale === "ar" ? item.labelAr : locale === "en" ? item.labelEn : item.labelFr;
  const hasChildren = item.children.length > 0;

  if (!hasChildren) {
    const href = resolveHref(item.href, locale);
    return (
      <li>
        <Link
          href={href}
          className="site-footer__link group flex items-center gap-2 text-[13px] font-medium py-1"
        >
          <span className="site-footer__marker w-px h-3 flex-shrink-0 rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="site-footer__link group flex items-center justify-between w-full gap-2 text-[13px] font-medium py-1"
      >
        <span className="flex items-center gap-2">
          <span className={`site-footer__marker w-px h-3 flex-shrink-0 rounded-full transition-opacity duration-200 ${open ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`} />
          {label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 opacity-50 group-hover:opacity-80 ${open ? "rotate-180 opacity-90" : ""}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${item.children.length * 2.5}rem` : "0" }}
      >
        <ul className="site-footer__sub-border mt-1 ml-3 pl-3 border-l space-y-1 pb-1">
          {item.children.map((child) => {
            const childLabel = locale === "ar" ? child.labelAr : locale === "en" ? child.labelEn : child.labelFr;
            const childHref = resolveHref(child.href, locale);
            return (
              <li key={child.id}>
                <Link
                  href={childHref}
                  className="site-footer__link group/sub flex items-center gap-2 text-[12px] font-medium py-0.5 opacity-80 hover:opacity-100"
                >
                  <span className="site-footer__marker w-1 h-1 rounded-full flex-shrink-0 opacity-50 group-hover/sub:opacity-100 transition-opacity" />
                  {childLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

/* ── Main Footer ── */
export default function Footer({
  locale,
  footerContent,
  siteLogo,
  menuContent,
}: {
  locale: Locale;
  footerContent: FooterContent;
  siteLogo: SiteLogoSettings;
  menuContent: MenuContent;
}) {
  const t = useTranslations("footer");

  const description =
    locale === "ar" ? footerContent.descriptionAr
    : locale === "en" ? footerContent.descriptionEn
    : footerContent.descriptionFr;

  const social = [
    { key: "f",  label: "Facebook",  href: footerContent.facebook },
    { key: "in", label: "LinkedIn",  href: footerContent.linkedin },
    { key: "X",  label: "Twitter/X", href: footerContent.twitter },
    { key: "▶",  label: "YouTube",   href: footerContent.youtube },
  ].filter((s) => s.href);

  const logoHref = resolveLogoHref(siteLogo.linkUrl, locale);
  const isDefaultLogo = siteLogo.imageUrl === DEFAULT_SITE_LOGO.imageUrl;
  const logoLightSrc = isDefaultLogo ? "/logo-fma-light.png" : siteLogo.imageUrl;
  const logoDarkSrc = isDefaultLogo ? "/logo-fma-dark.png" : siteLogo.imageUrl;

  /* Split menu items: first col = items 0–2, second col = items 3–end */
  const items = menuContent.items;
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.035]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        aria-hidden
      />
      <div className="site-footer__accent-line" aria-hidden />

      {/* ── Main grid ── */}
      <div className="relative container-custom pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-10 xl:gap-8">

          {/* Brand col */}
          <div className="xl:col-span-4 space-y-6">
            <Link href={logoHref} className="block group/logo">
              <span className="site-logo-plate p-2">
                <Image
                  src={logoLightSrc}
                  alt="Fédération Marocaine de l'Assurance"
                  width={280}
                  height={96}
                  className="block h-8 w-auto max-w-[9.5rem] object-contain object-left transition-opacity duration-200 sm:h-9 sm:max-w-[11rem] xl:h-10 xl:max-w-[13rem] 2xl:max-w-[15rem] group-hover/logo:opacity-90 dark:hidden"
                  sizes="(max-width: 640px) 152px, (max-width: 1280px) 176px, 240px"
                  unoptimized={siteLogoImageUnoptimized(logoLightSrc)}
                />
                <Image
                  src={logoDarkSrc}
                  alt="Fédération Marocaine de l'Assurance"
                  width={280}
                  height={96}
                  className="hidden h-8 w-auto max-w-[9.5rem] object-contain object-left transition-opacity duration-200 sm:h-9 sm:max-w-[11rem] xl:h-10 xl:max-w-[13rem] 2xl:max-w-[15rem] group-hover/logo:opacity-90 dark:block"
                  sizes="(max-width: 640px) 152px, (max-width: 1280px) 176px, 240px"
                  unoptimized={siteLogoImageUnoptimized(logoDarkSrc)}
                />
              </span>
            </Link>

            <p className="site-footer__muted text-[13px] leading-[1.75] max-w-[28ch]">{description}</p>

            {/* Social */}
            {social.length > 0 && (
              <div className="flex items-center gap-2">
                {social.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="site-footer__icon-btn"
                  >
                    {socialIcons[s.key] ?? <span className="text-xs font-bold">{s.key}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation col 1 */}
          <div className="xl:col-span-2">
            <p className="site-footer__muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-5">
              {locale === "ar" ? "التنقل" : locale === "en" ? "Navigation" : "Navigation"}
            </p>
            <ul className="space-y-1">
              {col1.map((item) => (
                <FooterAccordion key={item.id} item={item} locale={locale} />
              ))}
            </ul>
          </div>

          {/* Navigation col 2 */}
          <div className="xl:col-span-3">
            <p className="site-footer__muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-5">
              {locale === "ar" ? "روابط مفيدة" : locale === "en" ? "Useful links" : "Liens utiles"}
            </p>
            <ul className="space-y-1">
              {col2.map((item) => (
                <FooterAccordion key={item.id} item={item} locale={locale} />
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="xl:col-span-3">
            <p className="site-footer__muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-5">Contact</p>
            <ul className="space-y-4">
              {footerContent.address && (
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[var(--footer-accent)] flex-shrink-0 mt-0.5" />
                  <span className="site-footer__muted text-[13px] leading-relaxed" style={{ whiteSpace: "pre-line" }}>{footerContent.address}</span>
                </li>
              )}
              {footerContent.phone && (
                <li>
                  <a href={`tel:${footerContent.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 group">
                    <Phone className="w-4 h-4 text-[var(--footer-accent)] flex-shrink-0" />
                    <span className="site-footer__link text-[13px]">{footerContent.phone}</span>
                  </a>
                </li>
              )}
              {footerContent.email && (
                <li>
                  <a href={`mailto:${footerContent.email}`} className="flex items-center gap-3 group">
                    <Mail className="w-4 h-4 text-[var(--footer-accent)] flex-shrink-0" />
                    <span className="site-footer__link text-[13px] break-all">{footerContent.email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t site-footer__divider">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="site-footer__muted text-[11px] opacity-70 font-medium tracking-wide">
            © {new Date().getFullYear()} Fédération Marocaine de l&apos;Assurance. {t("rights")}.
          </span>
          <div className="flex items-center gap-6">
            {[
              { label: t("legal"),   href: `/${locale}/mentions-legales` },
              { label: t("privacy"), href: `/${locale}/confidentialite` },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="site-footer__link group inline-flex items-center gap-1 text-[11px] opacity-70 hover:opacity-100 tracking-wide font-medium">
                {label}
                <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
