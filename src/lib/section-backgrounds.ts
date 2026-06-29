export type SectionBackgroundEntry = {
  /** Identifiant slug — classe CSS deco-section-bg--{id} */
  id: string;
  label: string;
  imageUrl: string;
  description?: string;
  /** Section liée au site (contact, chiffres clés…) — l’id ne peut pas être supprimé */
  system?: boolean;
};

export type SectionBackgroundsSettings = {
  sections: SectionBackgroundEntry[];
};

export const BUILTIN_SECTION_BACKGROUNDS: SectionBackgroundEntry[] = [
  {
    id: "contact",
    label: "Contact & header",
    imageUrl: "/contact-section-bg.png",
    description:
      "Motif décoratif sur la page Contact et en fond du header (toutes les pages).",
    system: true,
  },
  {
    id: "key-figures",
    label: "Chiffres clés (accueil)",
    imageUrl: "/key-figures-section-bg.png",
    description: "Section « Chiffres clés » sur la page d'accueil.",
    system: true,
  },
];

const SYSTEM_IDS = new Set(BUILTIN_SECTION_BACKGROUNDS.map((s) => s.id));

/** Sections du site public — choix dans l’admin « Fonds de sections » */
export const SITE_SECTION_PRESETS: Omit<SectionBackgroundEntry, "imageUrl">[] = [
  ...BUILTIN_SECTION_BACKGROUNDS.map(({ imageUrl: _img, ...rest }) => rest),
  {
    id: "footer",
    label: "Footer",
    description: "Pied de page sur toutes les pages.",
  },
  {
    id: "hero",
    label: "Hero — accueil",
    description: "Grande bannière en haut de la page d'accueil.",
  },
  {
    id: "la-fma",
    label: "La FMA",
    description: "Page La FMA et sections internes.",
  },
  {
    id: "actualites",
    label: "Actualités",
    description: "Liste et détail des actualités.",
  },
  {
    id: "publications",
    label: "Publications",
    description: "Page publications et dossiers.",
  },
  {
    id: "conventions",
    label: "Conventions",
    description: "Page conventions professionnelles.",
  },
  {
    id: "formations",
    label: "Formations",
    description: "Page formations du secteur.",
  },
  {
    id: "liens-utiles",
    label: "Liens utiles",
    description: "Page liens utiles.",
  },
  {
    id: "vocabulaire",
    label: "Vocabulaire",
    description: "Page vocabulaire utile.",
  },
  {
    id: "particuliers",
    label: "Particuliers",
    description: "Page offres particuliers.",
  },
  {
    id: "entreprises",
    label: "Entreprises & professionnels",
    description: "Page entreprises et professionnels.",
  },
  {
    id: "decouvrir-le-secteur",
    label: "Découvrir le secteur",
    description: "Hub découverte du secteur.",
  },
  {
    id: "recherche",
    label: "Recherche",
    description: "Page de recherche du site.",
  },
  {
    id: "newsletter",
    label: "Restez informé (accueil)",
    description: "Bloc inscription newsletter en bas de la page d'accueil.",
  },
  {
    id: "dernieres-actualites",
    label: "Dernières actualités (accueil)",
    description: "Section actualités en vedette sur la page d'accueil.",
  },
  {
    id: "interventions-fma",
    label: "Interventions FMA (accueil)",
    description: "Carrousel Interventions FMA sur la page d'accueil.",
  },
  {
    id: "reseaux-sociaux",
    label: "Réseaux sociaux (accueil)",
    description: "Carrousel réseaux sociaux sur la page d'accueil.",
  },
];

export function sectionPresetById(id: string): Omit<SectionBackgroundEntry, "imageUrl"> | undefined {
  const slug = slugifySectionId(id);
  return SITE_SECTION_PRESETS.find((p) => p.id === slug);
}

export function entryFromSectionPreset(
  presetId: string,
  imageUrl = ""
): SectionBackgroundEntry | null {
  const preset = sectionPresetById(presetId);
  if (!preset) return null;
  const builtin = BUILTIN_SECTION_BACKGROUNDS.find((b) => b.id === preset.id);
  return {
    ...preset,
    imageUrl: imageUrl || builtin?.imageUrl || "",
    system: SYSTEM_IDS.has(preset.id),
  };
}

/** @deprecated compat — ancien format plat */
export const DEFAULT_SECTION_BACKGROUNDS: SectionBackgroundsSettings = {
  sections: BUILTIN_SECTION_BACKGROUNDS.map((s) => ({ ...s })),
};

