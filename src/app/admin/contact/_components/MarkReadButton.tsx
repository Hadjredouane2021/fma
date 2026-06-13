"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const handle = async () => {
    await fetch(`/api/admin/contact/${id}/read`, { method: "PATCH" });
    router.refresh();
  };
  return (
    <Button type="button" variant="outline" shape="rounded" size="sm" onClick={handle} className="text-xs px-3 py-1.5">
      Marquer lu
    </Button>
  );
}
