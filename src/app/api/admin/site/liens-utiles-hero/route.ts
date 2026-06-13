import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";

const KEY = DB_KEYS.LIENS_UTILES_HERO;

async function getSession() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const row = await prisma.setting.findUnique({ where: { key: KEY } }).catch(() => null);
  return NextResponse.json({ imageUrl: row?.value ?? "" });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const { imageUrl } = await req.json().catch(() => ({ imageUrl: "" }));
  const value = typeof imageUrl === "string" ? imageUrl.trim() : "";
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value, group: "site" },
    create: { key: KEY, value, group: "site" },
  });
  return NextResponse.json({ imageUrl: value });
}
