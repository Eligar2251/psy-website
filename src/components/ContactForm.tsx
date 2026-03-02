"use client";

import { useState, FormEvent } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [state, setState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState({ status: "loading", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setState({ status: "success", message: data.message });
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setState({
          status: "error",
          message: data.error || "Ошибка. Попробуйте позже.",
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Ошибка сети. Проверьте подключение.",
      });
    }
  };

  if (state.status === "success") {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-stone-900 mb-2">
          Сообщение отправлено!
        </h3>
        <p className="text-stone-500 mb-6">{state.message}</p>
        <button
          onClick={() => setState({ status: "idle", message: "" })}
          className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Имя */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Имя <span className="text-accent-500">*</span>
          </label>
          <input
            id="contact-name"
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

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Email <span className="text-accent-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Телефон */}
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Телефон
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>

        {/* Тема */}
        <div>
          <label
            htmlFor="contact-subject"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Тема
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          >
            <option value="">Выберите тему</option>
            <option value="Запись на консультацию">Запись на консультацию</option>
            <option value="Вопрос о формате">Вопрос о формате работы</option>
            <option value="Сотрудничество">Сотрудничество</option>
            <option value="Другое">Другое</option>
          </select>
        </div>
      </div>

      {/* Сообщение */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Сообщение <span className="text-accent-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          maxLength={1000}
          placeholder="Расскажите немного о том, что вас привело..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
        />
        <p className="mt-1 text-xs text-stone-400 text-right">
          {form.message.length}/1000
        </p>
      </div>

      {/* Ошибка */}
      {state.status === "error" && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {state.message}
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
        и даёте согласие на обработку персональных данных.
      </p>

      {/* Кнопка */}
      <Button
        type="submit"
        disabled={state.status === "loading"}
        className="w-full sm:w-auto"
      >
        {state.status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Отправляю...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Отправить сообщение
          </>
        )}
      </Button>
    </form>
  );
}