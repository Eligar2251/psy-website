"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  Highlighter,
  Code,
  Pilcrow,
  RemoveFormatting,
} from "lucide-react";
import { useCallback } from "react";
import { clsx } from "clsx";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Начните писать статью...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-stone prose-lg max-w-none min-h-[400px] px-5 py-4 focus:outline-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary-600",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Введите URL ссылки:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-[500px] rounded-xl border border-stone-200 bg-white flex items-center justify-center">
        <div className="text-stone-400">Загрузка редактора...</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      {/* Панель инструментов */}
      <div className="border-b border-stone-200 bg-stone-50 px-2 py-1.5 flex flex-wrap gap-0.5">
        {/* Отмена / Повтор */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Отменить (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Повторить (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Заголовки */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
            title="Обычный текст"
          >
            <Pilcrow className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="Заголовок H2"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="Подзаголовок H3"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isActive={editor.isActive("heading", { level: 4 })}
            title="Подзаголовок H4"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Форматирование текста */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Жирный (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Курсив (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Подчёркнутый (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Зачёркнутый"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            title="Выделение"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Инлайн-код"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Списки */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Маркированный список"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Нумерованный список"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Блочные элементы */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Цитата"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Горизонтальная линия"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Выравнивание */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="По левому краю"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="По центру"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Ссылки */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            title="Вставить ссылку"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Удалить ссылку"
            >
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          )}
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Очистка */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            title="Очистить форматирование"
          >
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarGroup>
      </div>

      {/* Всплывающее меню при выделении текста */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150 }}
          className="bg-stone-900 rounded-lg shadow-elevated px-1 py-1 flex gap-0.5"
        >
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton onClick={setLink} isActive={editor.isActive("link")}>
            <LinkIcon className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
          >
            <Highlighter className="w-3.5 h-3.5" />
          </BubbleButton>
        </BubbleMenu>
      )}

      {/* Редактор */}
      <EditorContent editor={editor} />

      {/* Счётчик слов */}
      <div className="border-t border-stone-100 px-4 py-2 flex items-center justify-between text-xs text-stone-400">
        <span>
          {editor.storage.characterCount?.words?.() ??
            editor
              .getText()
              .split(/\s+/)
              .filter((w) => w.length > 0).length}{" "}
          слов
        </span>
        <span>
          {editor.storage.characterCount?.characters?.() ??
            editor.getText().length}{" "}
          символов
        </span>
      </div>
    </div>
  );
}

/* ─── Вспомогательные компоненты ─── */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-stone-200 mx-1" />;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
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
      className={clsx(
        "p-1.5 rounded-md transition-colors",
        isActive
          ? "bg-primary-100 text-primary-700"
          : "text-stone-500 hover:bg-stone-200 hover:text-stone-700",
        disabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
      )}
    >
      {children}
    </button>
  );
}

function BubbleButton({
  onClick,
  isActive = false,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "p-1.5 rounded transition-colors",
        isActive
          ? "bg-white/20 text-white"
          : "text-stone-400 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}