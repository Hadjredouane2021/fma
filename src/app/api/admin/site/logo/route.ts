import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_LOGO, normalizeSiteLogo } from "@/lib/site-logo";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateLayoutSettings } from "@/lib/site-settings-cache";
import { routing } from "@/i18n/routing";

const KEY = DB_KEYS.SITE_LOGO;

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
  if (!row) return NextResponse.json(DEFAULT_SITE_LOGO);
  return NextResponse.json(normalizeSiteLogo(JSON.parse(row.value)));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeSiteLogo(body);
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateLayoutSettings();
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, "layout");
  }
  return NextResponse.json(normalized);
}
