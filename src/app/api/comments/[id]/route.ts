import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, profile } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const supabase = await createServerSupabase();

    // Проверяем: автор или админ
    const { data: comment } = await supabase
      .from("comments")
      .select("author_id")
      .eq("id", id)
      .single();

    if (!comment) {
      return NextResponse.json(
        { error: "Комментарий не найден" },
        { status: 404 }
      );
    }

    if (comment.author_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}