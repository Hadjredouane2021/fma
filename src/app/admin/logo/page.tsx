import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSiteLogo, getSiteSpinner } from "@/lib/site-settings-cache";
import LogoForm from "./_components/LogoForm";
import SpinnerLogoForm from "./_components/SpinnerLogoForm";

export default async function AdminLogoPage() {
  const [logo, spinner] = await Promise.all([getSiteLogo(), getSiteSpinner()]);

  return (
    <>
      <AdminPageHeader
        title="Logo du site"
        subtitle="Logo affiché dans le header et le footer ; image du spinner de chargement"
      />
      <main className="space-y-8 p-8">
        <LogoForm initial={logo} />
        <SpinnerLogoForm initial={spinner} />
      </main>
    </>
  );
}
