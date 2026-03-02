"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials as fallbackTestimonials } from "@/lib/data";
import { createClient } from "@/lib/supabase";

interface Review {
  id: string;
  text: string;
  rating: number;
  service: string;
  name: string;
}

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("reviews")
          .select(
            `
            id,
            text,
            rating,
            service,
            profiles (
              full_name
            )
          `
          )
          .eq("is_approved", true)
          .eq("is_visible", true)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error || !data || data.length === 0) {
          // Фоллбэк
          setReviews(
            fallbackTestimonials.map((t) => ({
              id: String(t.id),
              text: t.text,
              rating: t.rating,
              service: t.service,
              name: `${t.name}, ${t.age} лет`,
            }))
          );
          return;
        }

        setReviews(
          data.map((r: Record<string, unknown>) => ({
            id: r.id as string,
            text: r.text as string,
            rating: r.rating as number,
            service: (r.service as string) || "",
            name:
              (r.profiles as Record<string, unknown>)?.full_name as string ||
              "Аноним",
          }))
        );
      } catch {
        // Фоллбэк при ошибке
        setReviews(
          fallbackTestimonials.map((t) => ({
            id: String(t.id),
            text: t.text,
            rating: t.rating,
            service: t.service,
            name: `${t.name}, ${t.age} лет`,
          }))
        );
      }
    }

    fetchReviews();
  }, []);

  const prev = () =>
    setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  if (reviews.length === 0) return null;

  const review = reviews[current];

  return (
    <section className="section-padding bg-white" aria-label="Отзывы">
      <Container narrow>
        <SectionHeading
          title="Что говорят клиенты"
          subtitle="Реальные отзывы людей, которые прошли терапию"
        />

        <div className="relative">
          <div className="bg-warm-50 rounded-3xl p-8 md:p-12 relative">
            <Quote
              className="absolute top-6 left-6 w-10 h-10 text-primary-100"
              aria-hidden="true"
            />

            {/* Звёзды */}
            <div
              className="flex gap-1 mb-6"
              aria-label={`Оценка ${review.rating} из 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? "text-accent-400 fill-accent-400"
                      : "text-stone-200"
                  }`}
                />
              ))}
            </div>

            {/* Текст */}
            <blockquote className="text-lg md:text-xl text-stone-700 leading-relaxed mb-8 relative z-10">
              &ldquo;{review.text}&rdquo;
            </blockquote>

            {/* Автор */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-semibold text-stone-900">
                  {review.name}
                </p>
                {review.service && (
                  <p className="text-sm text-stone-400">{review.service}</p>
                )}
              </div>

              {/* Навигация */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-400 hover:text-primary-600 hover:shadow-md transition-all"
                  aria-label="Предыдущий отзыв"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-400 hover:text-primary-600 hover:shadow-md transition-all"
                  aria-label="Следующий отзыв"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Индикаторы */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current
                    ? "bg-primary-600 w-6"
                    : "bg-stone-300 hover:bg-stone-400"
                }`}
                aria-label={`Отзыв ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}