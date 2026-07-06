import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicationDataFromBody } from "@/lib/admin-publication-dto";
import { resolvePublicationPublishedAt } from "@/lib/publication-date";
import { syncAnnouncementPopup, revalidateAnnouncementPages } from "@/lib/announcement-popup";

async function getAdmin() {
  try { return await auth(); } catch { return null; }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const data = publicationDataFromBody(body);
    if (!data) {
      return NextResponse.json(
        { message: "Renseignez un titre dans au moins une langue (FR, EN ou AR)" },
        { status: 400 }
      );
    }
    if (data.status !== "PUBLISHED") data.announcePopup = false;

    const pub = await prisma.publication.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          data.status === "PUBLISHED" ? resolvePublicationPublishedAt(data) : null,
      },
    });
    if (data.announcePopup) {
      await syncAnnouncementPopup("publication", pub.id, true);
    }
    revalidateAnnouncementPages();
    return NextResponse.json(pub);
  } catch (e: unknown) {
    console.error("PUT publication:", e);
    return NextResponse.json({ message: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.publication.update({ where: { id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
