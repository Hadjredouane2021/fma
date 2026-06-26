"use client";

import Image from "next/image";
import { useState } from "react";
import { isLaFmaIconImage, isLaFmaUploadIcon, normalizeLaFmaIcon } from "@/lib/la-fma-icon";

export function LaFmaCardIcon({ icon }: { icon: string }) {
  const trimmed = normalizeLaFmaIcon(icon);
  const [failed, setFailed] = useState(false);

  if (!trimmed || failed || !isLaFmaIconImage(trimmed)) {
    return (
      <span className="la-fma-org-card__icon" aria-hidden>
        {trimmed && !failed ? trimmed : "📌"}
      </span>
    );
  }

  return (
    <span className="la-fma-org-card__icon la-fma-org-card__icon--image" aria-hidden>
      <Image
        src={trimmed}
        alt=""
        fill
        className="object-contain"
        sizes="64px"
        unoptimized={isLaFmaUploadIcon(trimmed)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
