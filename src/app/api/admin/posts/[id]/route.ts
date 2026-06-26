import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateLatestPosts } from "@/lib/posts-cache";

async function getAdmin() {
  try { return await auth(); } catch { return null; }
}

async function syncAnnouncementPopup(postId: string, enabled: boolean) {
  if (!enabled) return;
  await prisma.post.updateMany({
    where: { id: { not: postId }, announcePopup: true, deletedAt: null },
    data: { announcePopup: false },
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    if (body.status !== "PUBLISHED") body.announcePopup = false;
    const { categoryId, ...rest } = body;
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...rest,
        categoryId: categoryId || null,
        publishedAt: body.status === "PUBLISHED"
          ? (body.publishedAt ? new Date(body.publishedAt as string) : new Date())
          : null,
      },
    });
    if (body.announcePopup === true) {
      await syncAnnouncementPopup(post.id, true);
    }
    revalidateLatestPosts();
    return NextResponse.json(post);
  } catch (e: unknown) {
    console.error("PUT post:", e);
    return NextResponse.json({ message: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdmin();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
    revalidateLatestPosts();
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("DELETE post:", e);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
