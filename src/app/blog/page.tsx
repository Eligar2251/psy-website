import { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { blogPosts, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Блог",
  description: `Блог психолога ${siteConfig.name}. Статьи о тревожности, выгорании, отношениях и ментальном здоровье.`,
};

export default function BlogPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <div className="text-center">
            <p className="text-primary-600 font-medium mb-3">Блог</p>
            <h1 className="text-stone-900 mb-6">
              Полезные материалы
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Статьи о ментальном здоровье, психологии и инструментах,
              которые можно использовать уже сегодня
            </p>
          </div>
        </Container>
      </section>

      {/* Статьи */}
      <section className="section-padding bg-white">
        <Container>
          {blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card group"
                >
                  {/* Изображение */}
                  <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-primary-100 to-warm-100 mb-5 overflow-hidden flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>

                  {/* Мета */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Заголовок */}
                  <h2 className="text-xl font-heading font-semibold text-stone-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Описание */}
                  <p className="text-stone-500 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Дата */}
                  <div className="flex items-center justify-between text-sm">
                    <time className="text-stone-400" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <span className="text-primary-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Читать
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-stone-500 text-lg">
                Статьи скоро появятся. Следите за обновлениями!
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}