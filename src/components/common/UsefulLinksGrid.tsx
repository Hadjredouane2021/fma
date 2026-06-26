import Image from "next/image";
import { Link2 } from "lucide-react";
import type { Locale } from "@/types";
import { localPublicImageUnoptimized } from "@/lib/utils";

export type UsefulLinkItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  logo?: string | null;
};

export function usefulLinksPageCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      title: "الموارد والخدمات",
      subtitle: "الوصول إلى المنصات والوثائق المفيدة",
      empty: "لا توجد روابط",
    };
  }
  if (locale === "en") {
    return {
      title: "Resources and services",
      subtitle: "Access useful platforms and documents",
      empty: "No links available",
    };
  }
  return {
    title: "Ressources et services",
    subtitle: "Accédez aux plateformes et documents utiles",
    empty: "Aucun lien disponible",
  };
}

export function UsefulLinksGrid({ links, locale }: { links: UsefulLinkItem[]; locale: Locale }) {
  const copy = usefulLinksPageCopy(locale);

  return (
    <div className="useful-links-grid">
      {links.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-3)]">
          <div className="mb-4 text-5xl" aria-hidden>
            🔗
          </div>
          <p>{copy.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {links.map((link) => {
            const logo = link.logo?.trim() || "";
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="useful-links-card group flex items-center gap-4 rounded-2xl p-5"
              >
                <div className="useful-links-card__logo relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  {logo ? (
                    <Image
                      src={logo}
                      alt=""
                      fill
                      className="object-contain object-center p-1.5"
                      sizes="56px"
                      unoptimized={localPublicImageUnoptimized(logo)}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[var(--text-3)]" aria-hidden>
                      <Link2 className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold leading-snug text-[var(--text-1)] transition-colors group-hover:text-[var(--brand)] sm:text-[1.0625rem]">
                    {link.title}
                  </h2>
                  {link.description ? (
                    <p className="mt-1 text-sm leading-snug text-[var(--text-2)] line-clamp-2 dark:text-[var(--text-3)]">
                      {link.description}
                    </p>
                  ) : null}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
