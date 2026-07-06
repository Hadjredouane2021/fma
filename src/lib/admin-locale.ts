import type { Locale } from "@/types";
import {
  teamMemberFieldUsesFallback,
  teamMemberLocaleLevel,
  teamMemberName,
  teamMemberTitle,
  type TeamMemberLocaleLevel,
  type TeamMemberTextFields,
} from "@/lib/localized-content";

export type AdminLocale = Locale;

export const ADMIN_LOCALE_TABS = [
  { key: "fr" as const, flag: "🇫🇷", label: "Français", dir: "ltr" as const },
  { key: "en" as const, flag: "🇬🇧", label: "English", dir: "ltr" as const },
  { key: "ar" as const, flag: "🇲🇦", label: "العربية", dir: "rtl" as const },
];

export type LocaleCompletionStatus = Record<AdminLocale, TeamMemberLocaleLevel>;

export function teamMemberLocaleStatus(member: TeamMemberTextFields): LocaleCompletionStatus {
  return {
    fr: teamMemberLocaleLevel(member, "fr"),
    en: teamMemberLocaleLevel(member, "en"),
    ar: teamMemberLocaleLevel(member, "ar"),
  };
}

export {
  teamMemberFieldUsesFallback,
  teamMemberLocaleLevel,
  teamMemberName,
  teamMemberTitle,
};
