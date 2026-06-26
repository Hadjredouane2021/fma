"use client";

import dynamic from "next/dynamic";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  GalleryHorizontal,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import {
  createEmptyGalleryFolder,
  type FolderGalleryCategory,
  type GalleryFolder,
  type GalleryFolderItem,
  type GalleryTitle,
} from "@/lib/galleries";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 rounded-xl border border-[var(--border)] bg-[var(--bg)] animate-pulse" />
  ),
});

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";

type Lang = keyof GalleryTitle;

export default function FolderGalleryForm({
  category,
  label,
  uploadFolder,
  initialTitle,
  initialFolders,
}: {
  category: FolderGalleryCategory;
  label: string;
  uploadFolder: string;
  initialTitle: GalleryTitle;
  initialFolders: GalleryFolder[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState<GalleryTitle>(initialTitle);
  const [folders, setFolders] = useState<GalleryFolder[]>(
    initialFolders.length > 0 ? initialFolders : [createEmptyGalleryFolder()]
  );
  const [langTab, setLangTab] = useState<Lang>("fr");
  const [openFolderId, setOpenFolderId] = useState<string | null>(folders[0]?.id ?? null);
  const [uploadingFolderId, setUploadingFolderId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateFolder = (folderId: string, patch: Partial<GalleryFolder>) => {
    setFolders((prev) => prev.map((f) => (f.id === folderId ? { ...f, ...patch } : f)));
  };

  const updateFolderField = (folderId: string, field: "title" | "description", lang: Lang, value: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, [field]: { ...f[field], [lang]: value } } : f
      )
    );
  };

  const updateFolderItems = (folderId: string, items: GalleryFolderItem[]) => {
    updateFolder(folderId, { items });
  };

  const handleUpload = async (folderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploadingFolderId(folderId);
    setError("");
    try {
      const uploaded: GalleryFolderItem[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", uploadFolder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.message as string) || "Échec de l'upload");
          continue;
        }
        if (typeof data.url === "string") uploaded.push({ url: data.url, link: "" });
      }
      if (uploaded.length > 0) {
        setFolders((prev) =>
          prev.map((f) => {
            if (f.id !== folderId) return f;
            const hasCover = f.items.some((item) => item.isCover);
            const next = uploaded.map((item, index) => ({
              ...item,
              isCover: !hasCover && index === 0,
            }));
            return { ...f, items: [...f.items, ...next] };
          })
        );
      }
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploadingFolderId(null);
    }
  };

  const removeFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (openFolderId === folderId) setOpenFolderId(null);
  };

  const removePhoto = (folderId: string, index: number) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        const next = f.items.filter((_, i) => i !== index);
        if (!next.some((item) => item.isCover) && next[0]) next[0] = { ...next[0], isCover: true };
        return { ...f, items: next };
      })
    );
  };

  const movePhoto = (folderId: string, index: number, dir: -1 | 1) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        const j = index + dir;
        if (j < 0 || j >= f.items.length) return f;
        const next = [...f.items];
        [next[index], next[j]] = [next[j], next[index]];
        return { ...f, items: next };
      })
    );
  };

  const toggleCarousel = (folderId: string, index: number, checked: boolean) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        return {
          ...f,
          items: f.items.map((item, i) => (i === index ? { ...item, inCarousel: checked } : item)),
        };
      })
    );
  };

  const setCover = (folderId: string, index: number) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        return {
          ...f,
          items: f.items.map((item, i) => ({ ...item, isCover: i === index })),
        };
      })
    );
  };

  const setPhotoTitle = (folderId: string, index: number, lang: Lang, value: string) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        return {
          ...f,
          items: f.items.map((item, i) =>
            i === index
              ? {
                  ...item,
                  photoTitle: {
                    fr: item.photoTitle?.fr ?? "",
                    en: item.photoTitle?.en ?? "",
                    ar: item.photoTitle?.ar ?? "",
                    [lang]: value,
                  },
                }
              : item
          ),
        };
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/admin/site/gallery/${category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, folders }),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError((d.message as string) || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 mb-8">
      <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
        <GalleryHorizontal className="w-4 h-4" />
        Galerie — {label}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {(["fr", "en", "ar"] as const).map((lang) => (
          <div key={lang}>
            <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
              Titre section ({lang.toUpperCase()})
            </label>
            <input
              type="text"
              dir={lang === "ar" ? "rtl" : undefined}
              value={title[lang]}
              onChange={(e) => setTitle((t) => ({ ...t, [lang]: e.target.value }))}
              className={inputBase}
            />
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const folder = createEmptyGalleryFolder();
            setFolders((prev) => [...prev, folder]);
            setOpenFolderId(folder.id);
          }}
        >
          <FolderPlus className="w-4 h-4" />
          Ajouter un dossier
        </Button>
        <p className="text-xs text-[var(--text-3)]">
          Cochez « Carrousel » pour l&apos;accueil · « Couverture » pour la page Publications
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {folders.map((folder, folderIndex) => {
          const isOpen = openFolderId === folder.id;
          const coverUrl = folder.items.find((item) => item.isCover)?.url ?? folder.items[0]?.url;
          return (
            <div key={folder.id} className="rounded-xl border border-[var(--border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFolderId(isOpen ? null : folder.id)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg)] hover:bg-[var(--bg-alt)] transition-colors text-left"
              >
                {coverUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--border)]">
                    <Image src={coverUrl} alt="" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-[var(--text-3)]">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--text-1)] truncate">
                    {folder.title.fr || folder.title.en || `Dossier ${folderIndex + 1}`}
                  </p>
                  <p className="text-xs text-[var(--text-3)]">
                    {folder.items.length} photo{folder.items.length !== 1 ? "s" : ""} ·{" "}
                    {folder.items.filter((item) => item.inCarousel).length} au carrousel
                  </p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t border-[var(--border)] p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(["fr", "en", "ar"] as const).map((lang) => (
                      <div key={lang}>
                        <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">
                          Nom du dossier ({lang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          dir={lang === "ar" ? "rtl" : undefined}
                          value={folder.title[lang]}
                          onChange={(e) => updateFolderField(folder.id, "title", lang, e.target.value)}
                          className={inputBase}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="mb-2 flex gap-2">
                      {(["fr", "en", "ar"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLangTab(lang)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                            langTab === lang
                              ? "bg-primary text-white"
                              : "bg-[var(--bg)] text-[var(--text-2)] hover:bg-[var(--bg-alt)]"
                          )}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <label className="block text-xs font-semibold text-[var(--text-2)] mb-2">
                      Description ({langTab.toUpperCase()})
                    </label>
                    <RichTextEditor
                      key={`${folder.id}-${langTab}`}
                      value={folder.description[langTab]}
                      onChange={(html) => updateFolderField(folder.id, "description", langTab, html)}
                      placeholder="Description du dossier…"
                      dir={langTab === "ar" ? "rtl" : "ltr"}
                      minHeight="200px"
                    />
                  </div>

                  <div>
                    <label
                      className={cn(
                        buttonUploadLabel,
                        "inline-flex items-center gap-2",
                        uploadingFolderId === folder.id && "opacity-60 pointer-events-none"
                      )}
                    >
                      <input
                        type="file"
                        accept={ADMIN_IMAGE_ACCEPT}
                        multiple
                        className="hidden"
                        onChange={(e) => handleUpload(folder.id, e)}
                        disabled={uploadingFolderId === folder.id}
                      />
                      {uploadingFolderId === folder.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Envoi…
                        </>
                      ) : (
                        "Ajouter des photos"
                      )}
                    </label>
                  </div>

                  {folder.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {folder.items.map((item, i) => (
                        <div
                          key={`${item.url}-${i}`}
                          className={cn(
                            "rounded-xl overflow-hidden border",
                            item.isCover ? "border-primary ring-2 ring-primary/20" : "border-[var(--border)]"
                          )}
                        >
                          <div className="relative aspect-[4/3]">
                            <Image src={item.url} alt="" fill className="object-cover" unoptimized />
                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/50 p-1.5">
                              <button
                                type="button"
                                onClick={() => movePhoto(folder.id, i, -1)}
                                disabled={i === 0}
                                className="text-white p-1 rounded hover:bg-white/20 disabled:opacity-30"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removePhoto(folder.id, i)}
                                className="text-white p-1 rounded hover:bg-red-600/80"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => movePhoto(folder.id, i, 1)}
                                disabled={i === folder.items.length - 1}
                                className="text-white p-1 rounded hover:bg-white/20 disabled:opacity-30"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 p-2 bg-[var(--bg)]">
                            <input
                              type="text"
                              dir={langTab === "ar" ? "rtl" : undefined}
                              value={item.photoTitle?.[langTab] ?? ""}
                              onChange={(e) => setPhotoTitle(folder.id, i, langTab, e.target.value)}
                              placeholder={`Titre de la photo (${langTab.toUpperCase()})`}
                              className={cn(inputBase, "px-2.5 py-1.5 text-xs")}
                            />
                            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.inCarousel === true}
                                onChange={(e) => toggleCarousel(folder.id, i, e.target.checked)}
                                className="rounded border-[var(--border)]"
                              />
                              Carrousel accueil
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] cursor-pointer">
                              <input
                                type="radio"
                                name={`cover-${folder.id}`}
                                checked={item.isCover === true}
                                onChange={() => setCover(folder.id, i)}
                                className="border-[var(--border)]"
                              />
                              Couverture
                              {item.isCover && <Check className="h-3 w-3 text-primary" />}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFolder(folder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer le dossier
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="primary"
          shape="rounded"
          size="md"
          onClick={handleSave}
          disabled={saving || uploadingFolderId !== null}
          isLoading={saving}
        >
          {!saving && <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        {success && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré ✓</span>
        )}
        {error && <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>}
      </div>
    </div>
  );
}
