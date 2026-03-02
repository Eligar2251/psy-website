import Link from "next/link";
import { Mail, Phone, MapPin, Send, Heart } from "lucide-react";
import Container from "./ui/Container";
import { siteConfig, navItems, services } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300" role="contentinfo">
      {/* Основная часть */}
      <div className="border-b border-stone-800">
        <Container className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Колонка 1: О психологе */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-lg">
                    Н
                  </span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-white text-lg leading-tight">
                    {siteConfig.name}
                  </p>
                  <p className="text-xs text-stone-500 leading-tight">
                    {siteConfig.title}
                  </p>
                </div>
              </Link>
              <p className="text-sm text-stone-400 leading-relaxed mb-6">
                Профессиональная психологическая помощь в безопасной и
                конфиденциальной обстановке. Онлайн и очно в Москве.
              </p>
              {/* Соцсети */}
              <div className="flex gap-3">
                <a
                  href={`https://t.me/${siteConfig.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-primary-600 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Колонка 2: Навигация */}
            <div>
              <h3 className="font-heading font-semibold text-white text-base mb-4">
                Навигация
              </h3>
              <ul className="space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-stone-400 hover:text-primary-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/booking"
                    className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Записаться →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Колонка 3: Услуги */}
            <div>
              <h3 className="font-heading font-semibold text-white text-base mb-4">
                Услуги
              </h3>
              <ul className="space-y-2.5">
                {services.slice(0, 5).map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm text-stone-400 hover:text-primary-400 transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Колонка 4: Контакты */}
            <div>
              <h3 className="font-heading font-semibold text-white text-base mb-4">
                Контакты
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="flex items-start gap-3 text-sm text-stone-400 hover:text-primary-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-start gap-3 text-sm text-stone-400 hover:text-primary-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-sm text-stone-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {siteConfig.address}
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-xs text-stone-500">
                {siteConfig.workingHours}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Копирайт */}
      <Container className="py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {currentYear} {siteConfig.name}. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-stone-300 transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <span className="text-stone-700">|</span>
            <p className="flex items-center gap-1">
              Сделано с <Heart className="w-3 h-3 text-accent-500" /> заботой
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}