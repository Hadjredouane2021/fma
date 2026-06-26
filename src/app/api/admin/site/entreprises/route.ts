import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ENTREPRISES_CONTENT,
  normalizeEntreprisesContent,
  ENTREPRISES_KEY,
} from "@/lib/entreprises-site-public";
import { revalidateEntreprisesContent } from "@/lib/entreprises-cache";

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: ENTREPRISES_KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_ENTREPRISES_CONTENT);
  try { return NextResponse.json(normalizeEntreprisesContent(JSON.parse(row.value))); }
  catch { return NextResponse.json(DEFAULT_ENTREPRISES_CONTENT); }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeEntreprisesContent(body);
  await prisma.setting.upsert({
    where: { key: ENTREPRISES_KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: ENTREPRISES_KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateEntreprisesContent();
  return NextResponse.json(normalized);
}
