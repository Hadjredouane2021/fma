"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { resolveHref, type MenuContent } from "@/lib/menu-site-public";
import { resolveLogoHref, type SiteLogoSettings } from "@/lib/site-logo";
import { SiteLogoFromSettings } from "@/components/common/SiteLogo";
import { Link as LocaleLink, usePathname } from "@/i18n/navigation";
import { buildLocaleSwitchHref } from "@/i18n/locale-switch";
import type { Locale } from "@/types";

const localeLabels: Record<string, string> = { fr: "FR", en: "EN", ar: "ع" };
const localeFlags: Record<string, string> = { fr: "🇫🇷", en: "🇬🇧", ar: "🇲🇦" };
const localeNames: Record<string, string> = { fr: "Français", en: "English", ar: "العربية" };
const locales: Locale[] = ["fr", "en", "ar"];

export default function Header({
  locale,
  menuContent,
  siteLogo,
}: {
  locale: Locale;
  menuContent: MenuContent;
  siteLogo: SiteLogoSettings;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const localeHref = (target: Locale) => buildLocaleSwitchHref(target, pathname, searchParams);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else {
      document.body.style.overflow = "";
      setMobileLangOpen(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const label = (item: { labelFr: string; labelEn: string; labelAr: string }) =>
    locale === "ar" ? item.labelAr || item.labelFr
    : locale === "en" ? item.labelEn || item.labelFr
    : item.labelFr;

  const logoHref = resolveLogoHref(siteLogo.linkUrl, locale);
  const isRtl = locale === "ar";

  return (
    <>
      <header
        className={cn(
          "site-header-glass-3d fixed top-0 left-0 right-0 z-[100] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
          scrolled ? "site-header-scrolled" : "site-header-idle"
        )}
      >
        <div className="site-header-deco" aria-hidden />

        {/* Logo — ancré sur le header, bord gauche de l'écran */}
        <Link
          href={logoHref}
          prefetch
          className="absolute left-3 top-1/2 z-[60] flex -translate-y-1/2 items-center sm:left-4 lg:left-6 group/logo"
        >
          <SiteLogoFromSettings
            settings={siteLogo}
            priority
            frameClassName="site-logo-frame site-logo-frame--header"
            imageClassName="transition-opacity duration-200 group-hover/logo:opacity-90"
            sizes="(max-width: 640px) 152px, (max-width: 1280px) 176px, 240px"
          />
        </Link>

        {/* Recherche + langue + thème — desktop xl+ */}
        <div className="site-header-actions">
          <LocaleLink
            href="/recherche"
            prefetch
            aria-label={t("search")}
            className="flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--hover-bg)] transition-all duration-200"
          >
            <Search className="h-4 w-4" />
          </LocaleLink>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              className="site-header-lang-btn"
              aria-label={localeNames[locale]}
            >
              <span>{localeFlags[locale]}</span>
              <span className="site-header-lang-code">{localeLabels[locale]}</span>
              <ChevronDown className={cn("h-3 w-3 opacity-40 transition-transform duration-150", langOpen && "rotate-180")} />
            </button>
            <div
              className={cn(
                "absolute top-full right-0 pt-1 z-[80]",
                "transition-[opacity,visibility] duration-100",
                langOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
              )}
            >
              <div className="site-header-dropdown relative overflow-hidden rounded-xl min-w-[150px]">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand)] via-[var(--mauve)] to-[var(--blue)]" />
                <div className="p-1.5 pt-2.5">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={localeHref(l)}
                      onClick={() => setLangOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-100",
                        locale === l
                          ? "text-[var(--text-1)] bg-[var(--hover-bg)] font-semibold"
                          : "text-[var(--text-2)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)]"
                      )}
                    >
                      <span className="text-base leading-none">{localeFlags[l]}</span>
                      <span>{localeNames[l]}</span>
                      {locale === l && <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ThemeToggle compact />
        </div>

        {/* ── NAV BAR (pleine largeur, menu centré entre logo et actions) ── */}
        <div className="site-header-bar" dir={isRtl ? "rtl" : "ltr"}>
          <nav className="site-header-nav" aria-label="Navigation principale">
              {menuContent.items.map((item) => (
                <div
                  key={item.id}
                  className={cn("relative shrink-0 z-[1]", item.children.length > 0 && "group/navdropdown")}
                >
                  <Link
                    href={resolveHref(item.href, locale)}
                    prefetch
                    className="site-header-nav-link"
                  >
                    <span className="site-header-nav-label">
                      {label(item)}
                    </span>
                    {item.children.length > 0 && (
                      <ChevronDown className="h-3 w-3 shrink-0 opacity-40 transition-transform duration-150 group-hover/navdropdown:rotate-180 group-hover/navdropdown:opacity-70" />
                    )}
                  </Link>

                  {item.children.length > 0 && (
                    <div
                      className={cn(
                        "absolute top-full left-1/2 z-[80] w-[min(100vw-2rem,18rem)] -translate-x-1/2 pt-1",
                        "pointer-events-none invisible opacity-0",
                        "transition-[opacity,visibility] duration-100",
                        "group-hover/navdropdown:pointer-events-auto group-hover/navdropdown:visible group-hover/navdropdown:opacity-100"
                      )}
                    >
                      <div className="site-header-dropdown relative overflow-hidden rounded-2xl">
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand)] via-[var(--mauve)] to-[var(--blue)]" />
                        <div className="p-2 pt-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={resolveHref(child.href, locale)}
                              prefetch
                              className="group/dd flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[var(--text-2)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)] transition-colors duration-100"
                            >
                              <span>{label(child)}</span>
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/dd:opacity-40 transition-opacity -translate-y-0.5 translate-x-0.5 rtl:-translate-x-0.5" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </nav>

          {/* Tablette / mobile : recherche + menu */}
          <div className="ms-auto flex flex-shrink-0 items-center gap-1.5 xl:hidden">
            <LocaleLink
              href="/recherche"
              prefetch
              aria-label={t("search")}
              className="p-2.5 rounded-xl text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--hover-bg)] transition-all duration-200"
            >
              <Search className="w-[17px] h-[17px]" />
            </LocaleLink>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="ml-1 p-2 rounded-xl text-[var(--text-2)] hover:bg-[var(--hover-bg)] transition-colors"
              aria-expanded={isOpen}
              aria-label="Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />
      {/* Drawer panel */}
      <div
        className={cn(
          "site-header-drawer fixed top-0 right-0 bottom-0 z-50 flex w-[min(88vw,360px)] flex-col xl:hidden",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="site-header-drawer-head flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-2.5">
            <SiteLogoFromSettings
              settings={siteLogo}
              variant="dark"
              frameClassName="site-logo-frame site-logo-frame--header"
              imageClassName="transition-opacity duration-200"
              sizes="280px"
            />
            <span className="text-white font-semibold text-sm">Menu</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="relative p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" dir={isRtl ? "rtl" : "ltr"}>
          {menuContent.items.map((item) => (
            <div key={item.id} className="mb-0.5">
              {item.children.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold text-[var(--text-1)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    {label(item)}
                    <ChevronDown className={cn("w-4 h-4 text-[var(--text-3)] transition-transform duration-200", mobileExpanded === item.id && "rotate-180")} />
                  </button>
                    <div className={cn("overflow-hidden transition-all duration-200", mobileExpanded === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                    <div className="ms-3 ps-3 border-s border-[var(--border)] py-1 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={resolveHref(child.href, locale)}
                          prefetch
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--hover-bg)] transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-[var(--fma-taupe)] flex-shrink-0" />
                          {label(child)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={resolveHref(item.href, locale)}
                  prefetch
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-[14px] font-semibold text-[var(--text-1)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  {label(item)}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMobileLangOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMobileLangOpen(false), 150)}
                className="site-header-lang-btn"
                aria-label={localeNames[locale]}
                aria-expanded={mobileLangOpen}
              >
                <span>{localeFlags[locale]}</span>
                <span className="site-header-lang-code">{localeLabels[locale]}</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 opacity-40 transition-transform duration-150",
                    mobileLangOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "absolute bottom-full left-0 z-[80] mb-1 pb-1",
                  "transition-[opacity,visibility] duration-100",
                  mobileLangOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
              >
                <div className="site-header-dropdown relative overflow-hidden rounded-xl min-w-[150px]">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand)] via-[var(--mauve)] to-[var(--blue)]" />
                  <div className="p-1.5 pt-2.5">
                    {locales.map((l) => (
                      <Link
                        key={l}
                        href={localeHref(l)}
                        onClick={() => {
                          setMobileLangOpen(false);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-100",
                          locale === l
                            ? "text-[var(--text-1)] bg-[var(--hover-bg)] font-semibold"
                            : "text-[var(--text-2)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)]"
                        )}
                      >
                        <span className="text-base leading-none">{localeFlags[l]}</span>
                        <span>{localeNames[l]}</span>
                        {locale === l && (
                          <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <ThemeToggle compact />
          </div>
        </div>
      </div>
    </>
  );
}
