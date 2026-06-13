"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm font-mono";

export default function LiensUtilesHeroImageForm({ initial }: { initial: string }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "liens-utiles-hero");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.message || "Échec de l'upload"); return; }
      if (typeof data.url === "string") setImageUrl(data.url);
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/liens-utiles-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      if (res.ok) { setSuccess(true); router.refresh(); }
      else { const d = await res.json().catch(() => ({})); setError(d.message || "Erreur"); }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 mb-8">
      <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        Image hero — page Liens utiles
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={`${inputBase} flex-1`}
          placeholder="/uploads/liens-utiles-hero/…"
          disabled={uploading}
        />
        <label className={cn(buttonUploadLabel, "inline-flex items-center gap-2", uploading && "opacity-60 pointer-events-none")}>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Envoi…</> : "Importer une photo"}
        </label>
      </div>
      {imageUrl && (
        <div className="mb-4 relative rounded-xl overflow-hidden border border-[var(--border)] w-full h-48">
          <Image src={imageUrl} alt="Aperçu" fill className="object-cover" unoptimized={imageUrl.startsWith("/uploads")} />
          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-lg p-1.5 hover:bg-red-700 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Button type="button" variant="primary" shape="rounded" size="md" onClick={handleSave} disabled={saving || uploading} isLoading={saving}>
          {!saving && <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        {success && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré ✓</span>}
        {error && <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>}
      </div>
    </div>
  );
}
