import { NextResponse } from "next/server";
import { fetchSiteAnnouncements } from "@/lib/site-announcements";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const announcements = await fetchSiteAnnouncements();
    return NextResponse.json(announcements, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[api/site/announcement] GET failed:", error);
    return NextResponse.json({ news: null, publication: null }, { status: 500 });
  }
}
