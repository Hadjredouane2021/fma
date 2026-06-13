import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseConventionBody } from "@/lib/admin-convention-dto";

async function getSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = parseConventionBody(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const slug = parsed.data.slug;
    const other = await prisma.convention.findFirst({ where: { slug, id: { not: id } } });
    if (other) return NextResponse.json({ message: "Ce slug est déjà utilisé par une autre convention" }, { status: 409 });

    const updated = await prisma.convention.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error("PUT /api/admin/conventions/[id]:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.convention.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/conventions/[id]:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
