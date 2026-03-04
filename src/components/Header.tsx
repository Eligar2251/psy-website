"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Menu, X, Phone } from "lucide-react";
import { navItems, siteConfig } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import Button from "./ui/Button";
import UserMenu from "./UserMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const showBooking = mounted ? !isAdmin : true;

  return (
    <header
      suppressHydrationWarning
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-heading font-bold text-lg">
                {siteConfig.name[0]}
              </span>
            </div>
            <div className="hidden sm:block" suppressHydrationWarning>
              <p className="font-heading font-semibold text-lg leading-tight text-stone-900">
                {siteConfig.name}
              </p>
              <p className="text-xs text-stone-400 leading-tight">
                {siteConfig.title}
              </p>
            </div>
          </Link>

          {/* Десктопная навигация */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary-700 bg-primary-50"
                    : "text-stone-600 hover:text-primary-700 hover:bg-primary-50/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Правая часть */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{siteConfig.phone}</span>
            </a>

            {mounted ? <UserMenu /> : <div className="w-9 h-9" />}

            {showBooking && (
              <Button href="/booking" size="sm">
                Записаться
              </Button>
            )}
          </div>

          {/* Мобильная часть */}
          <div className="flex items-center gap-2 lg:hidden">
            {mounted ? <UserMenu /> : <div className="w-9 h-9" />}
            <button
              className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 z-40">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-elevated flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <p className="font-heading font-semibold text-lg text-stone-900">
                Меню
              </p>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        pathname === item.href
                          ? "text-primary-700 bg-primary-50"
                          : "text-stone-600 hover:bg-stone-50"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-stone-100 space-y-3">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-primary-600" />
                {siteConfig.phone}
              </a>
              {showBooking && (
                <Button href="/booking" className="w-full">
                  Записаться на консультацию
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}