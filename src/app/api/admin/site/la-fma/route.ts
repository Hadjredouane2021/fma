import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLaFmaContent, saveLaFmaContent } from "@/lib/site-content";

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
    const content = await getLaFmaContent();
    return NextResponse.json(content);
  } catch (e) {
    console.error("GET /api/admin/site/la-fma:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = (await req.json()) as unknown;
    const saved = await saveLaFmaContent(body);
    return NextResponse.json(saved);
  } catch (e: unknown) {
    console.error("PUT /api/admin/site/la-fma:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
