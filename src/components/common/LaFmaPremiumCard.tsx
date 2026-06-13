import { LaFmaCardIcon } from "@/components/common/LaFmaCardIcon";

type LaFmaPremiumCardProps = {
  icon: string;
  title?: string;
  description?: string;
};

export function LaFmaPremiumCard({ icon, title, description }: LaFmaPremiumCardProps) {
  const hasTitle = Boolean(title?.trim());
  const hasDesc = Boolean(description?.trim());

  return (
    <>
      <div className="la-fma-org-card__accent" aria-hidden />
      <div className="la-fma-org-card__head">
        <LaFmaCardIcon icon={icon} />
        {hasTitle && !hasDesc ? (
          <p className="la-fma-org-card__text la-fma-mission-card__solo">{title}</p>
        ) : hasTitle ? (
          <h3 className="la-fma-org-card__title font-display">{title}</h3>
        ) : hasDesc ? (
          <p className="la-fma-org-card__text la-fma-mission-card__solo">{description}</p>
        ) : null}
      </div>
      {hasDesc && hasTitle && <p className="la-fma-org-card__text">{description}</p>}
    </>
  );
}
