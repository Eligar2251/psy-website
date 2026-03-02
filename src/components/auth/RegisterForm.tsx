"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  User,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Валидация
    if (form.name.trim().length < 2) {
      setError("Имя должно содержать минимум 2 символа");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.name.trim(),
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Этот email уже зарегистрирован");
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);

      // Автоматический вход через 2 секунды
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch {
      setError("Ошибка соединения. Попробуйте позже");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-stone-900 mb-2">
          Аккаунт создан!
        </h3>
        <p className="text-stone-500">
          Добро пожаловать! Перенаправляем вас...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Имя */}
      <div>
        <label
          htmlFor="register-name"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Имя
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            id="register-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            placeholder="Как к вам обращаться"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            id="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Пароль */}
      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Пароль
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            id="register-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Минимум 6 символов"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Подтверждение пароля */}
      <div>
        <label
          htmlFor="register-password-confirm"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Подтвердите пароль
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            id="register-password-confirm"
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Повторите пароль"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Согласие */}
      <p className="text-xs text-stone-400 leading-relaxed">
        Регистрируясь, вы соглашаетесь с{" "}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          политикой конфиденциальности
        </Link>
      </p>

      {/* Кнопка */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Создаю аккаунт...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Зарегистрироваться
          </>
        )}
      </Button>

      {/* Ссылка на вход */}
      <p className="text-center text-sm text-stone-500">
        Уже есть аккаунт?{" "}
        <Link
          href="/auth/login"
          className="text-primary-600 font-medium hover:text-primary-700 hover:underline"
        >
          Войти
        </Link>
      </p>
    </form>
  );
}