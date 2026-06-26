"use client";

import { useEffect, useState } from "react";
import { NewsAnnouncementPopup } from "@/components/common/NewsAnnouncementPopup";
import { PublicationAnnouncementPopup } from "@/components/common/PublicationAnnouncementPopup";
import {
  markAnnouncementSessionShown,
  useAnnouncementEligibility,
} from "@/components/common/useAnnouncementEligibility";
import type { AnnouncementPost } from "@/lib/posts-cache";
import type { AnnouncementPublication } from "@/lib/publications-cache";
import type { Locale } from "@/types";

export type SiteAnnouncements = {
  news: AnnouncementPost | null;
  publication: AnnouncementPublication | null;
};

type SiteAnnouncementPopupsProps = {
  locale: Locale;
  initialAnnouncements: SiteAnnouncements;
};

export function SiteAnnouncementPopups({
  locale,
  initialAnnouncements,
}: SiteAnnouncementPopupsProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const eligible = useAnnouncementEligibility(locale);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/site/announcement", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteAnnouncements | null) => {
        if (!cancelled && data) setAnnouncements(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!eligible) return null;

  return (
    <>
      <NewsAnnouncementPopup
        locale={locale}
        announcement={announcements.news}
        onShown={markAnnouncementSessionShown}
      />
      {!announcements.news ? (
        <PublicationAnnouncementPopup
          locale={locale}
          announcement={announcements.publication}
          onShown={markAnnouncementSessionShown}
        />
      ) : null}
    </>
  );
}
