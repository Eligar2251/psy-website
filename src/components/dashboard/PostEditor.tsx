"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import type { DBPost } from "@/lib/types";
import { createClient } from "@/lib/supabase";

interface PostEditorProps {
  mode: "create" | "edit";
  post?: DBPost;
}

function generateSlug(title: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };

  return title
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export default function PostEditor({ mode, post }: PostEditorProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    read_time: post?.read_time || "5 мин",
    status: (post?.status || "draft") as "draft" | "published",
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

  const handleSubmit = async (
    e: FormEvent,
    forcedStatus?: "draft" | "published"
  ) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        category: form.category.trim(),
        read_time: form.read_time.trim() || "5 мин",
        status: forcedStatus || form.status,
      };

      if (!payload.title || !payload.slug || !payload.content) {
        setError("Заполните обязательные поля: заголовок, slug и контент");
        return;
      }

      if (mode === "create") {
        const { error: insertError } = await supabase.from("posts").insert(payload);
        if (insertError) {
          if ((insertError as any).code === "23505") {
            setError("Такой slug уже существует. Измените URL (slug).");
          } else {
            setError(insertError.message);
          }
          return;
        }
      } else {
        const { error: updateError } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", post!.id);

        if (updateError) {
          if ((updateError as any).code === "23505") {
            setError("Такой slug уже существует. Измените URL (slug).");
          } else {
            setError(updateError.message);
          }
          return;
        }
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setError("Ошибка сети/сервера");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
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
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Редактор" : "Превью"}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, "draft")}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            Черновик
          </button>

          <Button
            type="button"
            disabled={isLoading}
            size="sm"
            onClick={(e) => handleSubmit(e as any, "published")}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Заголовок <span className="text-accent-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-lg font-heading focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                URL (slug) <span className="text-accent-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-400">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white font-mono text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Краткое описание
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Контент <span className="text-accent-500">*</span>
              </label>

              {showPreview ? (
                <div className="min-h-[400px] px-5 py-4 rounded-xl border border-stone-200 bg-white overflow-auto">
                  <div
                    className="prose prose-stone prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.content || "<p></p>" }}
                  />
                </div>
              ) : (
                <RichTextEditor
                  content={form.content}
                  onChange={(html) => setForm((p) => ({ ...p, content: html }))}
                  placeholder="Начните писать статью..."
                />
              )}
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="text-sm font-semibold text-stone-900 mb-4">Настройки</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Время чтения
                </label>
                <input
                  type="text"
                  value={form.read_time}
                  onChange={(e) => setForm((p) => ({ ...p, read_time: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Статус
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}