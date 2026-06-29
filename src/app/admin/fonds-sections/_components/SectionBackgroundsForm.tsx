"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { buttonUploadLabel } from "@/lib/button-styles";
import {
  BUILTIN_SECTION_BACKGROUNDS,
  buildSectionBackgroundPreviewCss,
  entryFromSectionPreset,
  sectionBackgroundInlineStyle,
  sectionBgClassName,
  sectionBgCssVarName,
  SITE_SECTION_PRESETS,
  type SectionBackgroundEntry,
  type SectionBackgroundsSettings,
  uniqueSectionId,
} from "@/lib/section-backgrounds";

const CUSTOM_SECTION_VALUE = "__custom__";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";

const inputMono = `${inputBase} font-mono text-sm`;

const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]";

function SectionBgPreview({ section }: { section: SectionBackgroundEntry }) {
  const reactId = useId();
  const scopeId = `section-bg-preview-${reactId.replace(/:/g, "")}`;
  const previewCss = buildSectionBackgroundPreviewCss(section, scopeId);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: previewCss }} />
      <div
        id={scopeId}
        className={cn(
          sectionBgClassName(section.id),
          "relative h-36 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] sm:h-44"
        )}
        style={sectionBackgroundInlineStyle(section) as CSSProperties}
      >
        <div className="relative z-[1] flex h-full items-end p-4">
          <span className="rounded-lg bg-[var(--bg-surface)]/90 px-3 py-1.5 text-xs font-medium text-[var(--text-2)] backdrop-blur-sm">
            Aperçu du rendu public
          </span>
        </div>
      </div>
    </>
  );
}

function SectionBgCard({
  section,
  index,
  allSections,
  onChange,
  onRemove,
  disabled,
}: {
  section: SectionBackgroundEntry;
  index: number;
  allSections: SectionBackgroundEntry[];
  onChange: (next: SectionBackgroundEntry) => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const [uploading, setUploading] = useState(false);
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
      fd.append("folder", "section-backgrounds");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") onChange({ ...section, imageUrl: data.url });
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const busy = disabled || uploading;
  const builtin = BUILTIN_SECTION_BACKGROUNDS.find((b) => b.id === section.id);
  const defaultUrl = builtin?.imageUrl ?? "";
  const isCatalogSection = SITE_SECTION_PRESETS.some((p) => p.id === section.id);
  const [customSlug, setCustomSlug] = useState(!isCatalogSection && !section.system);

  const catalogOptions = SITE_SECTION_PRESETS.filter(
    (p) => p.id === section.id || !allSections.some((s) => s.id === p.id)
  );

  const selectValue =
    section.system || isCatalogSection ? section.id : CUSTOM_SECTION_VALUE;

  const applyPreset = (presetId: string) => {
    if (presetId === CUSTOM_SECTION_VALUE) {
      setCustomSlug(true);
      return;
    }
    const entry = entryFromSectionPreset(presetId, section.imageUrl);
    if (entry) {
      setCustomSlug(false);
      onChange({ ...entry, imageUrl: section.imageUrl || entry.imageUrl });
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-primary flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            {section.system ? "Section système" : "Section personnalisée"}
            <span className="font-mono text-[10px] font-normal text-[var(--text-3)]">#{index + 1}</span>
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-1">
            Classe CSS sur le site&nbsp;:{" "}
            <code className="font-mono text-[var(--text-2)]">{sectionBgClassName(section.id)}</code>
          </p>
        </div>
        {!section.system && (
          <Button
            type="button"
            variant="secondary"
            shape="rounded"
            size="sm"
            disabled={busy}
            onClick={onRemove}
            className="text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Libellé (admin)</label>
          <input
            type="text"
            value={section.label}
            onChange={(e) => onChange({ ...section, label: e.target.value })}
            className={inputBase}
            disabled={busy}
          />
        </div>
        <div>
          <label className={labelCls}>Section du site</label>
          {section.system ? (
            <select className={inputBase} value={section.id} disabled>
              <option value={section.id}>
                {section.label} ({section.id})
              </option>
            </select>
          ) : (
            <>
              <select
                className={inputBase}
                value={selectValue}
                onChange={(e) => applyPreset(e.target.value)}
                disabled={busy}
              >
                {catalogOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.id})
                  </option>
                ))}
                <option value={CUSTOM_SECTION_VALUE}>Autre — identifiant personnalisé</option>
              </select>
              {customSlug && (
                <input
                  type="text"
                  value={section.id}
                  onChange={(e) =>
                    onChange({
                      ...section,
                      id: uniqueSectionId(e.target.value, allSections, section.id),
                    })
                  }
                  className={cn(inputMono, "mt-2")}
                  disabled={busy}
                  placeholder="mon-identifiant"
                />
              )}
            </>
          )}
          <p className="text-[10px] text-[var(--text-3)] mt-1">
            Identifiant CSS&nbsp;:{" "}
            <code className="font-mono">deco-section-bg--{sectionBgCssVarName(section.id)}</code>
          </p>
        </div>
      </div>

      <div>
        <label className={labelCls}>Description (admin)</label>
        <textarea
          rows={2}
          value={section.description ?? ""}
          onChange={(e) => onChange({ ...section, description: e.target.value })}
          className={cn(inputBase, "resize-none")}
          disabled={busy}
          placeholder="Où ce fond est utilisé sur le site public…"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={section.imageUrl}
          onChange={(e) => onChange({ ...section, imageUrl: e.target.value })}
          className={`${inputMono} flex-1`}
          placeholder={defaultUrl || "/uploads/section-backgrounds/…"}
          disabled={busy}
        />
        <label
          className={cn(
            buttonUploadLabel,
            "inline-flex items-center gap-2",
            busy && "pointer-events-none opacity-60"
          )}
        >
          <input
            type="file"
            accept={ADMIN_IMAGE_ACCEPT}
            className="hidden"
            onChange={handleUpload}
            disabled={busy}
          />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi…
            </>
          ) : (
            "Importer"
          )}
        </label>
        {defaultUrl && (
          <Button
            type="button"
            variant="secondary"
            shape="rounded"
            size="md"
            disabled={busy}
            onClick={() => onChange({ ...section, imageUrl: defaultUrl })}
          >
            <RotateCcw className="w-4 h-4" />
            Défaut
          </Button>
        )}
      </div>

      {(() => {
        const effectiveImageUrl = section.imageUrl.trim() || defaultUrl;
        if (!effectiveImageUrl) return null;
        return (
          <div className="space-y-3">
            <SectionBgPreview section={{ ...section, imageUrl: effectiveImageUrl }} />
            {section.imageUrl.trim() && (
              <div className="relative h-24 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <Image
                  src={section.imageUrl}
                  alt=""
                  fill
                  className="object-cover object-center"
                  unoptimized={section.imageUrl.startsWith("/uploads")}
                />
              </div>
            )}
          </div>
        );
      })()}

      <p className="text-xs text-[var(--text-3)]">
        PNG ou JPG large (1920×1080 min.), rendu en <code className="font-mono">cover</code>.
      </p>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </section>
  );
}

