"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { clsx } from "clsx";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        "fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full",
        "bg-primary-600 text-white shadow-elevated",
        "flex items-center justify-center",
        "hover:bg-primary-700 active:bg-primary-800",
        "transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Наверх"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}