import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import {
  EMPTY_ACTUALITES_HERO_IMAGE_URLS,
  normalizeActualitesHeroImageUrls,
  parseActualitesHeroImageUrlsFromSetting,
  type ActualitesHeroImageUrls,
} from "@/lib/actualites-hero-image";

const KEY = DB_KEYS.ACTUALITES_HERO;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  return NextResponse.json(parseActualitesHeroImageUrlsFromSetting(row?.value));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized: ActualitesHeroImageUrls = body
    ? normalizeActualitesHeroImageUrls(body)
    : EMPTY_ACTUALITES_HERO_IMAGE_URLS;
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  return NextResponse.json(normalized);
}
