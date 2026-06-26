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

function parsePayload(input: unknown): { ok: true; data: Parameters<typeof prisma.teamMember.update>[0]["data"] } | { ok: false; message: string } {
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = parsePayload(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const updated = await prisma.teamMember.update({ where: { id }, data: parsed.data });
    revalidateLaFmaPageData();
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("PUT /api/admin/team/[id]:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.teamMember.delete({ where: { id } });
    revalidateLaFmaPageData();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/team/[id]:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
