"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  type MenuContent,
  type MenuItem,
  type MenuChild,
  createEmptyMenuItem,
  createEmptyMenuChild,
} from "@/lib/menu-site-public";

const inputBase =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1";

function ChildRow({
  child,
  onChange,
  onRemove,
}: {
  child: MenuChild;
  onChange: (c: MenuChild) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Label FR</label>
          <input value={child.labelFr} onChange={(e) => onChange({ ...child, labelFr: e.target.value })} className={inputBase} placeholder="Actualités" />
        </div>
        <div>
          <label className={labelCls}>Label EN</label>
          <input value={child.labelEn} onChange={(e) => onChange({ ...child, labelEn: e.target.value })} className={inputBase} placeholder="News" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Label AR</label>
          <input value={child.labelAr} onChange={(e) => onChange({ ...child, labelAr: e.target.value })} className={inputBase} dir="rtl" placeholder="الأخبار" />
        </div>
        <div>
          <label className={labelCls}>URL</label>
          <input value={child.href} onChange={(e) => onChange({ ...child, href: e.target.value })} className={inputBase} placeholder="/[locale]/actualites" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
          <Trash2 className="w-3 h-3" /> Supprimer
        </button>
      </div>
    </div>
  );
}

function ItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: MenuItem;
  onChange: (m: MenuItem) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const updateChild = (idx: number, c: MenuChild) => {
    const children = [...item.children];
    children[idx] = c;
    onChange({ ...item, children });
  };
  const removeChild = (idx: number) => {
    onChange({ ...item, children: item.children.filter((_, i) => i !== idx) });
  };
  const addChild = () => {
    onChange({ ...item, children: [...item.children, createEmptyMenuChild()] });
    setExpanded(true);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="w-4 h-4 text-[var(--text-3)] flex-shrink-0 cursor-grab" />
        <div className="flex-1 grid grid-cols-1 gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={labelCls}>Label FR</label>
              <input value={item.labelFr} onChange={(e) => onChange({ ...item, labelFr: e.target.value })} className={inputBase} placeholder="Actualités" />
            </div>
            <div>
              <label className={labelCls}>Label EN</label>
              <input value={item.labelEn} onChange={(e) => onChange({ ...item, labelEn: e.target.value })} className={inputBase} placeholder="News" />
            </div>
            <div>
              <label className={labelCls}>Label AR</label>
              <input value={item.labelAr} onChange={(e) => onChange({ ...item, labelAr: e.target.value })} className={inputBase} dir="rtl" placeholder="الأخبار" />
            </div>
          </div>
          <div>
            <label className={labelCls}>URL <span className="normal-case font-normal text-[var(--text-3)]">(utiliser [locale] pour la langue, ex: /[locale]/contact)</span></label>
            <input value={item.href} onChange={(e) => onChange({ ...item, href: e.target.value })} className={inputBase} placeholder="/[locale]/contact" />
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-[var(--bg-alt)] text-[var(--text-2)] transition-colors flex items-center gap-1 text-xs font-medium"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Sous-liens ({item.children.length})
          </button>
          <button type="button" onClick={onRemove} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-alt)] p-4 space-y-3">
          <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide">Sous-liens du menu déroulant</p>
          {item.children.map((child, idx) => (
            <ChildRow key={child.id} child={child} onChange={(c) => updateChild(idx, c)} onRemove={() => removeChild(idx)} />
          ))}
          <button type="button" onClick={addChild} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline transition-colors mt-1">
            <Plus className="w-3.5 h-3.5" /> Ajouter un sous-lien
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuForm({ initial }: { initial: MenuContent }) {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>(initial.items);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateItem = (idx: number, m: MenuItem) => {
    setItems((prev) => { const next = [...prev]; next[idx] = m; return next; });
  };
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const addItem = () => setItems((prev) => [...prev, createEmptyMenuItem()]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (res.ok) { setSuccess(true); router.refresh(); }
      else { const d = await res.json().catch(() => ({})); setError(d.message || "Erreur"); }
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <ItemRow key={item.id} item={item} onChange={(m) => updateItem(idx, m)} onRemove={() => removeItem(idx)} />
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--text-2)] hover:border-primary hover:text-primary transition-colors w-full justify-center"
      >
        <Plus className="w-4 h-4" /> Ajouter un élément de menu
      </button>

      {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
      {success && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Menu enregistré avec succès.</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={() => { setItems(initial.items); setSuccess(false); setError(""); }} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
