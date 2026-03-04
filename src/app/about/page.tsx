import { Metadata } from "next";
import {
  CheckCircle,
  GraduationCap,
  Award,
  BookOpen,
  Heart,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Обо мне",
  description: `${siteConfig.name} — клинический психолог, КПТ-терапевт. 10+ лет опыта. Узнайте о моём подходе, образовании и методах работы.`,
};

const education = [
  {
    year: "2012",
    title: "МГУ им. М.В. Ломоносова",
    description: "Факультет психологии, специализация — клиническая психология",
  },
  {
    year: "2014",
    title: "Институт когнитивно-поведенческой терапии",
    description: "Сертификационная программа КПТ (400+ часов)",
  },
  {
    year: "2017",
    title: "Схема-терапия",
    description:
      "Международная сертификация ISST (International Society of Schema Therapy)",
  },
  {
    year: "2020",
    title: "Майндфулнесс-подходы",
    description:
      "Программа MBSR (Mindfulness-Based Stress Reduction), сертификат инструктора",
  },
  {
    year: "2023",
    title: "Повышение квалификации",
    description: "Работа с травмой, EMDR-терапия — базовый курс",
  },
];

const approaches = [
  {
    icon: BookOpen,
    title: "Когнитивно-поведенческая терапия (КПТ)",
    description:
      "Помогает выявить и изменить негативные паттерны мышления, которые влияют на эмоции и поведение. Один из самых исследованных и эффективных методов.",
  },
  {
    icon: Heart,
    title: "Схема-терапия",
    description:
      "Глубинная работа с устойчивыми паттернами (схемами), сформированными в детстве. Особенно эффективна при хронических сложностях в отношениях и самооценке.",
  },
  {
    icon: Award,
    title: "Майндфулнесс",
    description:
      "Практики осознанности, которые помогают снизить стресс, научиться управлять эмоциями и быть в контакте с настоящим моментом.",
  },
];

const values = [
  {
    title: "Безопасность",
    description:
      "Терапия — это пространство, где можно быть собой без страха осуждения",
  },
  {
    title: "Уважение к темпу клиента",
    description: "Мы двигаемся только с той скоростью, которая комфортна вам",
  },
  {
    title: "Доказательный подход",
    description:
      "Я использую методы, эффективность которых подтверждена исследованиями",
  },
  {
    title: "Постоянное развитие",
    description:
      "Регулярная супервизия, обучение и профессиональный рост — для меня это обязательно",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero секция */}
      <section className="section-padding gradient-section">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Фото */}
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-warm-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/50 flex items-center justify-center">
                      <span className="text-5xl">👩‍⚕️</span>
                    </div>
                    <p className="text-primary-700 font-medium">
                      Профессиональное фото
                    </p>
                    <p className="text-primary-500 text-sm mt-1">
                      800×1060px рекомендуется
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Текст */}
            <div className="order-1 lg:order-2">
              <p className="text-primary-600 font-medium mb-3">Обо мне</p>
              <h1 className="text-stone-900 mb-6">
                Привет, я Елена
              </h1>
              <div className="space-y-4 text-stone-600 leading-relaxed text-lg">
                <p>
                  Мне было 22 года, когда я впервые оказалась в кабинете
                  психолога — не как специалист, а как клиент. Тот опыт изменил
                  мою жизнь и определил мой профессиональный путь.
                </p>
                <p>
                  Я поняла, как важно иметь рядом человека, который слушает
                  без осуждения. Который помогает увидеть то, что ты сам не
                  замечаешь. Который верит в тебя, даже когда ты сам не
                  веришь.
                </p>
                <p>
                  Сегодня, спустя 10+ лет практики и 500+ клиентов, я
                  продолжаю учиться — у своих клиентов, коллег и у самой
                  жизни. Каждая история уникальна, и я благодарна за
                  доверие, которое мне оказывают.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Образование */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeading
            title="Образование и квалификация"
            subtitle="Постоянное профессиональное развитие — часть моей работы"
          />

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Вертикальная линия */}
              <div
                className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary-100"
                aria-hidden="true"
              />

              <div className="space-y-8">
                {education.map((item, index) => (
                  <div key={index} className="relative flex gap-6">
                    {/* Точка */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>

                    {/* Контент */}
                    <div className="pb-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-heading font-semibold text-stone-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-stone-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Подходы */}
      <section className="section-padding gradient-section">
        <Container>
          <SectionHeading
            title="Мой подход"
            subtitle="Я работаю в интегративном подходе, сочетая несколько доказательных методов"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {approaches.map((approach, index) => {
              const Icon = approach.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-stone-900 mb-3">
                    {approach.title}
                  </h3>
                  <p className="text-stone-500 leading-relaxed text-sm">
                    {approach.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Ценности */}
      <section className="section-padding bg-white">
        <Container narrow>
          <SectionHeading
            title="Принципы моей работы"
            subtitle="Ценности, которые лежат в основе каждой сессии"
          />

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-semibold text-stone-900 mb-1">
                    {value.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-600 text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white mb-4">Готовы начать?</h2>
            <p className="text-primary-100 text-lg mb-8">
              Расскажите немного о том, что вас привело — и мы найдём лучший
              формат работы для вас.
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