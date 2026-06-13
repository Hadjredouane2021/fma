import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    const { id } = await params;
    await prisma.contactMessage.update({ where: { id }, data: { status: "read" } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
