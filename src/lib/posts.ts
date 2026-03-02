import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "./supabase-server";
import type { DBPost, DBPostWithAuthor } from "./types";

// Клиент без cookies — для build-time функций (generateStaticParams, sitemap)
function createBuildClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Получить опубликованные статьи (для блога)
export async function getPublishedPosts(): Promise<DBPostWithAuthor[]> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return [];
    }

    return (data as DBPostWithAuthor[]) || [];
  } catch {
    return [];
  }
}

// Получить статью по slug
export async function getPostBySlug(
  slug: string
): Promise<DBPostWithAuthor | null> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      return null;
    }

    return data as DBPostWithAuthor;
  } catch {
    return null;
  }
}

// Получить все статьи (для админа)
export async function getAllPosts(): Promise<DBPost[]> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all posts:", error);
      return [];
    }

    return (data as DBPost[]) || [];
  } catch {
    return [];
  }
}

// Получить статью по ID (для редактирования)
export async function getPostById(id: string): Promise<DBPost | null> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return data as DBPost;
  } catch {
    return null;
  }
}

// Получить последние N опубликованных (для главной)
export async function getLatestPosts(limit: number = 3): Promise<DBPost[]> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching latest posts:", error);
      return [];
    }

    return (data as DBPost[]) || [];
  } catch {
    return [];
  }
}

// Получить комментарии к статье
export async function getPostComments(postId: string) {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

// ============================================
// BUILD-TIME функции (без cookies!)
// ============================================

// Получить slugs для generateStaticParams
export async function getPostSlugs(): Promise<string[]> {
  try {
    const supabase = createBuildClient();

    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");

    return data?.map((p) => p.slug) || [];
  } catch {
    return [];
  }
}

// Получить slugs и даты для sitemap
export async function getPostSlugsForSitemap(): Promise<
  { slug: string; updated_at: string }[]
> {
  try {
    const supabase = createBuildClient();

    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");

    return data || [];
  } catch {
    return [];
  }
}