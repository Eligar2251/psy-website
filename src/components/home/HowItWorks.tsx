import { ClipboardList, UserCheck, Video } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Оставьте заявку",
    description:
      "Заполните короткую форму или напишите в Telegram. Расскажите немного о том, что вас привело — это поможет подготовиться к встрече.",
  },
  {
    icon: UserCheck,
    number: "02",
    title: "Мы обсудим детали",
    description:
      "Я свяжусь с вами в течение 24 часов. Вместе подберём удобное время и формат — онлайн или очно.",
  },
  {
    icon: Video,
    number: "03",
    title: "Первая сессия",
    description:
      "На первой встрече мы познакомимся, обсудим ваш запрос и вместе определим план работы. Никакого давления — только в вашем темпе.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding gradient-section" aria-label="Как это работает">
      <Container>
        <SectionHeading
          title="Три простых шага"
          subtitle="От решения обратиться до первой сессии — всё максимально просто"
        />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Линия-коннектор между шагами (десктоп) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-primary-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-soft mb-6">
                  <Icon className="w-10 h-10 text-primary-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-primary-600 text-white text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-semibold text-stone-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-stone-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button href="/booking" size="lg">
            Сделать первый шаг
          </Button>
        </div>
      </Container>
    </section>
  );
}