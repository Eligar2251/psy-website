interface TelegramBooking {
  name: string;
  phone: string;
  email?: string;
  service: string;
  format: string;
  preferred_time?: string;
  message?: string;
}

export async function sendTelegramNotification(
  booking: TelegramBooking
): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { ok: false, error: "Telegram env vars are missing" };
  }

  const text = `
Новая заявка с сайта

Имя: ${escapeHtml(booking.name)}
Телефон: ${escapeHtml(booking.phone)}
${booking.email ? `Email: ${escapeHtml(booking.email)}` : ""}
Услуга: ${escapeHtml(booking.service)}
Формат: ${escapeHtml(booking.format)}
${booking.preferred_time ? `Время: ${escapeHtml(booking.preferred_time)}` : ""}
${booking.message ? `Сообщение: ${escapeHtml(booking.message)}` : ""}

${new Date().toLocaleString("ru-RU")}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return { ok: false, error: `Telegram API error: ${errText}` };
    }

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown telegram error",
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}