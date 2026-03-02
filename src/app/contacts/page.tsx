import { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  MessageCircle,
} from "lucide-react";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Контакты психолога ${siteConfig.name}. Запишитесь на консультацию по телефону, email или через Telegram.`,
};

const contactInfo = [
  {
    icon: Phone,
    label: "Телефон",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    description: "Звоните в рабочее время",
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    description: "Ответ в течение 24 часов",
  },
  {
    icon: Send,
    label: "Telegram",
    value: siteConfig.telegram,
    href: `https://t.me/${siteConfig.telegram.replace("@", "")}`,
    description: "Самый быстрый способ связи",
  },
  {
    icon: MapPin,
    label: "Адрес",
    value: siteConfig.address,
    href: `https://yandex.ru/maps/?text=${encodeURIComponent(siteConfig.address)}`,
    description: "Для очных консультаций",
  },
];

export default function ContactsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <div className="text-center">
            <p className="text-primary-600 font-medium mb-3">Контакты</p>
            <h1 className="text-stone-900 mb-6">Свяжитесь со мной</h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Выберите удобный способ связи. Я отвечу в течение 24 часов и
              помогу подобрать удобное время для встречи.
            </p>
          </div>
        </Container>
      </section>

      {/* Контакты + Форма */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Левая колонка — информация */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-6">
                Контактная информация
              </h2>

              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      target={item.label === "Telegram" || item.label === "Адрес" ? "_blank" : undefined}
                      rel={item.label === "Telegram" || item.label === "Адрес" ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary-50/50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 group-hover:text-primary-700 transition-colors">
                          {item.value}
                        </p>
                        <p className="text-sm text-stone-400">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Время работы */}
              <div className="p-5 rounded-xl bg-warm-50 border border-warm-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <h3 className="font-heading font-semibold text-stone-900">
                    Время работы
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-stone-600">
                  <p>Понедельник — Пятница: 9:00 — 20:00</p>
                  <p>Суббота: 10:00 — 16:00</p>
                  <p>Воскресенье: выходной</p>
                </div>
              </div>
            </div>

            {/* Правая колонка — форма */}
            <div className="lg:col-span-3">
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-heading font-semibold text-stone-900">
                    Написать сообщение
                  </h2>
                </div>
                <p className="text-stone-500 mb-8">
                  Расскажите немного о том, что вас привело. Это поможет мне
                  лучше подготовиться к нашему разговору.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}