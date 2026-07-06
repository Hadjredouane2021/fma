import Image from "next/image";
import { localPublicImageUnoptimized } from "@/lib/utils";

type HomeHeroBackgroundPreviewProps = {
  src: string;
  alt?: string;
};

/** Aperçu admin — même cadrage et hauteur minimale que le hero accueil public. */
export function HomeHeroBackgroundPreview({
  src,
  alt = "Aperçu du fond du hero",
}: HomeHeroBackgroundPreviewProps) {
  return (
    <div className="hero-home--has-photo relative w-full min-h-[max(28rem,100dvh)] overflow-hidden">
      <div className="hero-bg-photo">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, (max-width: 1920px) 100vw, 2560px"
          className="hero-bg-photo__img"
          unoptimized={localPublicImageUnoptimized(src)}
        />
      </div>
    </div>
  );
}
