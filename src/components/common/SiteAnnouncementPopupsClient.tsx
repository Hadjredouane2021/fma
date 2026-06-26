"use client";

import dynamic from "next/dynamic";
import type { SiteAnnouncements } from "@/components/common/SiteAnnouncementPopups";
import type { Locale } from "@/types";

const SiteAnnouncementPopups = dynamic(
  () =>
    import("@/components/common/SiteAnnouncementPopups").then(
      (mod) => mod.SiteAnnouncementPopups
    ),
  { ssr: false }
);

type SiteAnnouncementPopupsClientProps = {
  locale: Locale;
  initialAnnouncements: SiteAnnouncements;
};

export function SiteAnnouncementPopupsClient({
  locale,
  initialAnnouncements,
}: SiteAnnouncementPopupsClientProps) {
  return (
    <SiteAnnouncementPopups
      locale={locale}
      initialAnnouncements={initialAnnouncements}
    />
  );
}
