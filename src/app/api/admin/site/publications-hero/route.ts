import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { GALLERY_CATEGORIES } from "@/lib/galleries";

const PUBLICATION_TYPES = ["chiffres-cles", "faits-marquants", "courrier"] as const;
const ALLOWED_TYPES = [...PUBLICATION_TYPES, ...GALLERY_CATEGORIES] as const;
type PubType = typeof ALLOWED_TYPES[number];
const KEY = DB_KEYS.PUBLICATIONS_HERO;

const EMPTY_RECORD = Object.fromEntries(ALLOWED_TYPES.map((t) => [t, ""])) as Record<PubType, string>;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

async function readRecord(): Promise<Record<PubType, string>> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return { ...EMPTY_RECORD };
  try { return { ...EMPTY_RECORD, ...JSON.parse(row.value) }; } catch { return { ...EMPTY_RECORD }; }
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
  for (const t of ALLOWED_TYPES) {
    if (typeof body[t] === "string") current[t] = body[t];
  }
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(current), group: "site" },
    create: { key: KEY, value: JSON.stringify(current), group: "site" },
  });
  return NextResponse.json(current);
}
