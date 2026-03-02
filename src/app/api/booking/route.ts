import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

// Тип для заявки
interface BookingInsert {
  name: string;
  phone: string;
  email?: string;
  service: string;
  format: string;
  preferred_time?: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Простая rate-limit защита
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Валидация
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

  if (!name || name.length < 2) {
    errors.push("Имя должно содержать минимум 2 символа");
  }
  if (name.length > 100) {
    errors.push("Имя слишком длинное");
  }

  const phoneClean = phone.replace(/[\s\-\(\)]/g, "");
  if (!phoneClean || !/^[\+]?[0-9]{10,15}$/.test(phoneClean)) {
    errors.push("Некорректный номер телефона");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Некорректный email");
  }

  if (!service) {
    errors.push("Выберите услугу");
  }

  if (!format) {
    errors.push("Выберите формат");
  }

  if (message.length > 1000) {
    errors.push("Сообщение слишком длинное (макс. 1000 символов)");
  }

  if (errors.length > 0) {
    return { valid: false, errors, cleaned: null };
  }

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
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const { valid, errors, cleaned } = validateBooking(body);

    if (!valid || !cleaned) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: errors },
        { status: 400 }
      );
    }

    // Сохранение в Supabase
    const { error: dbError } = await supabase.from("bookings").insert({
      ...cleaned,
      source: "website",
      utm_source: String(body.utm_source || ""),
      utm_medium: String(body.utm_medium || ""),
      utm_campaign: String(body.utm_campaign || ""),
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    // Отправка в Telegram
    const telegramSent = await sendTelegramNotification(cleaned);

    if (dbError && !telegramSent) {
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Позвоните нам." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Заявка принята! Мы свяжемся с вами в ближайшее время.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}