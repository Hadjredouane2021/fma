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

/** Première lettre « utile » pour le classement alphabétique (A–Z). */
function defaultLetterFromTerm(termFr: string): string {
  const t = termFr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const m = t.match(/[A-Za-z]/);
  return m ? m[0].toUpperCase() : "?";
}

function parsePayload(
  input: unknown
): { ok: true; data: Parameters<typeof prisma.glossaryTerm.create>[0]["data"] } | { ok: false; message: string } {
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

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const list = await prisma.glossaryTerm.findMany({ orderBy: [{ letter: "asc" }, { order: "asc" }, { termFr: "asc" }] });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/admin/glossary:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const parsed = parsePayload(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const created = await prisma.glossaryTerm.create({ data: parsed.data });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/admin/glossary:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
