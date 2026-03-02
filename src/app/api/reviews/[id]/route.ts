import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, getCurrentUser } from "@/lib/supabase-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH — одобрить/скрыть отзыв (только админ)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { profile } = await getCurrentUser();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json();
    const supabase = await createServerSupabase();

    const updateData: Record<string, unknown> = {};

    if (typeof body.is_approved === "boolean") {
      updateData.is_approved = body.is_approved;
    }
    if (typeof body.is_visible === "boolean") {
      updateData.is_visible = body.is_visible;
    }

    const { error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// DELETE — удалить отзыв (только админ)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { profile } = await getCurrentUser();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const supabase = await createServerSupabase();

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}