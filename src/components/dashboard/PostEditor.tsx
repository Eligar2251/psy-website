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
    status: post?.status || "draft",
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url =
        mode === "create" ? "/api/posts" : `/api/posts/${post?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const handleSaveAsDraft = async () => {
    setForm((prev) => ({ ...prev, status: "draft" }));
    // Submit через setTimeout, чтобы state обновился
    setTimeout(() => {
      const formEl = document.getElementById("post-form") as HTMLFormElement;
      formEl?.requestSubmit();
    }, 0);
  };

  return (
    <div>
      <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
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

            {mode === "edit" && (
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Черновик
              </button>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
              onClick={() =>
                setForm((prev) => ({ ...prev, status: "published" }))
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

              {/* Контент */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Контент <span className="text-accent-500">*</span>
                  <span className="text-stone-400 font-normal ml-2">
                    (поддерживает HTML)
                  </span>
                </label>

                {showPreview ? (
                  <div className="min-h-[400px] px-4 py-3 rounded-xl border border-stone-200 bg-white overflow-auto">
                    <div
                      className="prose prose-stone prose-lg max-w-none prose-headings:font-heading"
                      dangerouslySetInnerHTML={{
                        __html: form.content || "<p>Начните писать...</p>",
                      }}
                    />
                  </div>
                ) : (
                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    required
                    rows={20}
                    placeholder="<h2>Заголовок</h2>&#10;<p>Текст статьи...</p>"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-y font-mono text-sm leading-relaxed"
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

            {/* Подсказка по HTML */}
            <div className="bg-primary-50/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Подсказка по HTML
              </h3>
              <div className="text-xs text-stone-600 space-y-2 font-mono">
                <p>&lt;h2&gt;Заголовок&lt;/h2&gt;</p>
                <p>&lt;h3&gt;Подзаголовок&lt;/h3&gt;</p>
                <p>&lt;p&gt;Абзац текста&lt;/p&gt;</p>
                <p>&lt;strong&gt;Жирный&lt;/strong&gt;</p>
                <p>&lt;em&gt;Курсив&lt;/em&gt;</p>
                <p>&lt;ul&gt;&lt;li&gt;Список&lt;/li&gt;&lt;/ul&gt;</p>
                <p>&lt;ol&gt;&lt;li&gt;Нумерованный&lt;/li&gt;&lt;/ol&gt;</p>
                <p>&lt;blockquote&gt;Цитата&lt;/blockquote&gt;</p>
                <p>&lt;a href=&quot;...&quot;&gt;Ссылка&lt;/a&gt;</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}