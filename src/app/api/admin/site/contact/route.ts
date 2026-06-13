import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CONTACT_CONTENT, normalizeContactContent } from "@/lib/contact-site-public";
import { DB_KEYS } from "@/lib/db-keys";

const KEY = DB_KEYS.CONTACT_CONTENT;

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
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_CONTACT_CONTENT);
  return NextResponse.json(normalizeContactContent(JSON.parse(row.value)));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeContactContent(body);
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  return NextResponse.json(normalized);
}
