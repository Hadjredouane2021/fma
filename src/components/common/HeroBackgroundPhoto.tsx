import Image from "next/image";
import { localPublicImageUnoptimized } from "@/lib/utils";

type HeroBackgroundPhotoProps = {
  src: string;
};

export function HeroBackgroundPhoto({ src }: HeroBackgroundPhotoProps) {
  return (
    <div className="hero-bg-photo" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, (max-width: 1920px) 100vw, 2560px"
        quality={90}
        className="hero-bg-photo__img"
        unoptimized={localPublicImageUnoptimized(src)}
      />
    </div>
  );
}
