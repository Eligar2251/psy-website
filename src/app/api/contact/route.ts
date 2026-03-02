import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    // Сохраняем в Supabase
    await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    // Уведомление в Telegram
    await sendTelegramNotification({
      name,
      phone: phone || "не указан",
      email,
      service: `Сообщение: ${subject || "без темы"}`,
      format: "Форма обратной связи",
      message,
    });

    return NextResponse.json(
      { success: true, message: "Сообщение отправлено!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}