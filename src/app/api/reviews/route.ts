import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";

// GET — получить одобренные отзывы
export async function GET() {
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
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: data });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

// POST — оставить отзыв
export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Войдите, чтобы оставить отзыв" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const text = String(body.text || "").trim();
    const rating = Number(body.rating) || 5;
    const service = String(body.service || "").trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "Отзыв слишком короткий (минимум 10 символов)" },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Отзыв слишком длинный (макс. 2000 символов)" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Оценка должна быть от 1 до 5" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    // Проверка: не оставлял ли уже отзыв
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("author_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Вы уже оставили отзыв. Спасибо!" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        author_id: user.id,
        text,
        rating,
        service,
        is_approved: false, // Ожидает модерации
      })
      .select()
      .single();

    if (error) {
      console.error("Create review error:", error);
      return NextResponse.json(
        { error: "Ошибка отправки отзыва" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Спасибо за отзыв! Он появится на сайте после модерации.",
        review: data,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}