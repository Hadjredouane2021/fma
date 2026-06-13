"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DeleteFormationButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Supprimer cette formation ?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/formations/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="danger-ghost" shape="rounded" size="sm" onClick={handleDelete} disabled={loading} isLoading={loading} className="p-2" title="Supprimer">
      {!loading && <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
