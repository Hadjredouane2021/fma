import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { revalidateFormationsContent } from "@/lib/formations-cache";

const KEY = DB_KEYS.FORMATIONS_HERO;

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
  const { imageUrl } = (await req.json()) as { imageUrl: string };
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: imageUrl ?? "", group: "site" },
    create: { key: KEY, value: imageUrl ?? "", group: "site" },
  });
  revalidateFormationsContent();
  return NextResponse.json({ imageUrl });
}
