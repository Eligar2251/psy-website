"use client";

import { useState, FormEvent } from "react";
import { Star, Send, Loader2, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import { services } from "@/lib/data";

export default function ReviewForm() {
  const { user, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const [form, setForm] = useState({ text: "", rating: 5, service: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleStarClick = (star: number) => setForm((p) => ({ ...p, rating: star }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setStatus("loading");
    setMessage("");

    try {
      const text = form.text.trim();
      if (text.length < 10) {
        setStatus("error");
        setMessage("Отзыв слишком короткий (минимум 10 символов)");
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        author_id: user.id,
        text,
        rating: form.rating,
        service: form.service,
        is_approved: false,
        is_visible: true,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage("Спасибо! Отзыв появится после модерации.");
    } catch {
      setStatus("error");
      setMessage("Ошибка сети");
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="card text-center">
        <LogIn className="w-10 h-10 text-stone-300 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
          Хотите оставить отзыв?
        </h3>
        <p className="text-stone-500 mb-4 text-sm">
          Войдите или зарегистрируйтесь
        </p>
        <div className="flex gap-3 justify-center">
          <Button href="/auth/login" size="sm">Войти</Button>
          <Button href="/auth/register" variant="outline" size="sm">Регистрация</Button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="card text-center">
        <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
          Готово!
        </h3>
        <p className="text-stone-500 text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-heading font-semibold text-stone-900 mb-5">
        Оставить отзыв
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Ваша оценка
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleStarClick(s)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className={`w-7 h-7 ${s <= form.rating ? "text-accent-400 fill-accent-400" : "text-stone-200"}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Направление (необязательно)
          </label>
          <select
            value={form.service}
            onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white"
          >
            <option value="">Выберите</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>{s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Отзыв <span className="text-accent-500">*</span>
          </label>
          <textarea
            value={form.text}
            onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
            rows={5}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white resize-none"
            placeholder="Расскажите о вашем опыте..."
          />
          <p className="mt-1 text-xs text-stone-400 text-right">{form.text.length}/2000</p>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}

        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Отправляю...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Отправить
            </>
          )}
        </Button>
      </form>
    </div>
  );
}