export function slugifySectionId(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function sectionBgCssVarName(id: string): string {
  return slugifySectionId(id) || "section";
}

export function sectionBgClassName(id: string): string {
  const slug = sectionBgCssVarName(id);
  return `deco-section-bg deco-section-bg--${slug}`;
}

function strUrl(v: unknown, fb: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fb;
}

function normalizeEntry(raw: unknown, fallback?: SectionBackgroundEntry): SectionBackgroundEntry | null {
  if (!raw || typeof raw !== "object") return fallback ?? null;
  const d = raw as Partial<SectionBackgroundEntry>;
  const id = slugifySectionId(typeof d.id === "string" ? d.id : fallback?.id ?? "");
  if (!id) return null;
  const builtin = BUILTIN_SECTION_BACKGROUNDS.find((s) => s.id === id);
  return {
    id,
    label:
      typeof d.label === "string" && d.label.trim()
        ? d.label.trim()
        : builtin?.label ?? fallback?.label ?? id,
    imageUrl: strUrl(d.imageUrl, builtin?.imageUrl ?? fallback?.imageUrl ?? ""),
    description:
      typeof d.description === "string"
        ? d.description.trim()
        : builtin?.description ?? fallback?.description ?? "",
    system: SYSTEM_IDS.has(id) || d.system === true,
  };
}

function migrateLegacyFormat(input: Record<string, unknown>): SectionBackgroundsSettings {
  return {
    sections: BUILTIN_SECTION_BACKGROUNDS.map((builtin) => ({
      ...builtin,
      imageUrl: strUrl(
        input[builtin.id === "contact" ? "contact" : "keyFigures"],
        builtin.imageUrl
      ),
    })),
  };
}

export function normalizeSectionBackgrounds(input: unknown): SectionBackgroundsSettings {
  if (!input || typeof input !== "object") {
    return { sections: BUILTIN_SECTION_BACKGROUNDS.map((s) => ({ ...s })) };
  }

  const d = input as Record<string, unknown>;

  if ("contact" in d || "keyFigures" in d) {
    if (!Array.isArray(d.sections)) return migrateLegacyFormat(d);
  }

  if (!Array.isArray(d.sections)) {
    return { sections: BUILTIN_SECTION_BACKGROUNDS.map((s) => ({ ...s })) };
  }

  const byId = new Map<string, SectionBackgroundEntry>();
  for (const raw of d.sections) {
    const entry = normalizeEntry(raw);
    if (entry && !byId.has(entry.id)) byId.set(entry.id, entry);
  }

  for (const builtin of BUILTIN_SECTION_BACKGROUNDS) {
    if (!byId.has(builtin.id)) {
      byId.set(builtin.id, { ...builtin });
    } else {
      const existing = byId.get(builtin.id)!;
      byId.set(builtin.id, {
        ...builtin,
        ...existing,
        id: builtin.id,
        system: true,
        imageUrl: strUrl(existing.imageUrl, builtin.imageUrl),
      });
    }
  }

  const systemFirst = BUILTIN_SECTION_BACKGROUNDS.map((b) => byId.get(b.id)!);
  const custom = [...byId.values()].filter((s) => !SYSTEM_IDS.has(s.id));

  return { sections: [...systemFirst, ...custom] };
}

export function getSectionBackground(
  settings: SectionBackgroundsSettings,
  id: string
): SectionBackgroundEntry | undefined {
  const slug = sectionBgCssVarName(id);
  return settings.sections.find((s) => sectionBgCssVarName(s.id) === slug);
}

/** Valeur CSS `url("…")` ou `none` */
export function sectionBgCssUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "none";
  const escaped = trimmed.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `url("${escaped}")`;
}

export const SECTION_BG_BUILTIN_CSS_IDS = new Set(["contact", "key-figures"]);

type SectionBgVisualVariant = "standard" | "key-figures";

function sectionBackgroundVisualVariant(id: string): SectionBgVisualVariant {
  return id === "key-figures" ? "key-figures" : "standard";
}

