"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SITE_SPINNER } from "@/lib/site-spinner";

const SpinnerLogoContext = createContext(DEFAULT_SITE_SPINNER.imageUrl);

export function SpinnerLogoProvider({
  imageUrl,
  children,
}: {
  imageUrl: string;
  children: React.ReactNode;
}) {
  return <SpinnerLogoContext.Provider value={imageUrl}>{children}</SpinnerLogoContext.Provider>;
}

export function useSpinnerLogoUrl(): string {
  return useContext(SpinnerLogoContext);
}
