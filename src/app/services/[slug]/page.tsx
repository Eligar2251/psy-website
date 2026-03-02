import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Clock,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { services, siteConfig, blogPosts } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) return { title: "Услуга не найдена" };

  return {
    title: service.title,
    description: service.shortDescription,
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.shortDescription,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Связанные статьи (по простому совпадению)
  const relatedPosts = blogPosts.slice(0, 2);

  // Другие услуги
  const otherServices = services
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <div className="pt-20">
      {/* Хлебные крошки + Hero */}
      <section className="section-padding gradient-section">
        <Container narrow>
          {/* Хлебные крошки */}
          <nav className="mb-8" aria-label="Хлебные крошки">
            <ol className="flex items-center gap-2 text-sm text-stone-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-600 transition-colors"
                >
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary-600 transition-colors"
                >
                  Услуги
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-900 font-medium">{service.title}</li>
            </ol>
          </nav>

          <h1 className="text-stone-900 mb-6">{service.title}</h1>

          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            {service.fullDescription}
          </p>

          {/* Мета */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-stone-600">
              <Clock className="w-5 h-5 text-primary-500" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Monitor className="w-5 h-5 text-primary-500" />
              <span>{service.format.join(" / ")}</span>
            </div>
            <div className="font-heading font-semibold text-primary-700 text-lg">
              {service.price}
            </div>
          </div>

          <Button href="/booking" size="lg">
            Записаться на консультацию
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Container>
      </section>

      {/* Для кого */}
      <section className="section-padding bg-white">
        <Container narrow>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Подходит если */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-6">
                Подходит, если вы испытываете
              </h2>
              <ul className="space-y-4">
                {service.forWhom.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                    </span>
                    <span className="text-stone-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Результаты */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-6">
                Что вы получите
              </h2>
              <ul className="space-y-4">
                {service.benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Как проходит работа */}
      <section className="section-padding gradient-section">
        <Container narrow>
          <h2 className="text-3xl font-heading font-semibold text-stone-900 mb-8 text-center">
            Как проходит работа
          </h2>

          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                step: "1",
                title: "Знакомство и диагностика",
                text: "На первых 1–2 сессиях мы обсуждаем ваш запрос, историю и текущее состояние. Я задаю вопросы, чтобы понять контекст и подобрать оптимальный подход.",
              },
              {
                step: "2",
                title: "Постановка целей",
                text: "Вместе определяем, к какому результату вы хотите прийти. Формулируем конкретные, достижимые цели терапии.",
              },
              {
                step: "3",
                title: "Активная работа",
                text: "Основной этап: мы работаем с мыслями, эмоциями и поведением. Я делюсь техниками, которые вы сможете использовать в жизни между сессиями.",
              },
              {
                step: "4",
                title: "Закрепление результатов",
                text: "Оцениваем прогресс, закрепляем навыки и обсуждаем стратегии поддержания результата после завершения терапии.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-stone-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Связанные статьи */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-white">
          <Container narrow>
            <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-8">
              Полезные материалы по теме
            </h2>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card group"
                >
                  <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-stone-900 mt-3 mb-2 group-hover:text-primary-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Другие услуги */}
      <section className="section-padding gradient-section">
        <Container>
          <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-8 text-center">
            Другие направления
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card group text-center"
              >
                <h3 className="font-heading font-semibold text-stone-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                  {s.shortDescription}
                </p>
                <span className="text-sm text-primary-600 font-medium">
                  Подробнее →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Button href="/services" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
              Все услуги
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-600 text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white mb-4">
              Готовы сделать первый шаг?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Оставьте заявку — я свяжусь с вами в течение 24 часов, и мы
              обсудим ваш запрос.
            </p>
            <Button href="/booking" variant="accent" size="lg">
              Записаться на консультацию
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: service.title,
            description: service.fullDescription,
            howPerformed: service.format.join(", "),
            procedureType: "http://schema.org/TherapeuticProcedure",
          }),
        }}
      />
    </div>
  );
}