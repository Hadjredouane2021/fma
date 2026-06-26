import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { syncAnnouncementPopup, revalidateAnnouncementPages } from "@/lib/announcement-popup";

async function getAdmin() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const posts = await prisma.post.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("GET posts:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.titleFr || !body.contentFr) {
      return NextResponse.json({ message: "Titre et contenu requis" }, { status: 400 });
    }
    if (body.status !== "PUBLISHED") body.announcePopup = false;

    // Generate unique slug
    let slug = body.slug || generateSlug(body.titleFr);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const { categoryId, ...rest } = body;
    const post = await prisma.post.create({
      data: {
        ...rest,
        slug,
        categoryId: categoryId || null,
        publishedAt: body.status === "PUBLISHED"
          ? (body.publishedAt ? new Date(body.publishedAt as string) : new Date())
          : null,
      },
    });
    if (body.announcePopup === true) {
      await syncAnnouncementPopup("post", post.id, true);
    }
    revalidateAnnouncementPages();
    return NextResponse.json(post, { status: 201 });
  } catch (e: unknown) {
    console.error("POST posts:", e);
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
