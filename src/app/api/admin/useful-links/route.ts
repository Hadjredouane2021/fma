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

function strReq(v: unknown): string {
  return String(v ?? "").trim();
}

function parsePayload(
  input: unknown
): { ok: true; data: Parameters<typeof prisma.usefulLink.create>[0]["data"] } | { ok: false; message: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "Corps JSON invalide" };
  const b = input as Record<string, unknown>;
  const titleFr = strReq(b.titleFr);
  if (!titleFr) return { ok: false, message: "Le titre (FR) est obligatoire" };

  const url = strReq(b.url);
  if (!url) return { ok: false, message: "L’URL est obligatoire" };

  const orderRaw = Number(b.order);
  const order = Number.isFinite(orderRaw) ? Math.trunc(orderRaw) : 0;

  return {
    ok: true,
    data: {
      titleFr,
      titleEn: str(b.titleEn),
      titleAr: str(b.titleAr),
      url,
      descriptionFr: str(b.descriptionFr),
      descriptionEn: str(b.descriptionEn),
      descriptionAr: str(b.descriptionAr),
      category: str(b.category),
      icon: str(b.icon),
      order,
      active: b.active !== false,
    },
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const list = await prisma.usefulLink.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { titleFr: "asc" }],
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/admin/useful-links:", e);
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

    const created = await prisma.usefulLink.create({ data: parsed.data });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/admin/useful-links:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
