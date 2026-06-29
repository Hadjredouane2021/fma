import { LaFmaCardIcon } from "@/components/common/LaFmaCardIcon";

type LaFmaPremiumCardProps = {
  icon: string;
  title?: string;
  description?: string;
  showAccent?: boolean;
};

export function LaFmaPremiumCard({
  icon,
  title,
  description,
  showAccent = true,
}: LaFmaPremiumCardProps) {
  const hasTitle = Boolean(title?.trim());
  const hasDesc = Boolean(description?.trim());

  return (
    <>
      {showAccent ? <div className="la-fma-org-card__accent" aria-hidden /> : null}
      <div className="la-fma-org-card__head">
        <LaFmaCardIcon icon={icon} />
        {hasTitle && !hasDesc ? (
          <p className="la-fma-org-card__text la-fma-mission-card__solo">{title}</p>
        ) : hasTitle ? (
          <h3 className="la-fma-org-card__title font-display text-pretty break-words">{title}</h3>
        ) : hasDesc ? (
          <p className="la-fma-org-card__text la-fma-mission-card__solo">{description}</p>
        ) : null}
      </div>
      {hasDesc && hasTitle && <p className="la-fma-org-card__text">{description}</p>}
    </>
  );
}
