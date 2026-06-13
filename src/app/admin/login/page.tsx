"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GradientBackground } from "@/components/ui/gradient-background";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push("/admin/dashboard");
    else setError("Email ou mot de passe incorrect.");
  };

  return (
    <GradientBackground overlay overlayOpacity={0.45} animationDuration={12} className="p-4">
      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="glass-liquid overflow-hidden rounded-3xl card-hover">
          {/* Header */}
          <div className="relative z-10 bg-primary px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-gold text-lg font-black">FMA</span>
            </div>
            <h1 className="text-xl font-bold text-white">Administration</h1>
            <p className="text-white/50 text-xs mt-1">Fédération Marocaine de l&apos;Assurance</p>
          </div>

          {/* Form */}
          <div className="relative z-10 px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fma.org.ma"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 text-sm text-[var(--text-1)] transition-colors placeholder:text-[var(--text-3)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 pr-11 text-sm text-[var(--text-1)] transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" shape="rounded" size="lg" isLoading={loading} className="w-full">
                {!loading && <Lock className="w-4 h-4" />}
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-[var(--text-3)]">
              Accès réservé aux administrateurs FMA
            </p>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}
