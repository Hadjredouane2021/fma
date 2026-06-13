import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";

const KEY = DB_KEYS.CONSEIL_FMA_IMAGES;

const DEFAULT_TITLE = { fr: "Le Conseil FMA", en: "The FMA Council", ar: "مجلس الاتحاد" };

type ConseilFmaItem = { url: string; link: string };
type ConseilFmaData = {
  title: { fr: string; en: string; ar: string };
  items: ConseilFmaItem[];
};

async function getSession() {
  try { return await auth(); } catch { return null; }
}

function normalizeItems(value: unknown): ConseilFmaItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry): ConseilFmaItem | null => {
      if (typeof entry === "string") return { url: entry, link: "" };
      if (entry && typeof entry === "object" && typeof (entry as { url?: unknown }).url === "string") {
        const link = (entry as { link?: unknown }).link;
        return { url: (entry as { url: string }).url, link: typeof link === "string" ? link.trim() : "" };
      }
      return null;
    })
    .filter((v): v is ConseilFmaItem => v !== null && v.url.trim().length > 0);
}

async function readData(): Promise<ConseilFmaData> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return { title: DEFAULT_TITLE, items: [] };
  try {
    const parsed = JSON.parse(row.value);
    if (Array.isArray(parsed)) {
      // legacy format: plain array of image URLs
      return { title: DEFAULT_TITLE, items: normalizeItems(parsed) };
    }
    const items = normalizeItems(parsed.images ?? parsed.items);
    const title = {
      fr: typeof parsed.title?.fr === "string" ? parsed.title.fr : DEFAULT_TITLE.fr,
      en: typeof parsed.title?.en === "string" ? parsed.title.en : DEFAULT_TITLE.en,
      ar: typeof parsed.title?.ar === "string" ? parsed.title.ar : DEFAULT_TITLE.ar,
    };
    return { title, items };
  } catch {
    return { title: DEFAULT_TITLE, items: [] };
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await readData());
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const items = normalizeItems(body.items ?? body.images);
  const title = {
    fr: typeof body.title?.fr === "string" ? body.title.fr.trim() : DEFAULT_TITLE.fr,
    en: typeof body.title?.en === "string" ? body.title.en.trim() : DEFAULT_TITLE.en,
    ar: typeof body.title?.ar === "string" ? body.title.ar.trim() : DEFAULT_TITLE.ar,
  };
  const data: ConseilFmaData = { title, items };
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(data), group: "site" },
    create: { key: KEY, value: JSON.stringify(data), group: "site" },
  });
  return NextResponse.json(data);
}
