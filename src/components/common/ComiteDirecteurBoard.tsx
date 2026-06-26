import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale, TeamMember } from "@/types";

export const COMITE_DIRECTEUR_SECTION_TITLE: Record<Locale, string> = {
  fr: "Le Comité Directeur est constitué actuellement comme suit :",
  en: "The Board of Directors is currently composed as follows:",
  ar: "يتكون المجلس التوجيهي حالياً على النحو التالي:",
};

function localizedName(member: TeamMember, locale: Locale) {
  return locale === "ar"
    ? member.nameAr || member.nameFr
    : locale === "en"
      ? member.nameEn || member.nameFr
      : member.nameFr;
}

function localizedTitle(member: TeamMember, locale: Locale) {
  return locale === "ar"
    ? member.titleAr || member.titleFr || ""
    : locale === "en"
      ? member.titleEn || member.titleFr || ""
      : member.titleFr || "";
}

function getGroupLabel(members: TeamMember[], locale: Locale) {
  if (members.length === 1) {
    const title = localizedTitle(members[0], locale);
    return title ? title.toUpperCase() : "";
  }

  const sample = localizedTitle(members[0], locale).toLowerCase();
  if (sample.includes("vice-président") || sample.includes("vice-president") || sample.includes("vice president")) {
    return locale === "ar" ? "نواب الرئيس" : locale === "en" ? "VICE PRESIDENTS" : "LES VICE-PRÉSIDENTS";
  }
  if (sample.includes("assesseur") || sample.includes("assessor")) {
    return locale === "ar" ? "المقيّمون" : locale === "en" ? "ASSESSORS" : "LES ASSESSEURS";
  }

  const base = localizedTitle(members[0], locale).toUpperCase();
  if (base.startsWith("LES ")) return base;
  return `LES ${base}${base.endsWith("S") ? "" : "S"}`;
}

function groupMembers(members: TeamMember[]) {
  const rowMap = members.reduce<Record<number, TeamMember[]>>((acc, member) => {
    const key = member.order ?? 0;
    if (!acc[key]) acc[key] = [];
    acc[key].push(member);
    return acc;
  }, {});

  return Object.keys(rowMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((order) => ({ order, members: rowMap[order] }));
}

function MemberAvatar({ name, photo }: { name: string; photo?: string | null }) {
  if (photo) {
    return (
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--border)] ring-offset-2 ring-offset-[var(--bg-surface)]">
        <Image
          src={photo}
          alt={name}
          fill
          sizes="44px"
          className="object-cover object-[center_20%]"
          unoptimized={photo.startsWith("/uploads")}
        />
      </div>
    );
  }

  const initials = name
    .replace(/^M\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-[var(--fma-blue)]/20 font-bold text-primary ring-2 ring-[var(--border)] ring-offset-2 ring-offset-[var(--bg-surface)]",
        initials.length >= 3 ? "text-[9px] tracking-tight" : "text-[11px]"
      )}
      aria-hidden
    >
      {initials || "FMA"}
    </div>
  );
}

type ComiteDirecteurBoardProps = {
  members: TeamMember[];
  locale: Locale;
  className?: string;
};

export function ComiteDirecteurBoard({ members, locale, className }: ComiteDirecteurBoardProps) {
  const groups = groupMembers(members);

  return (
    <div
      className={cn(
        "mt-10 rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 sm:p-8 lg:p-10",
        className
      )}
    >
      <div className="space-y-9 sm:space-y-10">
        {groups.map(({ order, members: group }) => {
          const label = getGroupLabel(group, locale);
          return (
            <div key={order} className="border-s-2 border-primary/25 ps-5 sm:ps-6">
              {label ? (
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-1)] sm:text-xs">
                  {label}
                </h3>
              ) : null}
              <ul className="space-y-3">
                {group.map((member) => {
                  const name = localizedName(member, locale);
                  return (
                    <li key={member.id} className="flex items-center gap-4">
                      <MemberAvatar name={name} photo={member.photo} />
                      <span className="text-sm font-medium leading-snug text-[var(--text-2)] sm:text-base">
                        {name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
