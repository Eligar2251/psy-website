"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import type { DBPost } from "@/lib/types";

interface PostEditorProps {
  mode: "create" | "edit";
  post?: DBPost;
}

function generateSlug(title: string): string {
  const translitMap: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };

  return title
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export default function PostEditor({ mode, post }: PostEditorProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    read_time: post?.read_time || "5 мин",
    status: post?.status || ("draft" as "draft" | "published"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: mode === "create" ? generateSlug(value) : prev.slug,
    }));
  };

  const handleContentChange = (html: string) => {
    setForm((prev) => ({ ...prev, content: html }));
  };

  const handleSubmit = async (e: FormEvent, publishStatus?: "draft" | "published") => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const submitData = {
      ...form,
      status: publishStatus || form.status,
    };

    try {
      const url =
        mode === "create" ? "/api/posts" : `/api/posts/${post?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка сохранения");
        return;
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        id="post-form"
        onSubmit={(e) => handleSubmit(e)}
        className="space-y-6"
      >
        {/* Верхняя панель */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-soft p-4">
          <Link
            href="/dashboard/posts"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showPreview ? "Редактор" : "Превью"}
            </button>

            <button
              type="button"
              onClick={(e) =>
                handleSubmit(
                  e as unknown as FormEvent<HTMLFormElement>,
                  "draft"
                )
              }
              disabled={isLoading}
              className="px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              Черновик
            </button>

            <Button
              type="button"
              disabled={isLoading}
              size="sm"
              onClick={(e) =>
                handleSubmit(
                  e as unknown as FormEvent<HTMLFormElement>,
                  "published"
                )
              }
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mode === "create" ? "Опубликовать" : "Сохранить"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              {/* Заголовок */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Заголовок <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="Заголовок статьи"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-lg font-heading placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>

              {/* Slug */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  URL (slug) <span className="text-accent-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-400">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    required
                    placeholder="url-stati"
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Краткое описание */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Краткое описание
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  rows={2}
                  placeholder="Краткое описание для превью (2-3 предложения)"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Контент — визуальный редактор или превью */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Контент <span className="text-accent-500">*</span>
                </label>

                {showPreview ? (
                  <div className="min-h-[400px] px-5 py-4 rounded-xl border border-stone-200 bg-white overflow-auto">
                    {form.content ? (
                      <div
                        className="prose prose-stone prose-lg max-w-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary-600"
                        dangerouslySetInnerHTML={{ __html: form.content }}
                      />
                    ) : (
                      <p className="text-stone-400">
                        Контент пока пуст. Переключитесь в редактор и начните
                        писать.
                      </p>
                    )}
                  </div>
                ) : (
                  <RichTextEditor
                    content={form.content}
                    onChange={handleContentChange}
                    placeholder="Начните писать статью... Используйте панель инструментов для форматирования."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-5">
            {/* Настройки */}
            <div className="bg-white rounded-2xl shadow-soft p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">
                Настройки
              </h3>

              <div className="space-y-4">
                {/* Категория */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Категория
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Например: Тревожность"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>

                {/* Время чтения */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Время чтения
                  </label>
                  <input
                    type="text"
                    value={form.read_time}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        read_time: e.target.value,
                      }))
                    }
                    placeholder="5 мин"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>

                {/* Статус */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Статус
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as "draft" | "published",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликовано</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Горячие клавиши */}
            <div className="bg-primary-50/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Горячие клавиши
              </h3>
              <div className="text-xs text-stone-600 space-y-1.5">
                <Shortcut keys="Ctrl+B" label="Жирный" />
                <Shortcut keys="Ctrl+I" label="Курсив" />
                <Shortcut keys="Ctrl+U" label="Подчёркнутый" />
                <Shortcut keys="Ctrl+Z" label="Отменить" />
                <Shortcut keys="Ctrl+Y" label="Повторить" />
                <Shortcut keys="Ctrl+Shift+7" label="Нумер. список" />
                <Shortcut keys="Ctrl+Shift+8" label="Маркир. список" />
                <Shortcut keys="Ctrl+Shift+B" label="Цитата" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-500">{label}</span>
      <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-stone-600">
        {keys}
      </kbd>
    </div>
  );
}