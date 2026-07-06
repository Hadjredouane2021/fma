import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLaFmaContent, saveLaFmaContent } from "@/lib/site-content";
import {
  DEFAULT_LA_FMA_CONTENT,
  type LaFmaMemberCategory,
  type LocalizedString,
} from "@/lib/la-fma-site-public";

async function getSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

function parseLocalized(input: unknown): LocalizedString | null {
  if (!input || typeof input !== "object") return null;
  const t = input as Record<string, unknown>;
  return {
    fr: String(t.fr ?? "").trim(),
    en: String(t.en ?? "").trim(),
    ar: String(t.ar ?? "").trim(),
  };
}

function parseCategories(input: unknown): LaFmaMemberCategory[] | null {
  if (!Array.isArray(input)) return null;
  const categories: LaFmaMemberCategory[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const slug = String(row.slug ?? "").trim();
    const label = parseLocalized(row.label);
    if (!slug || !label) continue;
    categories.push({ slug, label });
  }
  return categories;
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = (await req.json()) as {
      memberCategoryOtherLabel?: unknown;
      memberCategories?: unknown;
    };
    const memberCategoryOtherLabel = parseLocalized(body.memberCategoryOtherLabel);
    const memberCategories = parseCategories(body.memberCategories);
    if (!memberCategoryOtherLabel || memberCategories === null) {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    const current = await getLaFmaContent();
    const saved = await saveLaFmaContent({
      ...current,
      memberCategoryOtherLabel,
      memberCategories: memberCategories.length
        ? memberCategories
        : DEFAULT_LA_FMA_CONTENT.memberCategories,
    });
    return NextResponse.json({
      memberCategoryOtherLabel: saved.memberCategoryOtherLabel,
      memberCategories: saved.memberCategories,
    });
  } catch (e) {
    console.error("PUT /api/admin/membres/categories:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
