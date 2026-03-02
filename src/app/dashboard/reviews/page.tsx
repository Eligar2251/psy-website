import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { isAdmin, createServerSupabase } from "@/lib/supabase-server";
import ReviewModerateActions from "@/components/dashboard/ReviewModerateActions";

export const metadata: Metadata = {
  title: "Модерация отзывов",
};

interface DBReviewAdmin {
  id: string;
  created_at: string;
  text: string;
  rating: number;
  service: string;
  is_approved: boolean;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

export default async function ReviewsModerationPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  const supabase = await createServerSupabase();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles (
        full_name,
        email
      )
    `
    )
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });

  const allReviews = (reviews as DBReviewAdmin[]) || [];
  const pending = allReviews.filter((r) => !r.is_approved);
  const approved = allReviews.filter((r) => r.is_approved);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Модерация отзывов
        </h1>
        <p className="text-stone-500 text-sm">
          {pending.length} ожидают модерации, {approved.length} одобрено
        </p>
      </div>

      {/* Ожидающие */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-heading font-semibold text-stone-900 mb-4">
            Ожидают модерации ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Одобренные */}
      {approved.length > 0 && (
        <div>
          <h2 className="text-lg font-heading font-semibold text-stone-900 mb-4">
            Одобренные ({approved.length})
          </h2>
          <div className="space-y-4">
            {approved.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {allReviews.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <Star className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
            Отзывов пока нет
          </h3>
          <p className="text-stone-500 text-sm">
            Когда пользователи оставят отзывы, они появятся здесь
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: DBReviewAdmin }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Автор */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-sm">
                {(review.profiles?.full_name || "А")[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-stone-900 text-sm">
                {review.profiles?.full_name || "Аноним"}
              </p>
              <p className="text-xs text-stone-400">
                {review.profiles?.email} •{" "}
                {new Date(review.created_at).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>

          {/* Звёзды */}
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "text-accent-400 fill-accent-400"
                    : "text-stone-200"
                }`}
              />
            ))}
          </div>

          {/* Текст */}
          <p className="text-stone-700 text-sm leading-relaxed mb-2">
            {review.text}
          </p>

          {review.service && (
            <p className="text-xs text-stone-400">Услуга: {review.service}</p>
          )}

          {/* Статус */}
          <div className="mt-3">
            {review.is_approved ? (
              <span className="text-xs text-green-600 font-medium">
                ✓ Одобрен
              </span>
            ) : (
              <span className="text-xs text-amber-600 font-medium">
                ⏳ Ожидает модерации
              </span>
            )}
          </div>
        </div>

        {/* Действия */}
        <ReviewModerateActions
          reviewId={review.id}
          isApproved={review.is_approved}
        />
      </div>
    </div>
  );
}