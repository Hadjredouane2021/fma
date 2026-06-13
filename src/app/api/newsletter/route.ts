import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterConfirmation } from "@/lib/mailer";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, locale = "fr", name } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.active) return NextResponse.json({ message: "Déjà inscrit" }, { status: 409 });

    const token = randomBytes(32).toString("hex");
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, name: name || null, locale, token },
      update: { token, active: false },
    });
    sendNewsletterConfirmation(email, token).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/fr", req.url));
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { token } });
  if (!subscriber) return NextResponse.redirect(new URL("/fr", req.url));
  await prisma.newsletterSubscriber.update({
    where: { token },
    data: { active: true, confirmedAt: new Date(), token: null },
  });
  return NextResponse.redirect(new URL("/fr?newsletter=confirmed", req.url));
}
