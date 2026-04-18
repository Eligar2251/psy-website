"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials as fallbackTestimonials } from "@/lib/data";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface Review {
  id: string;
  text: string;
  rating: number;
  service: string;
  name: string;
}

// Кэш на уровне модуля
let cachedReviews: Review[] | null = null;

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>(
    cachedReviews || getFallback()
  );
  const [current, setCurrent] = useState(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current || cachedReviews) return;
    fetchedRef.current = true;

    async function fetchReviews() {
      try {
        const supabase = getSupabaseBrowser();

        const { data, error } = await supabase
          .from("reviews")
          .select("id, text, rating, service, profiles(full_name)")
          .eq("is_approved", true)
          .eq("is_visible", true)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error || !data || data.length === 0) return;

        const mapped: Review[] = data.map(
          (r: Record<string, unknown>) => ({
            id: r.id as string,
            text: r.text as string,
            rating: r.rating as number,
            service: (r.service as string) || "",
            name:
              ((r.profiles as Record<string, unknown>)
                ?.full_name as string) || "Аноним",
          })
        );

        cachedReviews = mapped;
        setReviews(mapped);
      } catch {
        // Используем фоллбэк
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
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 relative border border-white/40 shadow-glass">
            <Quote
              className="absolute top-6 left-6 w-12 h-12 text-primary-200/50"
              aria-hidden="true"
            />

            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${
                    i < review.rating
                      ? "text-accent-400 fill-accent-400 drop-shadow-sm"
                      : "text-stone-200"
                  }`}
                />
              ))}
            </div>

            <blockquote className="text-lg md:text-xl text-stone-700 leading-relaxed mb-8 relative z-10">
              &ldquo;{review.text}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-semibold text-stone-900">
                  {review.name}
                </p>
                {review.service && (
                  <p className="text-sm text-stone-500">{review.service}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-glass flex items-center justify-center text-stone-400 hover:text-primary-600 hover:shadow-glass-hover hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Предыдущий отзыв"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-glass flex items-center justify-center text-stone-400 hover:text-primary-600 hover:shadow-glass-hover hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Следующий отзыв"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-gradient-to-r from-primary-600 to-primary-500 w-8 shadow-sm"
                    : "bg-stone-300 hover:bg-primary-300 w-2"
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

function getFallback(): Review[] {
  return fallbackTestimonials.map((t) => ({
    id: String(t.id),
    text: t.text,
    rating: t.rating,
    service: t.service,
    name: `${t.name}, ${t.age} лет`,
  }));
}
