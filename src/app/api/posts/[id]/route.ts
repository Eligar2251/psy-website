import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// UPDATE
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { profile } = await getCurrentUser();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, category, read_time, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    // Проверка уникальности slug (исключая текущую)
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Статья с таким slug уже существует" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posts")
      .update({
        title,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        excerpt: excerpt || "",
        content,
        category: category || "",
        read_time: read_time || "5 мин",
        status: status || "draft",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update post error:", error);
      return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { profile } = await getCurrentUser();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const supabase = await createServerSupabase();

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Delete post error:", error);
      return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}