// Простая аналитика через Supabase
import { supabase } from "./supabase";

export async function trackPageView(page: string) {
  try {
    await supabase.from("page_views").insert({
      page,
      referrer:
        typeof document !== "undefined" ? document.referrer || null : null,
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch {
    // Молча игнорируем ошибки аналитики
  }
}