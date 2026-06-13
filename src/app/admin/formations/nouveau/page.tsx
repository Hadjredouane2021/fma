import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import FormationForm from "../_components/FormationForm";

export default function NewFormationPage() {
  return (
    <>
      <AdminPageHeader title="Nouvelle formation" subtitle="Créer une formation pour la page publique" />
      <main className="p-8">
        <FormationForm />
      </main>
    </>
  );
}
