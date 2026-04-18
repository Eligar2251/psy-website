"use client";

import { useEffect, useRef } from "react";
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
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding gradient-section relative overflow-hidden" aria-label="Как это работает">
      {/* Decorative orbs */}
      <div className="gradient-orb gradient-orb-primary w-64 h-64 -top-20 -left-20" aria-hidden="true" />
      <div className="gradient-orb gradient-orb-accent w-48 h-48 -bottom-10 -right-10" aria-hidden="true" />

      <Container className="relative z-10">
        <SectionHeading
          title="Три простых шага"
          subtitle="От решения обратиться до первой сессии — всё максимально просто"
        />

        <div 
          ref={stepsRef}
          className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12 reveal-stagger"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                {/* Линия-коннектор между шагами (десктоп) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-primary-200/60"
                    aria-hidden="true"
                  />
                )}

                <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm shadow-glass mb-6 group-hover:shadow-glass-hover group-hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-10 h-10 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white text-sm font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-semibold text-stone-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-xs mx-auto">
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
