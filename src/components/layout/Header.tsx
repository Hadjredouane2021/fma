"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveHref, type MenuContent, type MenuItem } from "@/lib/menu-site-public";
import { resolveLogoHref, type SiteLogoSettings } from "@/lib/site-logo";
import { LocaleFlag } from "@/components/common/LocaleFlag";
import { SiteLogoFromSettings } from "@/components/common/SiteLogo";
import { Link as LocaleLink, usePathname } from "@/i18n/navigation";
import { buildLocaleSwitchHref } from "@/i18n/locale-switch";
import type { Locale } from "@/types";

const localeNames: Record<Locale, string> = { fr: "Français", en: "English", ar: "العربية" };
const localeCodes: Record<Locale, string> = { fr: "FR", en: "EN", ar: "AR" };
const locales: Locale[] = ["fr", "en", "ar"];

function menuPath(href: string): string {
  const withoutLocale = href.replace(/^\/\[locale\]/, "") || "/";
  const path = withoutLocale.split("?")[0] || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function isPathActive(href: string, pathname: string): boolean {
  const path = menuPath(href);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isItemActive(item: MenuItem, pathname: string): boolean {
  if (isPathActive(item.href, pathname)) return true;
  return item.children.some((child) => isPathActive(child.href, pathname));
}

function LangFlags({
  locale,
  localeHref,
  onNavigate,
  dropUp = false,
}: {
  locale: Locale;
  localeHref: (target: Locale) => string;
  onNavigate?: () => void;
  dropUp?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("site-header-langs", dropUp && "is-dropup")}>
      <button
        type="button"
        className="site-header-lang-btn"
        aria-label={localeNames[locale]}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <LocaleFlag locale={locale} className="site-header-lang-flag__img" />
        <span className="site-header-lang-code">{localeCodes[locale]}</span>
        <ChevronDown className={cn("site-header-lang-caret", open && "is-open")} />
      </button>
      <div className={cn("site-header-lang-menu", open && "is-open")} role="listbox" aria-label="Langue">
        {locales.map((l) => (
          <Link
            key={l}
            href={localeHref(l)}
            hrefLang={l}
            role="option"
            aria-selected={locale === l}
            aria-label={localeNames[l]}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className={cn("site-header-lang-option", locale === l && "is-active")}
          >
            <LocaleFlag locale={l} className="site-header-lang-flag__img" />
            <span className="site-header-lang-option-code">{localeCodes[l]}</span>
            <span className="site-header-lang-option-name">{localeNames[l]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
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

        <div className="site-header-actions">
          <LocaleLink
            href="/recherche"
            prefetch
            aria-label={t("search")}
            className="site-header-icon-btn"
          >
            <Search className="h-4 w-4" />
          </LocaleLink>
          <span className="site-header-actions-sep" aria-hidden />
          <LangFlags locale={locale} localeHref={localeHref} />
        </div>

        <div className="site-header-bar" dir={isRtl ? "rtl" : "ltr"}>
          <nav className="site-header-nav" aria-label="Navigation principale">
            <div className="site-header-nav-shell">
              {menuContent.items.map((item) => {
                const active = isItemActive(item, pathname);
                const hasChildren = item.children.length > 0;
                const isCta = item.id === "contact";

                return (
                  <div
                    key={item.id}
                    className={cn("site-header-nav-item", hasChildren && "has-submenu")}
                  >
                    <Link
                      href={resolveHref(item.href, locale)}
                      prefetch
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "site-header-nav-link",
                        isCta && "site-header-nav-link--cta",
                        active && "is-active"
                      )}
                    >
                      <span className="site-header-nav-label">{label(item)}</span>
                      {hasChildren && (
                        <ChevronDown className="site-header-nav-caret" aria-hidden />
                      )}
                    </Link>

                    {hasChildren && (
                      <div className="site-header-submenu">
                        <div className="site-header-dropdown">
                          <div className="site-header-dropdown__accent" aria-hidden />
                          <p className="site-header-dropdown__kicker">{label(item)}</p>
                          <div className="site-header-dropdown__list">
                            {item.children.map((child) => {
                              const childActive = isPathActive(child.href, pathname);
                              return (
                                <Link
                                  key={child.id}
                                  href={resolveHref(child.href, locale)}
                                  prefetch
                                  aria-current={childActive ? "page" : undefined}
                                  className={cn(
                                    "site-header-dropdown__link",
                                    childActive && "is-active"
                                  )}
                                >
                                  <span>{label(child)}</span>
                                  <ArrowUpRight className="site-header-dropdown__icon" aria-hidden />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="ms-auto flex flex-shrink-0 items-center gap-1.5 xl:hidden">
            <LangFlags locale={locale} localeHref={localeHref} />
            <LocaleLink
              href="/recherche"
              prefetch
              aria-label={t("search")}
              className="site-header-icon-btn"
            >
              <Search className="w-[17px] h-[17px]" />
            </LocaleLink>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="site-header-menu-btn"
              aria-expanded={isOpen}
              aria-label="Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />
      <div
        className={cn(
          "site-header-drawer fixed top-0 right-0 bottom-0 z-50 flex w-[min(88vw,360px)] flex-col xl:hidden",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
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

        <nav className="flex-1 overflow-y-auto py-5 px-3" dir={isRtl ? "rtl" : "ltr"}>
          {menuContent.items.map((item) => {
            const active = isItemActive(item, pathname);
            const isCta = item.id === "contact";
            return (
              <div key={item.id} className="mb-1">
                {item.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                      className={cn(
                        "site-header-drawer-link w-full",
                        active && "is-active"
                      )}
                    >
                      {label(item)}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-current/50 transition-transform duration-200",
                          mobileExpanded === item.id && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        mobileExpanded === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="ms-3 mt-1 space-y-0.5 border-s border-[var(--border)] py-1 ps-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={resolveHref(child.href, locale)}
                            prefetch
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "site-header-drawer-sublink",
                              isPathActive(child.href, pathname) && "is-active"
                            )}
                          >
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
                    className={cn(
                      "site-header-drawer-link",
                      isCta && "site-header-drawer-link--cta",
                      active && "is-active"
                    )}
                  >
                    {label(item)}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
