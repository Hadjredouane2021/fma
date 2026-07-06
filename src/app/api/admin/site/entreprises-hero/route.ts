import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateEntreprisesContent } from "@/lib/entreprises-cache";
import {
  EMPTY_ENTREPRISES_HERO_IMAGE_URLS,
  normalizeEntreprisesHeroImageUrls,
  parseEntreprisesHeroImageUrlsFromSetting,
  type EntreprisesHeroImageUrls,
} from "@/lib/entreprises-hero-image";

const KEY = DB_KEYS.ENTREPRISES_HERO;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  return NextResponse.json(parseEntreprisesHeroImageUrlsFromSetting(row?.value));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized: EntreprisesHeroImageUrls = body
    ? normalizeEntreprisesHeroImageUrls(body)
    : EMPTY_ENTREPRISES_HERO_IMAGE_URLS;
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateEntreprisesContent();
  return NextResponse.json(normalized);
}
