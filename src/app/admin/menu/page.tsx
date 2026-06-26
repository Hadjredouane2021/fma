import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getMenuContent } from "@/lib/site-settings-cache";
import MenuForm from "./_components/MenuForm";

export default async function AdminMenuPage() {
  const content = await getMenuContent();
  return (
    <>
      <AdminPageHeader
        title="Menu de navigation"
        subtitle="Gérez les liens et sous-liens affichés dans le header du site. Utilisez [locale] dans les URLs pour la langue."
      />
      <main className="p-8">
        <MenuForm initial={content} />
      </main>
    </>
  );
}
