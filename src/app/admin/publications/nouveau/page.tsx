import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import PublicationForm from "../_components/PublicationForm";

export default function NouvellePublicationPage() {
  return (
    <>
      <AdminPageHeader title="Nouvelle publication" subtitle="Ajouter un rapport, étude ou revue" />
      <main className="p-8 max-w-3xl">
        <PublicationForm />
      </main>
    </>
  );
}
