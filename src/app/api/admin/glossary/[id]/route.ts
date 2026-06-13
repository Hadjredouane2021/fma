import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

function str(v: unknown): string | null {
  const t = String(v ?? "").trim();
  return t === "" ? null : t;
}

function strText(v: unknown): string {
  return String(v ?? "").trim();
}

function defaultLetterFromTerm(termFr: string): string {
  const t = termFr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const m = t.match(/[A-Za-z]/);
  return m ? m[0].toUpperCase() : "?";
}

function parsePayload(
  input: unknown
): { ok: true; data: Parameters<typeof prisma.glossaryTerm.update>[0]["data"] } | { ok: false; message: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "Corps JSON invalide" };
  const b = input as Record<string, unknown>;
  const termFr = strText(b.termFr);
  if (!termFr) return { ok: false, message: "Le terme (FR) est obligatoire" };

  const definitionFr = strText(b.definitionFr);
  if (!definitionFr) return { ok: false, message: "La définition (FR) est obligatoire" };

  let letter = strText(b.letter).toUpperCase().slice(0, 3);
  if (!letter) letter = defaultLetterFromTerm(termFr);

  const orderRaw = Number(b.order);
  const order = Number.isFinite(orderRaw) ? Math.trunc(orderRaw) : 0;

  return {
    ok: true,
    data: {
      termFr,
      termEn: str(b.termEn),
      termAr: str(b.termAr),
      definitionFr,
      definitionEn: str(b.definitionEn),
      definitionAr: str(b.definitionAr),
      letter,
      order,
    },
  };
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = parsePayload(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const updated = await prisma.glossaryTerm.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("PUT /api/admin/glossary/[id]:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.glossaryTerm.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/glossary/[id]:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
