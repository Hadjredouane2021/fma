"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 justify-center py-2">
        <CheckCircle className="w-5 h-5 shrink-0" />
        <span className="font-semibold">{t("success")}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          required
          className="form-field pl-11 pr-4 py-3.5 rounded-full text-sm"
        />
      </div>
      <Button type="submit" variant="primary" isLoading={status === "loading"} size="md" className="sm:shrink-0">
        {t("button")}
      </Button>
    </form>
    {status === "error" && <p className="text-red-500 dark:text-red-400 text-sm text-center">{t("error")}</p>}
  </div>
  );
}
