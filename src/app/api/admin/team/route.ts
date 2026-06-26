import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateLaFmaPageData } from "@/lib/la-fma-page-cache";

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

function parsePayload(input: unknown): { ok: true; data: Parameters<typeof prisma.teamMember.create>[0]["data"] } | { ok: false; message: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "Corps JSON invalide" };
  const b = input as Record<string, unknown>;
  const nameFr = String(b.nameFr ?? "").trim();
  if (!nameFr) return { ok: false, message: "Le nom (FR) est obligatoire" };

  const orderRaw = Number(b.order);
  const order = Number.isFinite(orderRaw) ? Math.trunc(orderRaw) : 0;

  return {
    ok: true,
    data: {
      nameFr,
      nameEn: str(b.nameEn),
      nameAr: str(b.nameAr),
      titleFr: str(b.titleFr),
      titleEn: str(b.titleEn),
      titleAr: str(b.titleAr),
      photo: str(b.photo),
      email: str(b.email),
      department: str(b.department) || "direction",
      bioFr: str(b.bioFr),
      bioEn: str(b.bioEn),
      bioAr: str(b.bioAr),
      order,
      active: b.active !== false,
    },
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const list = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/admin/team:", e);
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

    const created = await prisma.teamMember.create({ data: parsed.data });
    revalidateLaFmaPageData();
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/admin/team:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
