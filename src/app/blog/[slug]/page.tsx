import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import CommentSection from "@/components/blog/CommentSection";
import { getPostBySlug, getPublishedPosts, getPostSlugs } from "@/lib/posts";
import { siteConfig } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Статья не найдена" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.created_at,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const allPosts = await getPublishedPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section pb-12">
        <Container narrow>
          <nav className="mb-8" aria-label="Хлебные крошки">
            <ol className="flex items-center gap-2 text-sm text-stone-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-600 transition-colors"
                >
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary-600 transition-colors"
                >
                  Блог
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-900 font-medium line-clamp-1">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            {post.category && (
              <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-stone-400">
              <Clock className="w-4 h-4" />
              {post.read_time}
            </span>
            <time className="text-sm text-stone-400" dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-stone-900 mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-stone-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Автор */}
          {post.profiles && (
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-200/50">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {post.profiles.full_name?.[0]?.toUpperCase() || "А"}
                </span>
              </div>
              <div>
                <p className="font-medium text-stone-900 text-sm">
                  {post.profiles.full_name}
                </p>
                <p className="text-xs text-stone-400">Автор статьи</p>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Контент */}
      <section className="py-12 bg-white">
        <Container narrow>
          <article className="prose prose-stone prose-lg max-w-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-primary-50 border border-primary-100 text-center">
            <h3 className="text-xl font-heading font-semibold text-stone-900 mb-3">
              Нужна профессиональная поддержка?
            </h3>
            <p className="text-stone-600 mb-6 max-w-lg mx-auto">
              Если вы узнали себя в этой статье — я могу помочь.
            </p>
            <Button href="/booking">
              Записаться
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Комментарии */}
          <CommentSection postId={post.id} />
        </Container>
      </section>

      {/* Другие статьи */}
      {otherPosts.length > 0 && (
        <section className="section-padding gradient-section">
          <Container narrow>
            <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-8">
              Читайте также
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {otherPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="card group"
                >
                  {p.category && (
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                      {p.category}
                    </span>
                  )}
                  <h3 className="text-lg font-heading font-semibold text-stone-900 mt-3 mb-2 group-hover:text-primary-700 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Button href="/blog" variant="ghost">
                <ArrowLeft className="w-4 h-4" />
                Все статьи
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: {
              "@type": "Person",
              name: post.profiles?.full_name || siteConfig.name,
            },
          }),
        }}
      />
    </div>
  );
}