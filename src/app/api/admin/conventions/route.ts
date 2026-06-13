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

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const list = await prisma.convention.findMany({ orderBy: [{ order: "asc" }, { signedAt: "desc" }, { titleFr: "asc" }] });
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/admin/conventions:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const parsed = parseConventionBody(body);
    if (!parsed.ok) return NextResponse.json({ message: parsed.message }, { status: 400 });

    const existing = await prisma.convention.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return NextResponse.json({ message: "Ce slug est déjà utilisé" }, { status: 409 });

    const created = await prisma.convention.create({ data: parsed.data });
    return NextResponse.json(created);
  } catch (e) {
    console.error("POST /api/admin/conventions:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
