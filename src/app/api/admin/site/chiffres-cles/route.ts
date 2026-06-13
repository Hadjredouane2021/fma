import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CHIFFRES_CLES_KEY,
  DEFAULT_CHIFFRES_CLES_CONTENT,
  normalizeChiffresClesContent,
} from "@/lib/chiffres-cles-site-public";

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: CHIFFRES_CLES_KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_CHIFFRES_CLES_CONTENT);
  try {
    return NextResponse.json(normalizeChiffresClesContent(JSON.parse(row.value)));
  } catch {
    return NextResponse.json(DEFAULT_CHIFFRES_CLES_CONTENT);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeChiffresClesContent(body);
  await prisma.setting.upsert({
    where: { key: CHIFFRES_CLES_KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: CHIFFRES_CLES_KEY, value: JSON.stringify(normalized), group: "site" },
  });
  return NextResponse.json(normalized);
}
