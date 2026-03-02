// Отправка уведомления в Telegram при новой заявке

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
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured");
    return false;
  }

  const text = `
🆕 <b>Новая заявка на консультацию!</b>

👤 <b>Имя:</b> ${escapeHtml(booking.name)}
📞 <b>Телефон:</b> ${escapeHtml(booking.phone)}
${booking.email ? `📧 <b>Email:</b> ${escapeHtml(booking.email)}` : ""}
🛠 <b>Услуга:</b> ${escapeHtml(booking.service)}
📋 <b>Формат:</b> ${escapeHtml(booking.format)}
${booking.preferred_time ? `🕐 <b>Удобное время:</b> ${escapeHtml(booking.preferred_time)}` : ""}
${booking.message ? `💬 <b>Сообщение:</b> ${escapeHtml(booking.message)}` : ""}

⏰ <i>${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}</i>
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
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}