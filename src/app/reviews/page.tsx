import { Metadata } from "next";
import { Star, Quote, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ReviewForm from "@/components/ReviewForm";
import { siteConfig, testimonials as fallbackTestimonials } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Отзывы",
  description: `Отзывы клиентов о работе с психологом ${siteConfig.name}.`,
};

export const dynamic = "force-dynamic";

interface DBReview {
  id: string;
  created_at: string;
  text: string;
  rating: number;
  service: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

async function getReviews(): Promise<DBReview[]> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .eq("is_approved", true)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch reviews error:", error);
      return [];
    }

    return (data as DBReview[]) || [];
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const dbReviews = await getReviews();

  // Если в БД ещё нет отзывов — показываем захардкоженные
  const hasDBReviews = dbReviews.length > 0;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <div className="text-center">
            <p className="text-primary-600 font-medium mb-3">Отзывы</p>
            <h1 className="text-stone-900 mb-6">Что говорят клиенты</h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Каждый отзыв — это реальная история человека, который решился
              на перемены.
            </p>
          </div>
        </Container>
      </section>

      {/* Отзывы из БД */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Отзывы из БД */}
            {dbReviews.map((review) => (
              <div key={review.id} className="card relative">
                <Quote
                  className="absolute top-6 right-6 w-8 h-8 text-primary-100"
                  aria-hidden="true"
                />

                {/* Звёзды */}
                <div
                  className="flex gap-1 mb-4"
                  aria-label={`Оценка ${review.rating} из 5`}
                >
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
                <blockquote className="text-stone-700 leading-relaxed mb-6 relative z-10">
                  &ldquo;{review.text}&rdquo;
                </blockquote>

                {/* Автор */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {(review.profiles?.full_name || "А")[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {review.profiles?.full_name || "Аноним"}
                      </p>
                      {review.service && (
                        <p className="text-xs text-stone-400">
                          {review.service}
                        </p>
                      )}
                    </div>
                  </div>
                  <time className="text-xs text-stone-400">
                    {new Date(review.created_at).toLocaleDateString("ru-RU", {
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            ))}

            {/* Фоллбэк — захардкоженные отзывы (если в БД пусто) */}
            {!hasDBReviews &&
              fallbackTestimonials.map((review) => (
                <div key={review.id} className="card relative">
                  <Quote
                    className="absolute top-6 right-6 w-8 h-8 text-primary-100"
                    aria-hidden="true"
                  />

                  <div
                    className="flex gap-1 mb-4"
                    aria-label={`Оценка ${review.rating} из 5`}
                  >
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

                  <blockquote className="text-stone-700 leading-relaxed mb-6 relative z-10">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">
                          {review.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 text-sm">
                          {review.name}, {review.age} лет
                        </p>
                        <p className="text-xs text-stone-400">
                          {review.service}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Примечание */}
          <div className="mt-12 text-center">
            <p className="text-sm text-stone-400 max-w-lg mx-auto">
              Все отзывы проходят модерацию. Имена указываются так, как при
              регистрации.
            </p>
          </div>
        </Container>
      </section>

      {/* Форма отзыва */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <div className="max-w-xl mx-auto">
            <ReviewForm />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-600 text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white mb-4">Готовы начать свою историю?</h2>
            <p className="text-primary-100 text-lg mb-8">
              Каждый путь начинается с первого шага. Запишитесь на
              консультацию, и мы вместе найдём решение.
            </p>
            <Button href="/booking" variant="accent" size="lg">
              Записаться на консультацию
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}