"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Shield,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function UserMenu() {
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Скелетон
  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
        <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
      </div>
    );
  }

  // НЕ авторизован: показываем кнопку "Войти"
  if (!user) {
    return (
      <button
        type="button"
        onClick={() => router.push("/auth/login")}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-stone-600 hover:text-primary-700 hover:bg-primary-50/50 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Войти</span>
      </button>
    );
  }

  const name = profile?.full_name || user.email?.split("@")[0] || "User";
  const initial = name[0]?.toUpperCase() || "U";

  const handleGoDashboard = () => {
    setIsOpen(false);
    router.push("/dashboard");
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setIsOpen(false);
    await signOut(); // signOut у вас делает window.location.href="/"
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors",
          isOpen ? "bg-primary-50" : "hover:bg-stone-100"
        )}
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{initial}</span>
        </div>

        <span className="hidden md:block text-sm font-medium text-stone-700 max-w-[120px] truncate">
          {name}
        </span>

        <ChevronDown
          className={clsx(
            "hidden md:block w-4 h-4 text-stone-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-stone-100 py-1 z-50">
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-medium text-stone-900 truncate">{name}</p>
            <p className="text-xs text-stone-400 truncate">{user.email}</p>

            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                <Shield className="w-3 h-3" />
                Администратор
              </span>
            )}
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={handleGoDashboard}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-stone-400" />
              Личный кабинет
            </button>
          </div>

          <div className="border-t border-stone-100 py-1">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isSigningOut ? "Выходим..." : "Выйти"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}