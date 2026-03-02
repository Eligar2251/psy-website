import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";

// CREATE — новая статья
export async function POST(request: NextRequest) {
  try {
    const { profile } = await getCurrentUser();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, category, read_time, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Заполните обязательные поля: заголовок, slug, контент" },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const supabase = await createServerSupabase();

    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Статья с таким slug уже существует" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        excerpt: excerpt || "",
        content,
        category: category || "",
        read_time: read_time || "5 мин",
        status: status || "draft",
        author_id: profile.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Create post error:", error);
      return NextResponse.json(
        { error: "Ошибка создания статьи" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, post: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}