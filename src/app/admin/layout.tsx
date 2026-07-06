import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { AdminThemeStyle } from "@/components/admin/AdminThemeStyle";
import { DbUnavailableBanner } from "@/components/common/DbUnavailableBanner";
import { getSiteLogo, getSiteSpinner, isDatabaseUnavailable } from "@/lib/site-settings-cache";

export const metadata: Metadata = {
  title: "Administration | FMA",
  robots: "noindex,nofollow",
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [siteSpinner, siteLogo, dbUnavailable] = await Promise.all([
    getSiteSpinner(),
    getSiteLogo(),
    isDatabaseUnavailable(),
  ]);
  return (
    <>
      <AdminThemeStyle />
      {dbUnavailable && <DbUnavailableBanner />}
      <AdminShell spinnerImageUrl={siteSpinner.imageUrl} logoUrl={siteLogo.imageUrl}>
        {children}
      </AdminShell>
    </>
  );
}
