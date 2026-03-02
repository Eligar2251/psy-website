"use client";

import { useEffect, useRef } from "react";
import {
  Brain,
  HeartCrack,
  Flame,
  CloudRain,
  Users,
  Frown,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const problems = [
  {
    icon: Brain,
    title: "Тревога и паники",
    description:
      "Постоянное беспокойство, панические атаки, ощущение что всё выходит из-под контроля",
  },
  {
    icon: Flame,
    title: "Выгорание",
    description:
      "Потеря энергии и мотивации, чувство пустоты, невозможность отключиться от работы",
  },
  {
    icon: HeartCrack,
    title: "Сложности в отношениях",
    description:
      "Конфликты с партнёром, чувство одиночества в паре, страх близости",
  },
  {
    icon: CloudRain,
    title: "Подавленность",
    description:
      "Потеря интереса к жизни, хроническая грусть, ощущение бессмысленности",
  },
  {
    icon: Frown,
    title: "Низкая самооценка",
    description:
      "Неуверенность в себе, синдром самозванца, постоянная самокритика",
  },
  {
    icon: Users,
    title: "Семейные кризисы",
    description:
      "Конфликты поколений, проблемы детско-родительских отношений, развод",
  },
];

export default function Problems() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-white" ref={sectionRef} aria-label="С чем я работаю">
      <Container>
        <SectionHeading
          title="Знакомо ли вам это?"
          subtitle="Вы не одиноки в своих переживаниях. Вот с чем ко мне чаще всего обращаются"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="reveal card group cursor-default"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
                  {problem.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Эмпатийное сообщение */}
        <div className="mt-12 text-center">
          <p className="text-stone-500 text-lg italic max-w-2xl mx-auto">
            «Если вы узнали себя хотя бы в одном из этих описаний —
            это нормально. И с этим можно работать»
          </p>
        </div>
      </Container>
    </section>
  );
}