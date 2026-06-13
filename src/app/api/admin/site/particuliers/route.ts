import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_PARTICULIERS_CONTENT,
  normalizeParticuliersContent,
  PARTICULIERS_KEY,
} from "@/lib/particuliers-site-public";

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: PARTICULIERS_KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_PARTICULIERS_CONTENT);
  try { return NextResponse.json(normalizeParticuliersContent(JSON.parse(row.value))); }
  catch { return NextResponse.json(DEFAULT_PARTICULIERS_CONTENT); }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeParticuliersContent(body);
  await prisma.setting.upsert({
    where: { key: PARTICULIERS_KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: PARTICULIERS_KEY, value: JSON.stringify(normalized), group: "site" },
  });
  return NextResponse.json(normalized);
}
