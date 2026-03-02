"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Shield,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/lib/auth-context";

export default function UserMenu() {
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Закрываем по клику вне меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-stone-200 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-stone-600 hover:text-primary-700 hover:bg-primary-50/50 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Войти</span>
      </Link>
    );
  }

  const displayName =
    profile?.full_name || user.email?.split("@")[0] || "Пользователь";
  const initials = displayName.slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors",
          isOpen ? "bg-primary-50" : "hover:bg-stone-100"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
        <span className="hidden md:block text-sm font-medium text-stone-700 max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown
          className={clsx(
            "hidden md:block w-4 h-4 text-stone-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-stone-100 py-1 z-50 animate-slide-down">
          {/* Инфо */}
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-medium text-stone-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-stone-400 truncate">{user.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                <Shield className="w-3 h-3" />
                Администратор
              </span>
            )}
          </div>

          {/* Ссылки */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-stone-400" />
              Личный кабинет
            </Link>
          </div>

          {/* Выход */}
          <div className="border-t border-stone-100 py-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}