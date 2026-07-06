import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateParticuliersContent } from "@/lib/particuliers-cache";
import {
  EMPTY_PARTICULIERS_HERO_IMAGE_URLS,
  normalizeParticuliersHeroImageUrls,
  parseParticuliersHeroImageUrlsFromSetting,
  type ParticuliersHeroImageUrls,
} from "@/lib/particuliers-hero-image";

const KEY = DB_KEYS.PARTICULIERS_HERO;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  return NextResponse.json(parseParticuliersHeroImageUrlsFromSetting(row?.value));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized: ParticuliersHeroImageUrls = body
    ? normalizeParticuliersHeroImageUrls(body)
    : EMPTY_PARTICULIERS_HERO_IMAGE_URLS;
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateParticuliersContent();
  return NextResponse.json(normalized);
}
