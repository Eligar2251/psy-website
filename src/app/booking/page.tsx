import { Metadata } from "next";
import { CalendarCheck, Shield, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import BookingForm from "@/components/BookingForm";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Запись на консультацию",
  description: `Запишитесь на консультацию к психологу ${siteConfig.name}. Онлайн и очно. Ответ в течение 24 часов.`,
};

const guarantees = [
  {
    icon: Shield,
    text: "Полная конфиденциальность",
  },
  {
    icon: Clock,
    text: "Ответ в течение 24 часов",
  },
  {
    icon: CalendarCheck,
    text: "Гибкое расписание",
  },
  {
    icon: MessageCircle,
    text: "Бесплатная консультация по формату",
  },
];

export default function BookingPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <div className="text-center">
            <p className="text-primary-600 font-medium mb-3">
              Запись на консультацию
            </p>
            <h1 className="text-stone-900 mb-6">
              Расскажите немного о том, что вас привело
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Заполните форму ниже — это займёт пару минут. Я свяжусь с вами
              в течение 24 часов, чтобы подобрать удобное время.
            </p>
          </div>
        </Container>
      </section>

      {/* Форма */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Форма */}
            <div className="lg:col-span-2">
              <div className="card">
                <BookingForm />
              </div>
            </div>

            {/* Боковая панель */}
            <div className="lg:col-span-1">
              {/* Гарантии */}
              <div className="card mb-6">
                <h3 className="text-lg font-heading font-semibold text-stone-900 mb-5">
                  Что вы получите
                </h3>
                <div className="space-y-4">
                  {guarantees.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <p className="text-stone-700 text-sm">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Быстрая связь */}
              <div className="card bg-primary-50 border border-primary-100">
                <h3 className="text-lg font-heading font-semibold text-stone-900 mb-3">
                  Предпочитаете написать?
                </h3>
                <p className="text-stone-600 text-sm mb-4">
                  Напишите мне в Telegram — это самый быстрый способ связи.
                </p>
                <a
                  href={`https://t.me/${siteConfig.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary-700 font-medium shadow-sm hover:shadow-md transition-all w-full justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}