export default function SectionBackgroundsForm({
  initial,
}: {
  initial: SectionBackgroundsSettings;
}) {
  const router = useRouter();
  const [sections, setSections] = useState(initial.sections);
  const [newSectionId, setNewSectionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateSection = (index: number, next: SectionBackgroundEntry) => {
    setSections((prev) => {
      const copy = [...prev];
      const uniqueId = uniqueSectionId(next.id, prev, copy[index]?.id);
      copy[index] = { ...next, id: uniqueId };
      return copy;
    });
    setSuccess(false);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  };

  const availablePresets = SITE_SECTION_PRESETS.filter(
    (p) => !sections.some((s) => s.id === p.id)
  );

  const handleAddPreset = (presetId: string) => {
    if (!presetId || saving) return;
    const entry = entryFromSectionPreset(presetId);
    if (!entry) return;
    setSections((prev) => {
      if (prev.some((s) => s.id === entry.id)) return prev;
      return [...prev, entry];
    });
    setNewSectionId("");
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/section-backgrounds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.message || "Erreur lors de l'enregistrement");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const resetAll = () => {
    setSections(BUILTIN_SECTION_BACKGROUNDS.map((s) => ({ ...s })));
    setSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-2)]">
        Choisissez une section dans la liste pour l&apos;ajouter, importez une image décorative puis
        cliquez sur <strong>Enregistrer les fonds</strong>. Toutes les sections du catalogue sont reliées
        au site public.
      </div>

      {sections.map((section, index) => (
        <SectionBgCard
          key={`${section.id}-${index}`}
          section={section}
          index={index}
          allSections={sections}
          onChange={(next) => updateSection(index, next)}
          onRemove={() => removeSection(index)}
          disabled={saving}
        />
      ))}

      {availablePresets.length > 0 ? (
        <div className="flex flex-col gap-2">
          <select
            className={cn(inputBase, "flex-1")}
            value={newSectionId}
            onChange={(e) => handleAddPreset(e.target.value)}
            disabled={saving}
          >
            <option value="">— Choisir une section du site —</option>
            {availablePresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.id})
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--text-3)]">
            La section s&apos;ajoute dès la sélection. Pensez à enregistrer après avoir importé l&apos;image.
          </p>
        </div>
      ) : (
        <p className="text-sm text-[var(--text-3)]">
          Toutes les sections du catalogue sont déjà configurées.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button
          type="button"
          variant="primary"
          shape="rounded"
          size="md"
          onClick={handleSave}
          disabled={saving}
          isLoading={saving}
        >
          {!saving && <Save className="w-4 h-4" />}
          Enregistrer les fonds
        </Button>
        <Button
          type="button"
          variant="secondary"
          shape="rounded"
          size="md"
          onClick={resetAll}
          disabled={saving}
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
        {success && (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Enregistré ✓
          </span>
        )}
        {error && (
          <span className="text-sm font-medium text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
    </div>
  );
}
