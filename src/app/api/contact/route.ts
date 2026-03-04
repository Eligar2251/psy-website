import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-client";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
    });

    if (dbError) console.error("Supabase contact insert error:", dbError);

    const tg = await sendTelegramNotification({
      name,
      phone: phone || "не указан",
      email,
      service: `Сообщение: ${subject || "без темы"}`,
      format: "Форма обратной связи",
      message,
    });

    if (!tg.ok) console.error("Telegram error:", tg.error);

    if (!dbError || tg.ok) {
      return NextResponse.json(
        { success: true, message: "Сообщение отправлено!" },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте позже." },
      { status: 500 }
    );
  } catch (e) {
    console.error("Contact route fatal error:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}