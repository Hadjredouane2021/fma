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
): { ok: true; data: Parameters<typeof prisma.usefulLink.update>[0]["data"] } | { ok: false; message: string } {
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = parsePayload(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const updated = await prisma.usefulLink.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("PUT /api/admin/useful-links/[id]:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.usefulLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/useful-links/[id]:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
