"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DeleteConventionButton({ id }: { id: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Supprimer cette convention ?")) return;
    const res = await fetch(`/api/admin/conventions/${id}`, { method: "DELETE" });
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
