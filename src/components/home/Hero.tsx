"use client";

import { ArrowRight, Play, Shield, Clock, Video } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden"
      aria-label="Главный экран"
    >
      {/* Фоновый градиент */}
      <div className="absolute inset-0 gradient-section" aria-hidden="true" />

      {/* Декоративные элементы */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-accent-200/15 rounded-full blur-3xl" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Текстовая часть */}
          <div className="max-w-xl">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 text-primary-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Запись на ближайшую неделю открыта
            </div>

            {/* Заголовок */}
            <h1 className="text-stone-900 mb-6">
              Пространство, где вас{" "}
              <span className="text-primary-600">услышат</span> и{" "}
              <span className="text-primary-600">поймут</span>
            </h1>

            {/* Подзаголовок */}
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-8 text-balance">
              Профессиональная психологическая помощь при тревоге, выгорании,
              сложностях в отношениях. Онлайн и очно в Москве.
            </p>

            {/* CTA кнопки */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button href="/booking" size="lg">
                Когда вы готовы — я здесь
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button href="/about" variant="outline" size="lg">
                <Play className="w-4 h-4" />
                Узнать обо мне
              </Button>
            </div>

            {/* Микро-преимущества */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-500" />
                Конфиденциально
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                Ответ за 24 часа
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary-500" />
                Онлайн и очно
              </div>
            </div>
          </div>

          {/* Фото-блок */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated">
              {/* Плейсхолдер для фото психолога */}
              <img
                src="/photo-hero.jpg"
                alt="Елена Сорокина — психолог, психотерапевт"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Плавающая карточка — опыт (слева внизу) */}
            <div className="absolute -left-6 bottom-20 bg-white rounded-2xl shadow-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">10+ лет</p>
                  <p className="text-sm text-stone-500">опыта работы</p>
                </div>
              </div>
            </div>

            {/* Плавающая карточка — клиенты (справа, ВЫШЕ — top-4) */}
            <div className="absolute -right-4 top-4 bg-white rounded-2xl shadow-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                  <span className="text-2xl">💛</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">500+</p>
                  <p className="text-sm text-stone-500">довольных клиентов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}