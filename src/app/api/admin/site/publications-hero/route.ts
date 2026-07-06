import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import {
  emptyPublicationsHeroImages,
  mergePublicationsHeroImages,
  parsePublicationsHeroImagesFromSetting,
  type PublicationsHeroImages,
} from "@/lib/publications-hero-images";

const KEY = DB_KEYS.PUBLICATIONS_HERO;

async function getSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

async function readRecord(): Promise<PublicationsHeroImages> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  return parsePublicationsHeroImagesFromSetting(row?.value);
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await readRecord());
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const current = await readRecord();
  const merged = body ? mergePublicationsHeroImages(current, body) : emptyPublicationsHeroImages();

  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(merged), group: "site" },
    create: { key: KEY, value: JSON.stringify(merged), group: "site" },
  });
  return NextResponse.json(merged);
}
