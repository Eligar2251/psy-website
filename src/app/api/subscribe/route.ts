import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Введите корректный email" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("subscribers").insert({
      email,
      name: String(body.name || "").trim() || null,
    });

    // Если дубликат — не показываем ошибку
    if (error && error.code === "23505") {
      return NextResponse.json(
        { success: true, message: "Вы уже подписаны!" },
        { status: 200 }
      );
    }

    if (error) {
      console.error("Subscribe error:", error);
      return NextResponse.json(
        { error: "Ошибка сервера" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Вы подписаны на рассылку!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}