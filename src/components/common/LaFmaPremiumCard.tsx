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

  if (!hasTitle && !hasDesc) {
    return showAccent ? <div className="la-fma-org-card__accent" aria-hidden /> : null;
  }

  return (
    <>
      {showAccent ? <div className="la-fma-org-card__accent" aria-hidden /> : null}
      <div className="la-fma-org-card__head">
        <LaFmaCardIcon icon={icon} />
        <div className="la-fma-org-card__body">
          {hasTitle ? (
            <h3 className="la-fma-org-card__title font-display text-pretty break-words">{title}</h3>
          ) : null}
          {hasDesc ? <p className="la-fma-org-card__text">{description}</p> : null}
        </div>
      </div>
    </>
  );
}
