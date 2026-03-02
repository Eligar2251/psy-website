"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  MessageSquare,
  Star,
  Settings,
  Shield,
} from "lucide-react";
import { clsx } from "clsx";
import type { Profile } from "@/lib/types";

interface SidebarProps {
  profile: Profile | null;
  isAdmin: boolean;
}

export default function DashboardSidebar({ profile, isAdmin }: SidebarProps) {
  const pathname = usePathname();

  const userLinks = [
    {
      href: "/dashboard",
      label: "Обзор",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/settings",
      label: "Настройки профиля",
      icon: Settings,
    },
  ];

  const adminLinks = [
    {
      href: "/dashboard/posts",
      label: "Статьи",
      icon: FileText,
    },
    {
      href: "/dashboard/posts/new",
      label: "Новая статья",
      icon: PenSquare,
    },
    {
      href: "/dashboard/reviews",
      label: "Отзывы",
      icon: Star,
    },
    {
      href: "/dashboard/comments",
      label: "Комментарии",
      icon: MessageSquare,
    },
  ];

  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "Пользователь";

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-soft p-5 sticky top-28">
        {/* Профиль */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-stone-100">
          <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">
              {displayName[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-stone-900 truncate text-sm">
              {displayName}
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs text-primary-600 font-medium">
                <Shield className="w-3 h-3" />
                Администратор
              </span>
            )}
          </div>
        </div>

        {/* Навигация */}
        <nav className="space-y-1">
          {userLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          {/* Админ-секция */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-medium text-stone-400 uppercase tracking-wider">
                  Управление
                </p>
              </div>
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href === "/dashboard/posts" &&
                    pathname.startsWith("/dashboard/posts") &&
                    pathname !== "/dashboard/posts/new");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}