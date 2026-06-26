import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSiteTheme, getAdminTheme } from "@/lib/site-settings-cache";
import SiteThemeForm from "./_components/SiteThemeForm";
import AdminThemeForm from "./_components/AdminThemeForm";

export default async function AdminParametresPage() {
  const [siteTheme, adminTheme] = await Promise.all([getSiteTheme(), getAdminTheme()]);

  return (
    <>
      <AdminPageHeader
        title="Paramètres"
        subtitle="Couleurs du site public et de l'espace d'administration"
      />
      <main className="space-y-8 p-8">
        <SiteThemeForm initial={siteTheme} />
        <AdminThemeForm initial={adminTheme} />
      </main>
    </>
  );
}
