"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, AlertCircle, Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Явная проверка env (частая причина "не работает на Vercel")
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setError(
          "Supabase не настроен: нет NEXT_PUBLIC_SUPABASE_URL или NEXT_PUBLIC_SUPABASE_ANON_KEY в Vercel Environment Variables."
        );
        return;
      }

      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("invalid login credentials")) {
          setError("Неверный email или пароль");
        } else if (msg.includes("email not confirmed")) {
          setError("Email не подтверждён. Проверьте почту (если подтверждение включено).");
        } else {
          setError(authError.message);
        }
        return;
      }

      // Если вдруг session не создалась — покажем ошибку
      if (!data.session) {
        setError("Не удалось создать сессию. Попробуйте ещё раз.");
        return;
      }

      // Самый надёжный способ, чтобы UI точно обновился
      window.location.assign(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setError("Ошибка входа. Откройте консоль и проверьте настройки Supabase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
            autoComplete="email"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Пароль
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="current-password"
            placeholder="Минимум 6 символов"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Вхожу...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Войти
          </>
        )}
      </Button>

      <p className="text-center text-sm text-stone-500">
        Нет аккаунта?{" "}
        <Link
          href="/auth/register"
          className="text-primary-600 font-medium hover:text-primary-700 hover:underline"
        >
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}