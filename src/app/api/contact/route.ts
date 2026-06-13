import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactConfirmation } from "@/lib/mailer";

const RATE_LIMIT = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = RATE_LIMIT.get(ip) || [];
  const recent = requests.filter((t) => now - t < 60_000);
  if (recent.length >= 5) return true;
  RATE_LIMIT.set(ip, [...recent, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) return NextResponse.json({ message: "Trop de requêtes" }, { status: 429 });

  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }
    await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, subject, message, ipAddress: ip, userAgent: req.headers.get("user-agent") || null },
    });
    sendContactConfirmation(email, name).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
