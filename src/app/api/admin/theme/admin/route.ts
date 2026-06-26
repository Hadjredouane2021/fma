import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_ADMIN_THEME, normalizeAdminTheme } from "@/lib/admin-theme";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateLayoutSettings } from "@/lib/site-settings-cache";

const KEY = DB_KEYS.ADMIN_THEME;

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
  if (!row) return NextResponse.json(DEFAULT_ADMIN_THEME);
  return NextResponse.json(normalizeAdminTheme(JSON.parse(row.value)));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeAdminTheme(body);
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "admin" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "admin" },
  });
  revalidateLayoutSettings();
  return NextResponse.json(normalized);
}
