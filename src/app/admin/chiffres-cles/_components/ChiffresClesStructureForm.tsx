"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  type ChiffresClesContent,
  type RevenueStructureRow,
  createEmptyRow,
  createNonVieAggregateRow,
  formatAmountFr,
  formatPercentFr,
  isAggregateRow,
  resolveRowValues,
  ROWS_MAX,
  ROWS_MIN,
  sumContribution,
  sumRevenue,
} from "@/lib/chiffres-cles-site-public";

type Locale = "fr" | "en" | "ar";

const TABS: { key: Locale; label: string }[] = [
  { key: "fr", label: "Français" },
  { key: "en", label: "English" },
  { key: "ar", label: "العربية" },
];

const inputBase =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1";
const card = "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4";

function LocalizedInput({
  label,
  value,
  onChange,
  tab,
  multiline = false,
}: {
  label: string;
  value: { fr: string; en: string; ar: string };
  onChange: (v: { fr: string; en: string; ar: string }) => void;
  tab: Locale;
  multiline?: boolean;
}) {
  const dir = tab === "ar" ? "rtl" : "ltr";
  return (
    <div>
      <p className={labelCls}>{label}</p>
      {multiline ? (
        <textarea
          rows={2}
          dir={dir}
          value={value[tab]}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className={inputBase}
        />
      ) : (
        <input
          type="text"
          dir={dir}
          value={value[tab]}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className={inputBase}
        />
      )}
    </div>
  );
}

