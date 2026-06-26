import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_FORMATIONS_CONTENT,
  normalizeFormationsContent,
  FORMATIONS_KEY,
} from "@/lib/formations-site-public";
import { revalidateFormationsContent } from "@/lib/formations-cache";

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
  const row = await prisma.setting.findUnique({ where: { key: FORMATIONS_KEY } }).catch(() => null);
  if (!row) return NextResponse.json(DEFAULT_FORMATIONS_CONTENT);
  try {
    return NextResponse.json(normalizeFormationsContent(JSON.parse(row.value)));
  } catch {
    return NextResponse.json(DEFAULT_FORMATIONS_CONTENT);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const normalized = normalizeFormationsContent(body);
  await prisma.setting.upsert({
    where: { key: FORMATIONS_KEY },
    update: { value: JSON.stringify(normalized), group: "site" },
    create: { key: FORMATIONS_KEY, value: JSON.stringify(normalized), group: "site" },
  });
  revalidateFormationsContent();
  return NextResponse.json(normalized);
}
