import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MENU_CONTENT, type MenuContent, type MenuItem, type MenuChild } from "@/lib/menu-site-public";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateLayoutSettings } from "@/lib/site-settings-cache";

const KEY = DB_KEYS.MENU_CONTENT;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

function normalizeChild(c: unknown): MenuChild | null {
  if (!c || typeof c !== "object") return null;
  const d = c as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  if (!str(d.labelFr) && !str(d.href)) return null;
  return {
    id: str(d.id) || Math.random().toString(36).slice(2, 9),
    labelFr: str(d.labelFr),
    labelEn: str(d.labelEn),
    labelAr: str(d.labelAr),
    href: str(d.href),
  };
}

function normalizeItem(item: unknown): MenuItem | null {
  if (!item || typeof item !== "object") return null;
  const d = item as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  if (!str(d.labelFr) && !str(d.href)) return null;
  const children = Array.isArray(d.children)
    ? (d.children as unknown[]).map(normalizeChild).filter(Boolean) as MenuChild[]
    : [];
  return {
    id: str(d.id) || Math.random().toString(36).slice(2, 9),
    labelFr: str(d.labelFr),
    labelEn: str(d.labelEn),
    labelAr: str(d.labelAr),
    href: str(d.href),
    children,
  };
}

function normalizeMenu(input: unknown): MenuContent {
  if (!input || typeof input !== "object") return DEFAULT_MENU_CONTENT;
  const d = input as Record<string, unknown>;
  if (!Array.isArray(d.items) || d.items.length === 0) return DEFAULT_MENU_CONTENT;
  const items = (d.items as unknown[]).map(normalizeItem).filter(Boolean) as MenuItem[];
  return { items: items.length ? items : DEFAULT_MENU_CONTENT.items };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_MENU_CONTENT);
  try { return NextResponse.json(normalizeMenu(JSON.parse(row.value))); }
  catch { return NextResponse.json(DEFAULT_MENU_CONTENT); }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeMenu(body);
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateLayoutSettings();
  return NextResponse.json(normalized);
}
