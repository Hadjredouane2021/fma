import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { publicationDataFromBody } from "@/lib/admin-publication-dto";
import { resolvePublicationPublishedAt } from "@/lib/publication-date";
import { syncAnnouncementPopup, revalidateAnnouncementPages } from "@/lib/announcement-popup";

async function getAdmin() {
  try { return await auth(); } catch { return null; }
}

export async function GET() {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  try {
    const publications = await prisma.publication.findMany({
      where: { deletedAt: null },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(publications);
  } catch (e) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.titleFr) return NextResponse.json({ message: "Titre requis" }, { status: 400 });

    let slug = (typeof body.slug === "string" && body.slug.trim()) || generateSlug(String(body.titleFr));
    const existing = await prisma.publication.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const data = publicationDataFromBody(body);
    if (data.status !== "PUBLISHED") data.announcePopup = false;

    const pub = await prisma.publication.create({
      data: {
        ...data,
        slug,
        publishedAt:
          data.status === "PUBLISHED" ? resolvePublicationPublishedAt(data) : null,
      },
    });
    if (data.announcePopup) {
      await syncAnnouncementPopup("publication", pub.id, true);
    }
    revalidateAnnouncementPages();
    return NextResponse.json(pub, { status: 201 });
  } catch (e: unknown) {
    console.error("POST publication:", e);
    return NextResponse.json({ message: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
