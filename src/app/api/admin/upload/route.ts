import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  ADMIN_IMAGE_FORMATS_LABEL,
  ADMIN_IMAGE_MIMES,
  ADMIN_MAX_HERO_IMAGE_BYTES,
  ADMIN_MAX_IMAGE_BYTES,
  ADMIN_MAX_SVG_BYTES,
  ADMIN_SVG_MIME,
} from "@/lib/admin-upload";
import { prisma } from "@/lib/prisma";

/** Dossier → type de fichier autorisé */
const FOLDER_RULES: Record<string, "image" | "pdf"> = {
  posts: "image",
  "publications-covers": "image",
  publications: "pdf",
  conventions: "pdf",
  "conventions-hero": "image",
  "formations-hero": "image",
  "formations-icons": "image",
  "publications-hero": "image",
  "actualites-hero": "image",
  "liens-utiles-hero": "image",
  "vocabulaire-hero": "image",
  "liens-utiles-logos": "image",
  "particuliers-hero": "image",
  "particuliers-icons": "image",
  "entreprises-hero": "image",
  "entreprises-icons": "image",
  "contact-hero": "image",
  "la-fma-stats": "image",
  "la-fma-icons": "image",
  "gallery-interventions-fma": "image",
  "gallery-reseaux-sociaux": "image",
  "hero-backgrounds": "image",
  "key-figures-hero": "image",
  team: "image",
  members: "image",
  "site-logo": "image",
  "site-spinner": "image",
};

const IMAGE_MIMES = ADMIN_IMAGE_MIMES;
const SVG_MIME = ADMIN_SVG_MIME;
const MAX_IMAGE = ADMIN_MAX_IMAGE_BYTES;
const MAX_SVG = ADMIN_MAX_SVG_BYTES;
const MAX_HERO_IMAGE = ADMIN_MAX_HERO_IMAGE_BYTES;
const MAX_PDF = 20 * 1024 * 1024;

function allowedImageMimes(): Set<string> {
  return IMAGE_MIMES;
}

function imageFormatsLabel(): string {
  return ADMIN_IMAGE_FORMATS_LABEL;
}

function resolveImageMime(file: File): string {
  const mime = file.type?.trim() ?? "";
  if (mime) return mime;
  if (file.name.toLowerCase().endsWith(".svg")) return SVG_MIME;
  return mime;
}

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Corps de requête invalide" }, { status: 400 });
  }

  const raw = formData.get("file");
  if (!raw || typeof raw === "string" || raw.size === 0) {
    return NextResponse.json({ message: "Fichier manquant" }, { status: 400 });
  }
  const file = raw;

  const subfolder = ((formData.get("folder") as string) || "posts").trim();
  if (!/^[\w-]+$/.test(subfolder) || !(subfolder in FOLDER_RULES)) {
    return NextResponse.json({ message: "Dossier d’upload non autorisé" }, { status: 400 });
  }

  const rule = FOLDER_RULES[subfolder];
  let mime = rule === "image" ? resolveImageMime(file) : file.type;

  if (rule === "image") {
    const allowed = allowedImageMimes();
    if (!mime || !allowed.has(mime)) {
      return NextResponse.json({ message: `Formats image : ${imageFormatsLabel()}` }, { status: 400 });
    }
    const maxSize =
      mime === SVG_MIME
        ? MAX_SVG
        : subfolder === "hero-backgrounds" || subfolder === "key-figures-hero" || subfolder === "la-fma-stats"
          ? MAX_HERO_IMAGE
          : MAX_IMAGE;
    if (file.size > maxSize) {
      const maxKo = mime === SVG_MIME ? Math.round(maxSize / 1024) : Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          message:
            mime === SVG_MIME
              ? `SVG trop volumineux (max ${maxKo} Ko)`
              : `Image trop volumineuse (max ${maxKo} Mo)`,
        },
        { status: 400 }
      );
    }
  } else {
    if (mime !== "application/pdf") {
      return NextResponse.json({ message: "Seuls les fichiers PDF sont acceptés dans ce dossier" }, { status: 400 });
    }
    if (file.size > MAX_PDF) {
      return NextResponse.json({ message: "PDF trop volumineux (max 20 Mo)" }, { status: 400 });
    }
  }

  const originalName = file.name || "file";
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = EXT[mime] ?? ".bin";
  const safeBase = `${Date.now()}-${randomBytes(6).toString("hex")}`;
  const filename = `${safeBase}${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buf);

  const url = `/uploads/${subfolder}/${filename}`;

  try {
    await prisma.media.create({
      data: {
        filename,
        originalName: originalName.slice(0, 255),
        mimeType: mime,
        size: file.size,
        url,
        folder: subfolder,
      },
    });
  } catch (e) {
    console.error("media create:", e);
  }

  return NextResponse.json({ url });
}
