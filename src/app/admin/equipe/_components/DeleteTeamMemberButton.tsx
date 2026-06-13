"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DeleteTeamMemberButton({ id }: { id: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Supprimer ce membre de l’équipe ?")) return;
    const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Suppression impossible.");
      return;
    }
    router.refresh();
  };
  return (
    <Button type="button" variant="danger-ghost" shape="rounded" size="sm" onClick={handleDelete} className="p-2" title="Supprimer">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
