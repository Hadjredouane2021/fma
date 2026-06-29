import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { routing } from "@/i18n/routing";
import {
  DEFAULT_SECTION_BACKGROUNDS,
  normalizeSectionBackgrounds,
} from "@/lib/section-backgrounds";
import { revalidateLayoutSettings } from "@/lib/site-settings-cache";

const KEY = DB_KEYS.SECTION_BACKGROUNDS;

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
  if (!row) return NextResponse.json(DEFAULT_SECTION_BACKGROUNDS);
  try {
    return NextResponse.json(normalizeSectionBackgrounds(JSON.parse(row.value)));
  } catch {
    return NextResponse.json(DEFAULT_SECTION_BACKGROUNDS);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeSectionBackgrounds(body);
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateLayoutSettings();
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, "layout");
    revalidatePath(`/${locale}/la-fma`);
    revalidatePath(`/${locale}/actualites`);
    revalidatePath(`/${locale}/publications`);
    revalidatePath(`/${locale}/particuliers`);
    revalidatePath(`/${locale}/entreprises`);
    revalidatePath(`/${locale}/decouvrir-le-secteur`);
    revalidatePath(`/${locale}/recherche`);
    revalidatePath(`/${locale}/contact`);
  }
  return NextResponse.json(normalized);
}
