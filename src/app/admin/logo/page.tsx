import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSiteSpinner } from "@/lib/site-settings-cache";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { DEFAULT_SITE_LOGO, normalizeSiteLogo } from "@/lib/site-logo";
import LogoForm from "./_components/LogoForm";
import SpinnerLogoForm from "./_components/SpinnerLogoForm";

export default async function AdminLogoPage() {
  const [logoRow, spinner] = await Promise.all([
    prisma.setting.findUnique({ where: { key: DB_KEYS.SITE_LOGO } }).catch(() => null),
    getSiteSpinner(),
  ]);
  const logo = logoRow?.value
    ? normalizeSiteLogo(JSON.parse(logoRow.value))
    : DEFAULT_SITE_LOGO;

  return (
    <>
      <AdminPageHeader
        title="Logo du site"
        subtitle="Logos header/footer (mode clair et sombre) ; image du spinner de chargement"
      />
      <main className="space-y-8 p-8">
        <LogoForm initial={logo} />
        <SpinnerLogoForm initial={spinner} />
      </main>
    </>
  );
}
