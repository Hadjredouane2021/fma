"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { FontFamily, FontSize, TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useCallback, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Undo, Redo, Link as LinkIcon, Unlink,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Minus, Quote, Code2, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonToolbarActive, buttonToolbarInactive, buttonBase } from "@/lib/button-styles";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  minHeight?: string;
}

function ToolbarBtn({
  onClick, active = false, disabled = false, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        buttonBase,
        "transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-100 focus-visible:ring-offset-0",
        active ? buttonToolbarActive : buttonToolbarInactive
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-5 bg-[var(--border)] mx-1 flex-shrink-0" />;
}

function wordCount(html: string): number {
  return html.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
}

const FONT_FAMILIES = [
  { label: "Par défaut", value: "" },
  { label: "Gotham", value: "Gotham, system-ui, sans-serif" },
  { label: "IBM Plex Arabic", value: "var(--font-ibm-plex-arabic), Tahoma, Arial, sans-serif" },
] as const;

const FONT_SIZES = [
  { label: "Par défaut", value: "" },
  { label: "12 px", value: "12px" },
  { label: "14 px", value: "14px" },
  { label: "16 px", value: "16px" },
  { label: "18 px", value: "18px" },
  { label: "20 px", value: "20px" },
  { label: "24 px", value: "24px" },
  { label: "28 px", value: "28px" },
  { label: "32 px", value: "32px" },
] as const;

const toolbarSelectClass =
  "h-8 max-w-[9.5rem] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 text-xs font-medium text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function RichTextEditor({
  value, onChange, placeholder = "Rédigez votre contenu…", dir = "ltr", minHeight = "280px",
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [htmlDraft, setHtmlDraft] = useState(value);
  const [, setToolbarTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline hover:text-gold" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose-fma focus:outline-none min-h-[inherit] p-4",
        dir,
      },
    },
    onUpdate({ editor: ed }) {
      const html = ed.getHTML();
      setHtmlDraft(html);
      onChange(html);
    },
    onSelectionUpdate() {
      setToolbarTick((t) => t + 1);
    },
    onTransaction() {
      setToolbarTick((t) => t + 1);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setHtmlDraft(value);
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien :", prev || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const switchToHtml = () => {
    const next = editor?.getHTML() ?? htmlDraft;
    setHtmlDraft(next);
    onChange(next);
    setMode("html");
  };

  const switchToVisual = () => {
    if (editor) {
      editor.commands.setContent(htmlDraft || "", { emitUpdate: false });
    }
    onChange(htmlDraft);
    setMode("visual");
  };

  const handleHtmlChange = (raw: string) => {
    setHtmlDraft(raw);
    onChange(raw);
  };

  if (!editor) return (
    <div className="border border-[var(--border)] rounded-xl bg-[var(--bg-surface)] animate-pulse" style={{ minHeight }} />
  );

  const iconSize = "w-4 h-4";
  const currentHtml = mode === "html" ? htmlDraft : editor.getHTML();
  const currentFontFamily = editor.getAttributes("textStyle").fontFamily ?? "";
  const currentFontSize = editor.getAttributes("textStyle").fontSize ?? "";

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg)] focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <ToolbarBtn
          onClick={mode === "visual" ? switchToHtml : switchToVisual}
          active={mode === "html"}
          title={mode === "visual" ? "Passer en mode HTML" : "Passer en mode visuel"}
        >
          {mode === "visual" ? <Code2 className={iconSize} /> : <Eye className={iconSize} />}
        </ToolbarBtn>
        <span className="mr-1 text-[10px] font-bold uppercase tracking-wide text-[var(--text-3)]">
          {mode === "html" ? "HTML" : "Visuel"}
        </span>

        {mode === "visual" ? (
          <>
            <Separator />

            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annuler (Ctrl+Z)">
              <Undo className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rétablir (Ctrl+Y)">
              <Redo className={iconSize} />
            </ToolbarBtn>

            <Separator />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Titre H1">
              <Heading1 className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre H2">
              <Heading2 className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Titre H3">
              <Heading3 className={iconSize} />
            </ToolbarBtn>

            <Separator />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras (Ctrl+B)">
              <Bold className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique (Ctrl+I)">
              <Italic className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné (Ctrl+U)">
              <UnderlineIcon className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré">
              <Strikethrough className={iconSize} />
            </ToolbarBtn>

            <Separator />

            <select
              value={currentFontFamily}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) editor.chain().focus().unsetFontFamily().run();
                else editor.chain().focus().setFontFamily(value).run();
              }}
              className={toolbarSelectClass}
              title="Police"
              aria-label="Police"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.label} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <select
              value={currentFontSize}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) editor.chain().focus().unsetFontSize().run();
                else editor.chain().focus().setFontSize(value).run();
              }}
              className={cn(toolbarSelectClass, "max-w-[6.5rem]")}
              title="Taille du texte"
              aria-label="Taille du texte"
            >
              {FONT_SIZES.map((size) => (
                <option key={size.label} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>

            <Separator />

            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Aligner à gauche">
              <AlignLeft className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centrer">
              <AlignCenter className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Aligner à droite">
              <AlignRight className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justifier">
              <AlignJustify className={iconSize} />
            </ToolbarBtn>

            <Separator />

            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces">
              <List className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée">
              <ListOrdered className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citation">
              <Quote className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Séparateur horizontal">
              <Minus className={iconSize} />
            </ToolbarBtn>

            <Separator />

            <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Insérer un lien">
              <LinkIcon className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Supprimer le lien">
              <Unlink className={iconSize} />
            </ToolbarBtn>

            <Separator />

            <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Effacer le formatage">
              <span className="text-xs font-bold px-0.5">T×</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => {
                editor.chain().focus().unsetFontFamily().unsetFontSize().run();
              }}
              title="Réinitialiser police et taille"
            >
              <span className="text-[10px] font-bold px-0.5">Aa</span>
            </ToolbarBtn>
          </>
        ) : null}
      </div>

      {mode === "html" ? (
        <div className="p-2">
          <textarea
            value={htmlDraft}
            onChange={(e) => handleHtmlChange(e.target.value)}
            dir={dir}
            spellCheck={false}
            className="prose-fma w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4 font-mono text-xs leading-relaxed text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-primary/20"
            style={{ minHeight }}
            placeholder="<p>Votre contenu HTML…</p>"
          />
          <p className="mt-2 px-1 text-[11px] text-[var(--text-3)]">
            Collez ou rédigez du HTML avec balises et styles inline (<code className="text-[var(--text-2)]">&lt;h2&gt;</code>,{" "}
            <code className="text-[var(--text-2)]">&lt;ul&gt;</code>, <code className="text-[var(--text-2)]">style=&quot;…&quot;</code>).
            Le rendu sur le site public respecte ce code tel quel.
          </p>
        </div>
      ) : (
        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="rich-text-editor-visual"
        />
      )}

      <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--bg-surface)] flex justify-between items-center">
        <span className="text-xs text-[var(--text-3)]">
          {currentHtml.replace(/<[^>]*>/g, "").length} caractères
        </span>
        <span className="text-xs text-[var(--text-3)]">
          {wordCount(currentHtml)} mots
        </span>
      </div>
    </div>
  );
}
