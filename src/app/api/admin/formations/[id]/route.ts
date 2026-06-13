import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseFormationBody } from "@/lib/admin-formation-dto";

async function getSession() {
  try { return await auth(); } catch { return null; }
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const item = await prisma.formation.findUnique({ where: { id } }).catch(() => null);
  if (!item) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json().catch(() => null);
    const parsed = parseFormationBody(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const existing = await prisma.formation.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
    if (existing) return NextResponse.json({ message: "Ce slug est déjà utilisé" }, { status: 409 });

    const updated = await prisma.formation.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/admin/formations/[id]:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.formation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/formations/[id]:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
