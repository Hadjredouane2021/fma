"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import type { Locale } from "@/types";

interface ContactFormProps { locale: Locale; }

const SUBJECTS_FR = ["Information générale", "Publications", "Formations", "Adhésion", "Presse", "Autre"];
const SUBJECTS_EN = ["General information", "Publications", "Training", "Membership", "Press", "Other"];
const SUBJECTS_AR = ["معلومات عامة", "المنشورات", "التدريبات", "العضوية", "الصحافة", "أخرى"];

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const subjects = locale === "ar" ? SUBJECTS_AR : locale === "en" ? SUBJECTS_EN : SUBJECTS_FR;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-primary mb-2">{t("success")}</h3>
        <p className="text-[var(--text-2)] text-sm mb-6">Nous vous répondrons dans les plus brefs délais.</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          {locale === "ar" ? "إرسال رسالة أخرى" : locale === "en" ? "Send another message" : "Envoyer un autre message"}
        </Button>
      </div>
    );
  }

  const inputClass = "form-field px-4 py-3";
  const labelClass = "block text-sm font-medium text-[var(--text-1)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>{t("name")} <span className="text-red-500 dark:text-red-400">*</span></label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("email")} <span className="text-red-500 dark:text-red-400">*</span></label>
          <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>{t("phone")}</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("subject")} <span className="text-red-500 dark:text-red-400">*</span></label>
          <select required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass}>
            <option value="">{locale === "ar" ? "اختر موضوعاً" : locale === "en" ? "Select a subject" : "Choisir un sujet"}</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>{t("message")} <span className="text-red-500 dark:text-red-400">*</span></label>
        <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      {status === "error" && <p className="text-red-500 dark:text-red-400 text-sm">{t("error")}</p>}
      <Button type="submit" variant="primary" size="lg" isLoading={status === "loading"} className="w-full">
        {t("send")}
      </Button>
    </form>
  );
}
