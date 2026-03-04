"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";

type ReviewRow = {
  id: string;
  created_at: string;
  text: string;
  rating: number;
  service: string;
  is_approved: boolean;
  is_visible: boolean;
  profiles: { full_name: string; email: string } | null;
};

export default function ReviewsModerationPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isLoading, user, isAdmin } = useAuth();

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return router.replace("/auth/login?redirect=/dashboard/reviews");
    if (!isAdmin) return router.replace("/dashboard");

    (async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name,email)")
        .order("is_approved", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) setReviews(data as any);
      setLoading(false);
    })();
  }, [isLoading, user, isAdmin, router, supabase]);

  const updateReview = async (id: string, patch: Partial<ReviewRow>) => {
    await supabase.from("reviews").update(patch).eq("id", id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } as any : r)));
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Удалить отзыв навсегда?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (isLoading || loading) return <div className="text-stone-500">Загрузка...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div>
      <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-6">
        Модерация отзывов
      </h1>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-10 text-center text-stone-500">
          Отзывов нет
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-soft p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-stone-900">
                      {r.profiles?.full_name || "Аноним"}
                    </span>
                    <span className="text-xs text-stone-400">
                      {r.profiles?.email || ""} •{" "}
                      {new Date(r.created_at).toLocaleDateString("ru-RU")}
                    </span>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating ? "text-accent-400 fill-accent-400" : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-stone-700 text-sm leading-relaxed mb-2">{r.text}</p>
                  {r.service && <p className="text-xs text-stone-400">Услуга: {r.service}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  {!r.is_approved ? (
                    <button
                      onClick={() => updateReview(r.id, { is_approved: true, is_visible: true })}
                      className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-medium flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Одобрить
                    </button>
                  ) : (
                    <button
                      onClick={() => updateReview(r.id, { is_visible: false })}
                      className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Скрыть
                    </button>
                  )}

                  <button
                    onClick={() => deleteReview(r.id)}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}