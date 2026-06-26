import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { AdminThemeStyle } from "@/components/admin/AdminThemeStyle";
import { getSiteLogo, getSiteSpinner } from "@/lib/site-settings-cache";

export const metadata: Metadata = {
  title: "Administration | FMA",
  robots: "noindex,nofollow",
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [siteSpinner, siteLogo] = await Promise.all([getSiteSpinner(), getSiteLogo()]);
  return (
    <>
      <AdminThemeStyle />
      <AdminShell spinnerImageUrl={siteSpinner.imageUrl} logoUrl={siteLogo.imageUrl}>
        {children}
      </AdminShell>
    </>
  );
}
