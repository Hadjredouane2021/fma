import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getFooterContent } from "@/lib/site-settings-cache";
import FooterForm from "./_components/FooterForm";

export default async function AdminFooterPage() {
  const content = await getFooterContent();
  return (
    <>
      <AdminPageHeader title="Footer" subtitle="Coordonnées, réseaux sociaux et description affichés en bas de chaque page" />
      <main className="p-8">
        <FooterForm initial={content} />
      </main>
    </>
  );
}
