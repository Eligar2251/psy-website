"use client";

import { useState, FormEvent } from "react";
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { services } from "@/lib/data";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    format: "",
    preferred_time: "",
    message: "",
  });

  const [state, setState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState({ status: "loading", message: "" });

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setState({ status: "success", message: data.message });
        setForm({
          name: "",
          phone: "",
          email: "",
          service: "",
          format: "",
          preferred_time: "",
          message: "",
        });
      } else {
        const errorMsg =
          data.details?.join(". ") || data.error || "Ошибка. Попробуйте позже.";
        setState({ status: "error", message: errorMsg });
      }
    } catch {
      setState({
        status: "error",
        message: "Ошибка сети. Проверьте подключение и попробуйте снова.",
      });
    }
  };

  // Экран успеха
  if (state.status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <CalendarCheck className="w-10 h-10 text-primary-600" />
        </div>
        <h3 className="text-2xl font-heading font-semibold text-stone-900 mb-3">
          Заявка отправлена!
        </h3>
        <p className="text-stone-500 text-lg mb-2">{state.message}</p>
        <p className="text-stone-400 text-sm mb-8">
          Обычно я отвечаю в течение нескольких часов в рабочее время.
        </p>
        <button
          onClick={() => setState({ status: "idle", message: "" })}
          className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-5">
        {/* Имя и Телефон */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="booking-name"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Ваше имя <span className="text-accent-500">*</span>
            </label>
            <input
              id="booking-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              placeholder="Как к вам обращаться"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="booking-phone"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Телефон <span className="text-accent-500">*</span>
            </label>
            <input
              id="booking-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+7 (999) 123-45-67"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="booking-email"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Email{" "}
            <span className="text-stone-400 font-normal">(необязательно)</span>
          </label>
          <input
            id="booking-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>

        {/* Услуга и Формат */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="booking-service"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Направление <span className="text-accent-500">*</span>
            </label>
            <select
              id="booking-service"
              name="service"
              value={form.service}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            >
              <option value="">Выберите направление</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value="Не знаю, нужна помощь с выбором">
                Не знаю, нужна помощь с выбором
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="booking-format"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Формат <span className="text-accent-500">*</span>
            </label>
            <select
              id="booking-format"
              name="format"
              value={form.format}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            >
              <option value="">Выберите формат</option>
              <option value="Онлайн (видео)">Онлайн (видео)</option>
              <option value="Онлайн (аудио)">Онлайн (аудио)</option>
              <option value="Очно в кабинете">Очно в кабинете</option>
              <option value="Пока не определился">Пока не определился</option>
            </select>
          </div>
        </div>

        {/* Удобное время */}
        <div>
          <label
            htmlFor="booking-time"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Удобное время для связи{" "}
            <span className="text-stone-400 font-normal">(необязательно)</span>
          </label>
          <input
            id="booking-time"
            type="text"
            name="preferred_time"
            value={form.preferred_time}
            onChange={handleChange}
            placeholder="Например: будни после 18:00"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>

        {/* Сообщение */}
        <div>
          <label
            htmlFor="booking-message"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Расскажите о вашем запросе{" "}
            <span className="text-stone-400 font-normal">(необязательно)</span>
          </label>
          <textarea
            id="booking-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
            placeholder="Что вас беспокоит? О чём хотели бы поговорить? Любая информация поможет мне подготовиться к нашей встрече..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
          />
          <p className="mt-1 text-xs text-stone-400 text-right">
            {form.message.length}/1000
          </p>
        </div>
      </div>

      {/* Ошибка */}
      {state.status === "error" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Согласие */}
      <p className="text-xs text-stone-400 leading-relaxed">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a
          href="/privacy"
          className="text-primary-600 hover:underline"
        >
          политикой конфиденциальности
        </a>{" "}
        и даёте согласие на обработку персональных данных. Ваши данные защищены
        и не будут переданы третьим лицам.
      </p>

      {/* Кнопка */}
      <Button
        type="submit"
        disabled={state.status === "loading"}
        size="lg"
        className="w-full"
      >
        {state.status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Отправляю заявку...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Отправить заявку
          </>
        )}
      </Button>
    </form>
  );
}