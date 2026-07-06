import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLaFmaContent, saveLaFmaContent } from "@/lib/site-content";
import type { LocalizedString } from "@/lib/la-fma-site-public";

async function getSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

function parseTitle(input: unknown): LocalizedString | null {
  if (!input || typeof input !== "object") return null;
  const t = input as Record<string, unknown>;
  const fr = String(t.fr ?? "").trim();
  const en = String(t.en ?? "").trim();
  const ar = String(t.ar ?? "").trim();
  if (!fr && !en && !ar) return null;
  return { fr, en, ar };
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = (await req.json()) as { directionSectionTitle?: unknown };
    const directionSectionTitle = parseTitle(body.directionSectionTitle);
    if (!directionSectionTitle) {
      return NextResponse.json({ message: "Titre invalide" }, { status: 400 });
    }

    const current = await getLaFmaContent();
    const saved = await saveLaFmaContent({ ...current, directionSectionTitle });
    return NextResponse.json({ directionSectionTitle: saved.directionSectionTitle });
  } catch (e) {
    console.error("PUT /api/admin/equipe/section-title:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
