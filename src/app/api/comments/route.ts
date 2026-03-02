import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";

// CREATE — новый комментарий
export async function POST(request: NextRequest) {
  try {
    const { user, profile } = await getCurrentUser();

    if (!user || !profile) {
      return NextResponse.json(
        { error: "Войдите, чтобы оставить комментарий" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const content = String(body.content || "").trim();
    const post_id = String(body.post_id || "");

    if (!content || content.length < 2) {
      return NextResponse.json(
        { error: "Комментарий слишком короткий" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Комментарий слишком длинный (макс. 2000 символов)" },
        { status: 400 }
      );
    }

    if (!post_id) {
      return NextResponse.json(
        { error: "Не указана статья" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id,
        author_id: user.id,
        content,
        is_approved: true,
      })
      .select(
        `
        *,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      console.error("Create comment error:", error);
      return NextResponse.json(
        { error: "Ошибка отправки комментария" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}