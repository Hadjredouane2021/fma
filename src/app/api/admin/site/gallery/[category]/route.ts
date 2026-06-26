import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  GALLERY_CONFIG,
  dbKeyForGallery,
  foldersToFlatItems,
  isFolderGalleryCategory,
  isGalleryCategory,
  normalizeGalleryFolders,
  normalizeGalleryItems,
  parseGalleryData,
} from "@/lib/galleries";
import { revalidateGalleryContent } from "@/lib/galleries-cache";

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { category } = await params;
  if (!isGalleryCategory(category)) {
    return NextResponse.json({ message: "Catégorie inconnue" }, { status: 400 });
  }

  const row = await prisma.setting.findUnique({ where: { key: dbKeyForGallery(category) } }).catch(() => null);
  return NextResponse.json(parseGalleryData(row?.value, category));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { category } = await params;
  if (!isGalleryCategory(category)) {
    return NextResponse.json({ message: "Catégorie inconnue" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const defaults = GALLERY_CONFIG[category].title;
  const title = {
    fr: typeof body.title?.fr === "string" ? body.title.fr.trim() : defaults.fr,
    en: typeof body.title?.en === "string" ? body.title.en.trim() : defaults.en,
    ar: typeof body.title?.ar === "string" ? body.title.ar.trim() : defaults.ar,
  };

  let data: { title: typeof title; items: ReturnType<typeof normalizeGalleryItems>; folders?: ReturnType<typeof normalizeGalleryFolders> };

  if (isFolderGalleryCategory(category)) {
    const legacyItems = normalizeGalleryItems(body.items ?? body.images);
    const folders = normalizeGalleryFolders(body.folders, legacyItems);
    data = { title, items: foldersToFlatItems(folders), folders };
  } else {
    const items = normalizeGalleryItems(body.items ?? body.images);
    data = { title, items };
  }
  const key = dbKeyForGallery(category);
  await prisma.setting.upsert({
    where: { key },
    update: { value: JSON.stringify(data), group: "site" },
    create: { key, value: JSON.stringify(data), group: "site" },
  });
  revalidateGalleryContent(category);
  return NextResponse.json(data);
}
