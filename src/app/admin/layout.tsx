import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { getSiteSpinner } from "@/lib/site-spinner";
import { getSiteLogo } from "@/lib/site-logo";

export const metadata: Metadata = {
  title: "Administration | FMA",
  robots: "noindex,nofollow",
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [siteSpinner, siteLogo] = await Promise.all([getSiteSpinner(), getSiteLogo()]);
  return (
    <AdminShell spinnerImageUrl={siteSpinner.imageUrl} logoUrl={siteLogo.imageUrl}>
      {children}
    </AdminShell>
  );
}
