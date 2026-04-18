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

      {/* Декоративные элементы с анимацией */}
      <div 
        className="gradient-orb gradient-orb-primary w-96 h-96 top-20 right-0" 
        style={{ animationDelay: '0s' }}
        aria-hidden="true" 
      />
      <div 
        className="gradient-orb gradient-orb-accent w-72 h-72 bottom-10 left-0" 
        style={{ animationDelay: '2s' }}
        aria-hidden="true" 
      />
      <div 
        className="gradient-orb gradient-orb-primary w-48 h-48 top-1/2 left-1/4 opacity-40" 
        style={{ animationDelay: '1s' }}
        aria-hidden="true" 
      />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Текстовая часть */}
          <div className="max-w-xl">
            {/* Бейдж с glassmorphism */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-primary-700 text-sm font-medium mb-6 shadow-glass">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
              </span>
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
            <div 
              className="card-float absolute -left-6 bottom-20"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">10+ лет</p>
                  <p className="text-sm text-stone-500">опыта работы</p>
                </div>
              </div>
            </div>

            {/* Плавающая карточка — клиенты (справа, ВЫШЕ — top-4) */}
            <div 
              className="card-float absolute -right-4 top-4"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-accent-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
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
