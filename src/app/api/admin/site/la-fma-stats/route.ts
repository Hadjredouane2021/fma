import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateLaFmaPageData } from "@/lib/la-fma-page-cache";
import {
  DEFAULT_LA_FMA_STATS_IMAGES,
  normalizeLaFmaStatsImages,
  parseLaFmaStatsImagesFromSetting,
  type LaFmaStatsImages,
} from "@/lib/la-fma-stats-image";

const KEY = DB_KEYS.LA_FMA_STATS_IMAGE;

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
  return NextResponse.json(parseLaFmaStatsImagesFromSetting(row?.value));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized: LaFmaStatsImages = body ? normalizeLaFmaStatsImages(body) : DEFAULT_LA_FMA_STATS_IMAGES;

  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateLaFmaPageData();
  return NextResponse.json(normalized);
}
