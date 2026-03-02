"use client";

import { useState, FormEvent } from "react";
import {
  Star,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { services } from "@/lib/data";

export default function ReviewForm() {
  const { user, isLoading: authLoading } = useAuth();
  const [form, setForm] = useState({
    text: "",
    rating: 5,
    service: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleStarClick = (star: number) => {
    setForm((prev) => ({ ...prev, rating: star }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Ошибка. Попробуйте позже.");
      }
    } catch {
      setStatus("error");
      setMessage("Ошибка сети");
    }
  };

  if (authLoading) return null;

  // Не авторизован
  if (!user) {
    return (
      <div className="card text-center">
        <LogIn className="w-10 h-10 text-stone-300 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
          Хотите оставить отзыв?
        </h3>
        <p className="text-stone-500 mb-4 text-sm">
          Войдите или зарегистрируйтесь, чтобы поделиться опытом
        </p>
        <div className="flex gap-3 justify-center">
          <Button href="/auth/login" size="sm">
            Войти
          </Button>
          <Button href="/auth/register" variant="outline" size="sm">
            Регистрация
          </Button>
        </div>
      </div>
    );
  }

  // Успех
  if (status === "success") {
    return (
      <div className="card text-center">
        <CheckCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
          Отзыв отправлен!
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
        {/* Звёзды */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Ваша оценка
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Оценка ${star}`}
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= form.rating
                      ? "text-accent-400 fill-accent-400"
                      : "text-stone-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Услуга */}
        <div>
          <label
            htmlFor="review-service"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Направление работы
          </label>
          <select
            id="review-service"
            value={form.service}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, service: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          >
            <option value="">Выберите (необязательно)</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Текст отзыва */}
        <div>
          <label
            htmlFor="review-text"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Ваш отзыв <span className="text-accent-500">*</span>
          </label>
          <textarea
            id="review-text"
            value={form.text}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, text: e.target.value }))
            }
            rows={5}
            required
            minLength={10}
            maxLength={2000}
            placeholder="Расскажите о вашем опыте терапии..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
          />
          <p className="mt-1 text-xs text-stone-400 text-right">
            {form.text.length}/2000
          </p>
        </div>

        {/* Ошибка */}
        {status === "error" && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {message}
          </div>
        )}

        <p className="text-xs text-stone-400">
          Отзыв будет опубликован после модерации. Ваше имя будет указано
          как при регистрации.
        </p>

        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Отправляю...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Отправить отзыв
            </>
          )}
        </Button>
      </form>
    </div>
  );
}