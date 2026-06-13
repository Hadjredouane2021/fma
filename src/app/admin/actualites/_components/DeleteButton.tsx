"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.refresh();
  };
  return (
    <Button type="button" variant="danger-ghost" shape="rounded" size="sm" onClick={handleDelete} className="p-2" title="Supprimer">
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
