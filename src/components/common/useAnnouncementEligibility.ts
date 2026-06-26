"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/types";

const SESSION_KEY = "fma-announcement-session-shown";

export function isHomePage(pathname: string, locale: string): boolean {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

export function markAnnouncementSessionShown(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Popup uniquement sur l’accueil, ou à la première page visitée dans la session. */
export function useAnnouncementEligibility(locale: Locale): boolean {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    const onHome = isHomePage(pathname, locale);
    let firstPageThisSession = false;
    try {
      firstPageThisSession = sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      /* ignore */
    }
    setEligible(onHome || firstPageThisSession);
  }, [pathname, locale]);

  return eligible;
}
