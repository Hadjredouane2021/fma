"use client";

import { useEffect, useState } from "react";

/** Ouvre la modale après hydratation pour éviter aria-hidden / mismatch Radix. */
export function useAnnouncementDialogOpen(
  enabled: boolean,
  hasAnnouncement: boolean,
  isDismissed: boolean
) {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHydrated(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || !enabled || !hasAnnouncement || isDismissed) {
      setOpen(false);
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, [hydrated, enabled, hasAnnouncement, isDismissed]);

  return { hydrated, open, setOpen };
}