/** Règles ::before / ::after pour une section (sélecteur complet, ex. `.deco-section-bg--footer` ou `#id.deco-section-bg--footer`) */
export function sectionBackgroundPseudoRules(
  slug: string,
  selector: string,
  variant: SectionBgVisualVariant = "standard"
): string {
  const beforeLight = variant === "key-figures" ? 0.58 : 0.42;
  const beforeDark = variant === "key-figures" ? 0.2 : 0.18;
  const afterLight =
    variant === "key-figures"
      ? `linear-gradient(125deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 55%),
    linear-gradient(180deg, color-mix(in srgb, var(--bg) 10%, transparent) 0%, color-mix(in srgb, var(--bg) 26%, transparent) 100%)`
      : `linear-gradient(125deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 28%, transparent 52%),
    linear-gradient(180deg, color-mix(in srgb, var(--bg) 12%, transparent) 0%, color-mix(in srgb, var(--bg) 28%, transparent) 100%)`;
  const afterDark =
    variant === "key-figures"
      ? `linear-gradient(125deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.015) 32%, transparent 58%),
    linear-gradient(180deg, color-mix(in srgb, var(--bg) 38%, transparent) 0%, color-mix(in srgb, var(--bg) 58%, transparent) 100%)`
      : `linear-gradient(125deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.015) 30%, transparent 58%),
    linear-gradient(180deg, color-mix(in srgb, var(--bg) 38%, transparent) 0%, color-mix(in srgb, var(--bg) 58%, transparent) 100%)`;

  return `
${selector}::before {
  background-image: var(--deco-section-${slug}-bg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${beforeLight};
}
.dark ${selector}::before {
  opacity: ${beforeDark};
}
${selector}::after {
  background: ${afterLight};
}
.dark ${selector}::after {
  background: ${afterDark};
}`;
}

export function sectionBackgroundInlineStyle(
  entry: SectionBackgroundEntry
): Record<string, string> {
  const slug = sectionBgCssVarName(entry.id);
  return { [`--deco-section-${slug}-bg`]: sectionBgCssUrl(entry.imageUrl) };
}

/** CSS scopé pour l’aperçu admin (sections custom sans règles dans globals.css) */
export function buildSectionBackgroundPreviewCss(
  entry: SectionBackgroundEntry,
  scopeId: string
): string {
  const slug = sectionBgCssVarName(entry.id);
  const selector = `#${scopeId}.deco-section-bg--${slug}`;
  return sectionBackgroundPseudoRules(slug, selector, sectionBackgroundVisualVariant(entry.id));
}

export function buildSectionBackgroundsCss(settings: SectionBackgroundsSettings): string {
  const vars = settings.sections
    .map((s) => {
      const varName = sectionBgCssVarName(s.id);
      return `  --deco-section-${varName}-bg: ${sectionBgCssUrl(s.imageUrl)};`;
    })
    .join("\n");

  const contact = settings.sections.find((s) => s.id === "contact");
  const headerVar = contact
    ? `  --site-header-deco-bg: ${sectionBgCssUrl(contact.imageUrl)};`
    : "";

  const customRules = settings.sections
    .filter(
      (s) => !SECTION_BG_BUILTIN_CSS_IDS.has(s.id) && s.imageUrl.trim().length > 0
    )
    .map((s) => {
      const slug = sectionBgCssVarName(s.id);
      return sectionBackgroundPseudoRules(
        slug,
        `.deco-section-bg--${slug}`,
        sectionBackgroundVisualVariant(s.id)
      );
    })
    .join("\n");

  const perSectionVars = settings.sections
    .filter((s) => s.imageUrl.trim().length > 0)
    .map((s) => {
      const slug = sectionBgCssVarName(s.id);
      return `.deco-section-bg--${slug} {\n  --deco-section-${slug}-bg: ${sectionBgCssUrl(s.imageUrl)};\n}`;
    })
    .join("\n");

  return `:root {\n${vars}\n${headerVar}\n}\n${perSectionVars}\n${customRules}`;
}

export function createSectionBackgroundEntry(label = "Nouvelle section"): SectionBackgroundEntry {
  const base = slugifySectionId(label) || "section";
  return {
    id: base,
    label,
    imageUrl: "",
    description: "",
    system: false,
  };
}

export function uniqueSectionId(
  desired: string,
  sections: SectionBackgroundEntry[],
  excludeId?: string
): string {
  const base = slugifySectionId(desired) || "section";
  if (!sections.some((s) => s.id === base && s.id !== excludeId)) return base;
  let n = 2;
  while (sections.some((s) => s.id === `${base}-${n}` && s.id !== excludeId)) n++;
  return `${base}-${n}`;
}
