import { AlertTriangle } from "lucide-react";

export function DbUnavailableBanner() {
  return (
    <div className="relative z-[200] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-amber-950">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      Merci de vous connecter à la base de données. Le contenu affiché est temporaire.
    </div>
  );
}
