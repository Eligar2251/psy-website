import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-client";
import { sendTelegramNotification } from "@/lib/telegram";

interface BookingInsert {
  name: string;
  phone: string;
  email?: string;
  service: string;
  format: string;
  preferred_time?: string;
  message?: string;
}

function validateBooking(data: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
  cleaned: BookingInsert | null;
} {
  const errors: string[] = [];

  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const email = String(data.email || "").trim();
  const service = String(data.service || "").trim();
  const format = String(data.format || "").trim();
  const preferred_time = String(data.preferred_time || "").trim();
  const message = String(data.message || "").trim();

  if (!name || name.length < 2) errors.push("Имя должно быть минимум 2 символа");

  const phoneClean = phone.replace(/[\s\-\(\)]/g, "");
  if (!phoneClean || !/^[\+]?[0-9]{10,15}$/.test(phoneClean)) {
    errors.push("Некорректный номер телефона");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Некорректный email");
  }

  if (!service) errors.push("Выберите услугу");
  if (!format) errors.push("Выберите формат");
  if (message.length > 1000) errors.push("Сообщение слишком длинное");

  if (errors.length) return { valid: false, errors, cleaned: null };

  return {
    valid: true,
    errors: [],
    cleaned: {
      name,
      phone: phoneClean,
      email: email || undefined,
      service,
      format,
      preferred_time: preferred_time || undefined,
      message: message || undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { valid, errors, cleaned } = validateBooking(body);

    if (!valid || !cleaned) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: errors },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 1) Пишем в БД (если упадёт — всё равно попробуем Telegram)
    const { error: dbError } = await supabase.from("bookings").insert({
      ...cleaned,
      source: "website",
      utm_source: String(body.utm_source || ""),
      utm_medium: String(body.utm_medium || ""),
      utm_campaign: String(body.utm_campaign || ""),
    });

    if (dbError) console.error("Supabase bookings insert error:", dbError);

    // 2) Telegram
    const tg = await sendTelegramNotification(cleaned);
    if (!tg.ok) console.error("Telegram error:", tg.error);

    // Если хотя бы один канал сработал — считаем успехом
    if (!dbError || tg.ok) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Заявка принята! Я свяжусь с вами в ближайшее время.",
        },
        { status: 201 }
      );
    }

    // Если упало и БД, и Telegram — 500
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте позже." },
      { status: 500 }
    );
  } catch (e) {
    console.error("Booking route fatal error:", e);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}