"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import { blogPosts as fallbackPosts } from "@/lib/data";

interface PostPreview {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  read_time: string;
  created_at: string;
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<PostPreview[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("posts")
          .select("id, slug, title, excerpt, category, read_time, created_at")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error || !data || data.length === 0) {
          // Фоллбэк на захардкоженные
          setPosts(
            fallbackPosts.slice(0, 3).map((p, i) => ({
              id: String(i),
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              read_time: p.readTime,
              created_at: p.date,
            }))
          );
          return;
        }

        setPosts(data as PostPreview[]);
      } catch {
        setPosts(
          fallbackPosts.slice(0, 3).map((p, i) => ({
            id: String(i),
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            read_time: p.readTime,
            created_at: p.date,
          }))
        );
      }
    }

    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="section-padding gradient-section" aria-label="Блог">
      <Container>
        <SectionHeading
          title="Полезные материалы"
          subtitle="Статьи о ментальном здоровье, психологии и саморазвитии"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card group"
            >
              <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-primary-100 to-warm-100 mb-4 overflow-hidden flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {post.category && (
                  <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                    {post.category}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock className="w-3 h-3" />
                  {post.read_time}
                </span>
              </div>

              <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button href="/blog" variant="outline">
            Все статьи
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}