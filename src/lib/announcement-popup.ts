import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { revalidateLatestPosts } from "@/lib/posts-cache";
import { revalidatePublicationAnnouncements } from "@/lib/publications-cache";

/** Une seule annonce popup active sur tout le site (actualité ou publication). */
export async function syncAnnouncementPopup(
  source: "post" | "publication",
  id: string,
  enabled: boolean
) {
  if (!enabled) return;

  await prisma.$transaction([
    prisma.post.updateMany({
      where: source === "post" ? { id: { not: id } } : {},
      data: { announcePopup: false },
    }),
    prisma.publication.updateMany({
      where: source === "publication" ? { id: { not: id } } : {},
      data: { announcePopup: false },
    }),
  ]);
}

export function revalidateAnnouncementPages() {
  revalidateLatestPosts();
  revalidatePublicationAnnouncements();
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, "layout");
  }
}
