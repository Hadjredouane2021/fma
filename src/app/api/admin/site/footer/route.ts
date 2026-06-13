import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_FOOTER_CONTENT, type FooterContent } from "@/lib/footer-site-public";
import { DB_KEYS } from "@/lib/db-keys";

const KEY = DB_KEYS.FOOTER_CONTENT;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

function normalizeFooter(input: unknown): FooterContent {
  if (!input || typeof input !== "object") return DEFAULT_FOOTER_CONTENT;
  const d = input as Partial<FooterContent>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  return {
    descriptionFr: str(d.descriptionFr, DEFAULT_FOOTER_CONTENT.descriptionFr),
    descriptionEn: str(d.descriptionEn, DEFAULT_FOOTER_CONTENT.descriptionEn),
    descriptionAr: str(d.descriptionAr, DEFAULT_FOOTER_CONTENT.descriptionAr),
    address: str(d.address, DEFAULT_FOOTER_CONTENT.address),
    phone: str(d.phone, DEFAULT_FOOTER_CONTENT.phone),
    email: str(d.email, DEFAULT_FOOTER_CONTENT.email),
    facebook: str(d.facebook, DEFAULT_FOOTER_CONTENT.facebook),
    linkedin: str(d.linkedin, DEFAULT_FOOTER_CONTENT.linkedin),
    twitter: str(d.twitter, DEFAULT_FOOTER_CONTENT.twitter),
    youtube: str(d.youtube, DEFAULT_FOOTER_CONTENT.youtube),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_FOOTER_CONTENT);
  return NextResponse.json(normalizeFooter(JSON.parse(row.value)));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeFooter(body);
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  return NextResponse.json(normalized);
}
