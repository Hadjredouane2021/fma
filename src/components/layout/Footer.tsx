"use client";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, ArrowUpRight, ChevronDown } from "lucide-react";
import type { Locale } from "@/types";
import type { FooterContent } from "@/lib/footer-site-public";
import { footerPhoneTelHref, parseFooterPhones } from "@/lib/footer-site-public";
import { resolveLogoHref, type SiteLogoSettings } from "@/lib/site-logo";
import { SiteLogoFromSettings } from "@/components/common/SiteLogo";
import { resolveHref, type MenuContent, type MenuItem } from "@/lib/menu-site-public";
import { cn } from "@/lib/utils";
import { sectionBgClassName } from "@/lib/section-backgrounds";

/* ── Social icons ── */
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const TwIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm0 1.9A3.9 3.9 0 0 0 3.9 7.8v8.4a3.9 3.9 0 0 0 3.9 3.9h8.4a3.9 3.9 0 0 0 3.9-3.9V7.8a3.9 3.9 0 0 0-3.9-3.9H7.8zm9.65 1.525a1.275 1.275 0 1 1 0 2.55 1.275 1.275 0 0 1 0-2.55zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  f: <FbIcon />,
  in: <LiIcon />,
  X: <TwIcon />,
  ig: <IgIcon />,
  "▶": <YtIcon />,
};

const socialBtnClass: Record<string, string> = {
  f: "site-footer__icon-btn--facebook",
  in: "site-footer__icon-btn--linkedin",
  X: "site-footer__icon-btn--x",
  ig: "site-footer__icon-btn--instagram",
  "▶": "site-footer__icon-btn--youtube",
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
          className="site-footer__link site-footer__nav-link group flex items-center gap-2 font-medium"
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
        className="site-footer__link site-footer__nav-link group flex items-center justify-between w-full gap-2 font-medium"
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
        style={{ maxHeight: open ? `${item.children.length * 2.75}rem` : "0" }}
      >
        <ul className="site-footer__sub-border mt-1 ml-3 pl-3 border-l space-y-1 pb-1">
          {item.children.map((child) => {
            const childLabel = locale === "ar" ? child.labelAr : locale === "en" ? child.labelEn : child.labelFr;
            const childHref = resolveHref(child.href, locale);
            return (
              <li key={child.id}>
                <Link
                  href={childHref}
                  className="site-footer__link site-footer__nav-link site-footer__nav-link--sub group/sub flex items-center gap-2 font-medium py-0.5 opacity-80 hover:opacity-100"
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

  const social = [
    { key: "f",  label: "Facebook",  href: footerContent.facebook },
    { key: "in", label: "LinkedIn",  href: footerContent.linkedin },
    { key: "X",  label: "Twitter/X", href: footerContent.twitter },
    { key: "ig", label: "Instagram", href: footerContent.instagram },
    { key: "▶",  label: "YouTube",   href: footerContent.youtube },
  ].filter((s) => s.href);

  const logoHref = resolveLogoHref(siteLogo.linkUrl, locale);

  /* Split menu items: first col = items 0–2, second col = items 3–end */
  const items = menuContent.items;
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);
  const phones = parseFooterPhones(footerContent.phone);

  const logoImageClassName = "site-footer__logo-img transition-opacity duration-200";

  return (
    <footer className={cn("site-footer", sectionBgClassName("footer"), "bg-transparent")}>
      <div className="site-footer__accent-line" aria-hidden />

      {/* ── Main grid ── */}
      <div className="relative container-custom site-footer__container">
        <div className="site-footer__grid">

          {/* Brand col */}
          <div className="site-footer__brand site-footer__brand-col">
            <Link href={logoHref} className="block group/logo w-full max-w-full">
              <span className="site-logo-plate site-footer__logo-plate inline-flex max-w-full p-2.5 sm:p-3">
                <SiteLogoFromSettings
                  settings={siteLogo}
                  frameClassName="site-logo-frame site-logo-frame--footer max-w-full"
                  imageClassName={logoImageClassName}
                  sizes="(max-width: 640px) 176px, (max-width: 1280px) 208px, 288px"
                />
              </span>
            </Link>

            {/* Social */}
            {social.length > 0 && (
              <div className="site-footer__social">
                {social.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn("site-footer__icon-btn", socialBtnClass[s.key])}
                  >
                    {socialIcons[s.key] ?? <span className="text-xs font-bold">{s.key}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation col 1 */}
          <div className="site-footer__nav-col site-footer__nav-col--primary">
            <p className="site-footer__section-title">
              {locale === "ar" ? "التنقل" : locale === "en" ? "Navigation" : "Navigation"}
            </p>
            <ul className="site-footer__nav-list">
              {col1.map((item) => (
                <FooterAccordion key={item.id} item={item} locale={locale} />
              ))}
            </ul>
          </div>

          {/* Navigation col 2 */}
          <div className="site-footer__nav-col site-footer__nav-col--secondary">
            <p className="site-footer__section-title">
              {locale === "ar" ? "روابط مفيدة" : locale === "en" ? "Useful links" : "Liens utiles"}
            </p>
            <ul className="site-footer__nav-list">
              {col2.map((item) => (
                <FooterAccordion key={item.id} item={item} locale={locale} />
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="site-footer__contact site-footer__contact-col min-w-0">
            <p className="site-footer__section-title">Contact</p>
            <ul className="site-footer__contact-list">
              {footerContent.address && (
                <li className="site-footer__contact-item">
                  <MapPin className="site-footer__contact-icon" />
                  <span className="site-footer__contact-text site-footer__muted leading-relaxed" style={{ whiteSpace: "pre-line" }}>{footerContent.address}</span>
                </li>
              )}
              {phones.length > 0 && (
                <li className="site-footer__contact-item site-footer__contact-phones">
                  <Phone className="site-footer__contact-icon" aria-hidden />
                  <div className="site-footer__phone-list">
                    {phones.map((phone, index) => (
                      <a
                        key={`${phone}-${index}`}
                        href={footerPhoneTelHref(phone)}
                        className="site-footer__phone-link site-footer__contact-text site-footer__link leading-relaxed"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
              )}
              {footerContent.email && (
                <li>
                  <a href={`mailto:${footerContent.email}`} className="site-footer__contact-link group">
                    <Mail className="site-footer__contact-icon" />
                    <span className="site-footer__contact-text site-footer__link break-all">{footerContent.email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t site-footer__divider">
        <div className="container-custom site-footer__bottom">
          <span className="site-footer__muted site-footer__copyright opacity-70 font-medium tracking-wide">
            © {new Date().getFullYear()} Fédération Marocaine de l&apos;Assurance. {t("rights")}.
          </span>
          <div className="site-footer__legal-links">
            {[
              { label: t("legal"),   href: `/${locale}/mentions-legales` },
              { label: t("privacy"), href: `/${locale}/confidentialite` },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="site-footer__link site-footer__legal-link group inline-flex items-center gap-1 opacity-70 hover:opacity-100 tracking-wide font-medium">
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