function RowEditor({
  row,
  index,
  tab,
  allRows,
  onChange,
  onRemove,
  canRemove,
}: {
  row: RevenueStructureRow;
  index: number;
  tab: Locale;
  allRows: RevenueStructureRow[];
  onChange: (r: RevenueStructureRow) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const aggregated = isAggregateRow(row);
  const resolved = resolveRowValues(row, allRows);
  const selectableRows = allRows.filter((r) => r.id !== row.id && !isAggregateRow(r));

  const toggleAggregateId = (id: string) => {
    const current = row.aggregateRowIds ?? [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    onChange({ ...row, aggregateRowIds: next, revenue: "", contribution: "" });
  };

  return (
    <div className={`rounded-xl border bg-[var(--bg-surface)] p-3 ${aggregated ? "border-primary/40 ring-1 ring-primary/10" : "border-[var(--border)]"}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-3)]">
        <GripVertical className="h-4 w-4" />
        Ligne {index + 1}
        {aggregated && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            Somme automatique
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px_120px_auto]">
        <div>
          <p className={labelCls}>Catégorie ({tab})</p>
          <input
            type="text"
            dir={tab === "ar" ? "rtl" : "ltr"}
            value={row.category[tab]}
            onChange={(e) => onChange({ ...row, category: { ...row.category, [tab]: e.target.value } })}
            className={inputBase}
            placeholder="Automobile"
          />
        </div>
        <div>
          <p className={labelCls}>Chiffre d&apos;affaires</p>
          <input
            type="text"
            inputMode="decimal"
            value={aggregated ? formatAmountFr(resolved.revenue) : row.revenue}
            onChange={(e) => onChange({ ...row, revenue: e.target.value })}
            className={`${inputBase} text-right tabular-nums`}
            placeholder="16178.5"
            disabled={aggregated}
            readOnly={aggregated}
          />
        </div>
        <div>
          <p className={labelCls}>
            Contribution %
            <span className="font-normal normal-case text-[var(--text-3)] ml-1">(affiché sur l&apos;accueil)</span>
          </p>
          <input
            type="text"
            inputMode="decimal"
            value={aggregated ? resolved.contribution.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : row.contribution}
            onChange={(e) => onChange({ ...row, contribution: e.target.value })}
            className={`${inputBase} text-right tabular-nums`}
            placeholder="25.2"
            disabled={aggregated}
            readOnly={aggregated}
          />
        </div>
        <div className="flex items-end justify-end">
          <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-red-950/40"
            title="Supprimer la ligne"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <p className={labelCls}>Ligne agrégée (somme de taux / CA)</p>
        <label className="mb-2 flex items-center gap-2 text-sm text-[var(--text-2)]">
          <input
            type="checkbox"
            checked={aggregated}
            onChange={(e) =>
              onChange(
                e.target.checked
                  ? { ...row, aggregateRowIds: row.aggregateRowIds?.length ? row.aggregateRowIds : [], revenue: "", contribution: "" }
                  : { ...row, aggregateRowIds: undefined, revenue: row.revenue, contribution: row.contribution }
              )
            }
            className="rounded border-[var(--border)]"
          />
          Activer la somme automatique
        </label>
        {aggregated && (
          <div className="flex flex-wrap gap-2">
            {selectableRows.map((r) => {
              const checked = row.aggregateRowIds?.includes(r.id) ?? false;
              return (
                <label
                  key={r.id}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${checked ? "border-primary bg-primary/10 text-primary" : "border-[var(--border)] text-[var(--text-2)]"}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleAggregateId(r.id)}
                  />
                  {r.category.fr || r.id}
                  <span className="tabular-nums opacity-70">({r.contribution || "0"}%)</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChiffresClesStructureForm({ initial }: { initial: ChiffresClesContent }) {
  const router = useRouter();
  const [form, setForm] = useState<ChiffresClesContent>(initial);
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalRevenue = useMemo(() => sumRevenue(form.rows), [form.rows]);
  const totalContribution = useMemo(() => sumContribution(form.rows), [form.rows]);

  const updateRow = (idx: number, row: RevenueStructureRow) => {
    const rows = [...form.rows];
    rows[idx] = row;
    setForm({ ...form, rows });
  };

  const removeRow = (idx: number) => {
    if (form.rows.length <= ROWS_MIN) return;
    setForm({ ...form, rows: form.rows.filter((_, i) => i !== idx) });
  };

  const addRow = () => {
    if (form.rows.length >= ROWS_MAX) return;
    setForm({ ...form, rows: [...form.rows, createEmptyRow()] });
  };

  const addNonVieAggregate = () => {
    if (form.rows.length >= ROWS_MAX) return;
    if (form.rows.some((r) => r.id === "non-vie")) return;
    setForm({ ...form, rows: [...form.rows, createNonVieAggregateRow()] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/chiffres-cles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError((d.message as string) || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      <div className="flex gap-1 border border-[var(--border)] rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? "bg-primary text-white shadow-sm" : "text-[var(--text-2)] hover:bg-[var(--hover-bg)]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">En-tête du tableau</h3>
        <LocalizedInput label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} tab={tab} />
        <LocalizedInput label="Note d'unité" value={form.unitNote} onChange={(v) => setForm({ ...form, unitNote: v })} tab={tab} />
        <div className="grid gap-4 sm:grid-cols-3">
          <LocalizedInput
            label="Colonne catégorie (optionnel)"
            value={form.columnCategory}
            onChange={(v) => setForm({ ...form, columnCategory: v })}
            tab={tab}
          />
          <LocalizedInput
            label="Colonne chiffre d'affaires"
            value={form.columnRevenue}
            onChange={(v) => setForm({ ...form, columnRevenue: v })}
            tab={tab}
          />
          <LocalizedInput
            label="Colonne contribution"
            value={form.columnContribution}
            onChange={(v) => setForm({ ...form, columnContribution: v })}
            tab={tab}
          />
        </div>
        <LocalizedInput
          label="Libellé total"
          value={form.totalLabel}
          onChange={(v) => setForm({ ...form, totalLabel: v })}
          tab={tab}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[var(--text-1)]">
            Lignes du tableau ({form.rows.length}/{ROWS_MAX})
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={form.rows.length >= ROWS_MAX} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Ajouter une ligne
            </Button>
            {!form.rows.some((r) => r.id === "non-vie") && (
              <Button type="button" variant="outline" size="sm" onClick={addNonVieAggregate} disabled={form.rows.length >= ROWS_MAX} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Ligne « Assurance non vie »
              </Button>
            )}
          </div>
        </div>

        {form.rows.map((row, idx) => (
          <RowEditor
            key={row.id}
            row={row}
            index={idx}
            tab={tab}
            allRows={form.rows}
            onChange={(r) => updateRow(idx, r)}
            onRemove={() => removeRow(idx)}
            canRemove={form.rows.length > ROWS_MIN}
          />
        ))}

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <p className="font-semibold text-primary mb-1">Total calculé automatiquement</p>
          <p className="tabular-nums text-[var(--text-2)]">
            Chiffre d&apos;affaires : <strong className="text-[var(--text-1)]">{formatAmountFr(totalRevenue)}</strong>
            {" · "}
            Contribution : <strong className="text-[var(--text-1)]">{formatPercentFr(totalContribution)}</strong>
          </p>
        </div>
      </div>

      {/* Aperçu */}
      <div className={card}>
        <h3 className="text-sm font-bold text-primary mb-3">Aperçu</h3>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-3 py-2 text-left font-semibold">Catégorie</th>
                <th className="px-3 py-2 text-right font-semibold">{form.columnRevenue[tab] || form.columnRevenue.fr}</th>
                <th className="px-3 py-2 text-right font-semibold">{form.columnContribution[tab] || form.columnContribution.fr}</th>
              </tr>
            </thead>
            <tbody>
              {form.rows.map((row, i) => {
                const resolved = resolveRowValues(row, form.rows);
                return (
                <tr key={row.id} className={i % 2 === 0 ? "bg-[var(--bg)]" : "bg-[var(--bg-alt)]"}>
                  <td className={`px-3 py-2 ${isAggregateRow(row) ? "font-bold" : ""}`}>{row.category[tab] || row.category.fr || "—"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{resolved.revenue > 0 ? formatAmountFr(resolved.revenue) : "—"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{resolved.contribution > 0 ? formatPercentFr(resolved.contribution) : "—"}</td>
                </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-primary font-bold text-primary-foreground">
                <td className="px-3 py-2">{form.totalLabel[tab] || form.totalLabel.fr}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatAmountFr(totalRevenue)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatPercentFr(totalContribution)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Enregistré avec succès.</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => { setForm(initial); setSuccess(false); setError(""); }}
          disabled={loading}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Annuler
        </Button>
      </div>
    </form>
  );
}
