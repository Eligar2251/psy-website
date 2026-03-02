import { Metadata } from "next";
import Link from "next/link";
import {
  User,
  Heart,
  Sparkles,
  Users,
  Shield,
  Battery,
  ArrowRight,
  Clock,
  Monitor,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { services, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Услуги",
  description: `Услуги психолога ${siteConfig.name}: индивидуальная терапия, парная и семейная терапия, работа с тревогой, выгорание, подростковая психология.`,
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Heart,
  Sparkles,
  Users,
  Shield,
  Battery,
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <div className="text-center">
            <p className="text-primary-600 font-medium mb-3">Услуги</p>
            <h1 className="text-stone-900 mb-6">
              Направления работы
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Каждый запрос уникален. Я подбираю подход и формат работы
              индивидуально — чтобы терапия была максимально эффективной
              именно для вас.
            </p>
          </div>
        </Container>
      </section>

      {/* Список услуг */}
      <section className="section-padding bg-white">
        <Container>
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || User;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={service.slug}
                  className="card p-0 overflow-hidden"
                >
                  <div
                    className={`grid md:grid-cols-2 gap-0 ${
                      isEven ? "md:grid-flow-dense" : ""
                    }`}
                  >
                    {/* Цветной блок */}
                    <div
                      className={`bg-gradient-to-br from-primary-50 to-warm-50 p-8 md:p-10 flex flex-col justify-center ${
                        isEven ? "md:col-start-2" : ""
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                        <Icon className="w-7 h-7 text-primary-600" />
                      </div>
                      <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-3">
                        {service.title}
                      </h2>
                      <p className="text-stone-600 leading-relaxed mb-6">
                        {service.shortDescription}
                      </p>

                      {/* Мета-данные */}
                      <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-6">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary-500" />
                          {service.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Monitor className="w-4 h-4 text-primary-500" />
                          {service.format.join(" / ")}
                        </div>
                      </div>

                      <div>
                        <Button
                          href={`/services/${service.slug}`}
                          variant="primary"
                          size="sm"
                        >
                          Подробнее
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Список «Для кого» */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <p className="text-sm font-medium text-primary-600 mb-4">
                        Подходит, если вы:
                      </p>
                      <ul className="space-y-3">
                        {service.forWhom.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-stone-600"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 pt-4 border-t border-stone-100">
                        <p className="text-lg font-heading font-semibold text-stone-900">
                          {service.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-600 text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white mb-4">Не уверены, что выбрать?</h2>
            <p className="text-primary-100 text-lg mb-8">
              Это нормально. Напишите мне — расскажите о своей ситуации, и мы
              вместе подберём подходящий формат работы.
            </p>
            <Button href="/booking" variant="accent" size="lg">
              Записаться на консультацию
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}