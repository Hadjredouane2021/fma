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
    <span className="la-fma-org-card__icon" aria-hidden>
      <Image
        src={trimmed}
        alt=""
        width={22}
        height={22}
        className="h-[1.35rem] w-[1.35rem] shrink-0 object-contain"
        sizes="22px"
        unoptimized={isLaFmaUploadIcon(trimmed)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
