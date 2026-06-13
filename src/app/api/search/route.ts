import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q || q.length < 2) return NextResponse.json({ posts: [], publications: [] });

  const [posts, publications] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        OR: [
          { titleFr: { contains: q } },
          { titleEn: { contains: q } },
          { excerptFr: { contains: q } },
          { contentFr: { contains: q } },
        ],
      },
      select: { id: true, slug: true, titleFr: true, titleEn: true, excerptFr: true, featuredImage: true, publishedAt: true },
      take: 5,
    }),
    prisma.publication.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        OR: [
          { titleFr: { contains: q } },
          { titleEn: { contains: q } },
          { descriptionFr: { contains: q } },
        ],
      },
      select: { id: true, slug: true, titleFr: true, titleEn: true, type: true, year: true },
      take: 5,
    }),
  ]);

  return NextResponse.json({ posts, publications, query: q });
}
