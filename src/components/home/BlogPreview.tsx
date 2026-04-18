"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
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

let cachedPosts: PostPreview[] | null = null;

export default function BlogPreview() {
  const [posts, setPosts] = useState<PostPreview[]>(
    cachedPosts || getFallback()
  );
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current || cachedPosts) return;
    fetchedRef.current = true;

    async function fetchPosts() {
      try {
        const supabase = getSupabaseBrowser();

        const { data, error } = await supabase
          .from("posts")
          .select("id, slug, title, excerpt, category, read_time, created_at")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error || !data || data.length === 0) return;

        cachedPosts = data as PostPreview[];
        setPosts(data as PostPreview[]);
      } catch {
        // Используем фоллбэк
      }
    }

    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="section-padding gradient-section relative overflow-hidden" aria-label="Блог">
      {/* Decorative orb */}
      <div className="gradient-orb gradient-orb-primary w-72 h-72 -top-20 -left-20" aria-hidden="true" />
      
      <Container className="relative z-10">
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
              <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-primary-100/80 to-warm-100/80 mb-4 overflow-hidden flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="w-10 h-10 text-primary-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {post.category && (
                  <span className="px-3 py-1 rounded-full bg-primary-50/80 backdrop-blur-sm text-primary-700 text-xs font-medium">
                    {post.category}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Clock className="w-3 h-3" />
                  {post.read_time}
                </span>
              </div>

              <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
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

function getFallback(): PostPreview[] {
  return fallbackPosts.slice(0, 3).map((p, i) => ({
    id: String(i),
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    read_time: p.readTime,
    created_at: p.date,
  }));
}
