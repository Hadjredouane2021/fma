"use client";

type ParticuliersCardIconProps = {
  icon: string;
  color: string;
};

/** Icône emoji uniquement — les images uploadées s'affichent en couverture sur toute la carte. */
export function ParticuliersCardIcon({ icon, color }: ParticuliersCardIconProps) {
  const trimmed = icon.trim();

  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${color} shadow-sm`}
    >
      <span className="text-2xl">{trimmed || "🛡️"}</span>
    </div>
  );
}
