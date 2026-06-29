import { NextResponse } from "next/server";
import { getSiteLogo } from "@/lib/site-settings-cache";

/** Logo public (header / footer) — lu depuis la config admin */
export async function GET() {
  const logo = await getSiteLogo();
  return NextResponse.json(logo, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
