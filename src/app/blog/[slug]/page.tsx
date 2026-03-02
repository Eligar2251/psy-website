import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { blogPosts, siteConfig } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return { title: "Статья не найдена" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  // Пример развёрнутого контента (в реальности будет из CMS/Supabase)
  const articleContent = getArticleContent(slug);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-section pb-12">
        <Container narrow>
          {/* Хлебные крошки */}
          <nav className="mb-8" aria-label="Хлебные крошки">
            <ol className="flex items-center gap-2 text-sm text-stone-500">
              <li>
                <Link href="/" className="hover:text-primary-600 transition-colors">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-600 transition-colors">
                  Блог
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-900 font-medium line-clamp-1">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Мета */}
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-stone-400">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <time className="text-sm text-stone-400" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-stone-900 mb-6">{post.title}</h1>

          <p className="text-xl text-stone-600 leading-relaxed">
            {post.excerpt}
          </p>
        </Container>
      </section>

      {/* Контент статьи */}
      <section className="py-12 bg-white">
        <Container narrow>
          <article className="prose prose-stone prose-lg max-w-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: articleContent }} />
          </article>

          {/* CTA в статье */}
          <div className="mt-12 p-8 rounded-2xl bg-primary-50 border border-primary-100 text-center">
            <h3 className="text-xl font-heading font-semibold text-stone-900 mb-3">
              Нужна профессиональная поддержка?
            </h3>
            <p className="text-stone-600 mb-6 max-w-lg mx-auto">
              Если вы узнали себя в этой статье — я могу помочь. Запишитесь
              на консультацию, и мы вместе разберёмся.
            </p>
            <Button href="/booking">
              Записаться
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Другие статьи */}
      {otherPosts.length > 0 && (
        <section className="section-padding gradient-section">
          <Container narrow>
            <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-8">
              Читайте также
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card group"
                >
                  <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                    {p.category}
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-stone-900 mt-3 mb-2 group-hover:text-primary-700 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Button href="/blog" variant="ghost">
                <ArrowLeft className="w-4 h-4" />
                Все статьи
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: siteConfig.name,
            },
          }),
        }}
      />
    </div>
  );
}

// Временный контент статей (в продакшене будет из Supabase / CMS)
function getArticleContent(slug: string): string {
  const contents: Record<string, string> = {
    "chto-takoe-trevozhnost": `
      <h2>Что такое тревожность?</h2>
      <p>Тревога — это естественная эмоция, которая помогает нам реагировать на опасность. Она становится проблемой, когда возникает без реальной угрозы и мешает жить.</p>
      
      <h3>Нормальная тревога vs тревожное расстройство</h3>
      <p>Нормальная тревога — это волнение перед экзаменом или важным разговором. Она мотивирует и помогает подготовиться. Тревожное расстройство — это когда тревога становится хронической, непропорциональной ситуации и мешает повседневной жизни.</p>
      
      <h3>Признаки повышенной тревожности</h3>
      <ul>
        <li>Постоянное беспокойство, которое трудно контролировать</li>
        <li>Физические симптомы: учащённое сердцебиение, потливость, мышечное напряжение</li>
        <li>Нарушение сна — трудно заснуть из-за навязчивых мыслей</li>
        <li>Избегание определённых ситуаций или мест</li>
        <li>Раздражительность и трудности с концентрацией</li>
      </ul>
      
      <h3>Что делать прямо сейчас</h3>
      <p>Если вы узнали себя в описании выше — не паникуйте. Тревожные расстройства хорошо поддаются терапии. Вот несколько шагов, которые можно предпринять:</p>
      <ol>
        <li><strong>Дышите.</strong> Техника 4-7-8: вдох на 4 счёта, задержка на 7, выдох на 8.</li>
        <li><strong>Заземляйтесь.</strong> Метод 5-4-3-2-1: назовите 5 вещей, которые видите, 4 — которые слышите, 3 — к которым можете прикоснуться, 2 — которые чувствуете на вкус, 1 — на запах.</li>
        <li><strong>Обратитесь за помощью.</strong> Психолог поможет найти корни тревоги и научит справляться с ней эффективно.</li>
      </ol>
    `,
    "5-priznakov-vygoraniya": `
      <h2>Профессиональное выгорание: как распознать</h2>
      <p>Выгорание — это не просто усталость. Это состояние физического, эмоционального и ментального истощения, вызванное длительным стрессом на работе.</p>
      
      <h3>5 главных признаков</h3>
      <h4>1. Хроническая усталость</h4>
      <p>Вы чувствуете себя истощённым даже после отдыха. Утро начинается с ощущения, что вы уже устали. Выходных и отпуска «не хватает».</p>
      
      <h4>2. Цинизм и отстранённость</h4>
      <p>Работа, которая раньше вдохновляла, вызывает раздражение. Вы становитесь равнодушны к результатам и коллегам.</p>
      
      <h4>3. Снижение продуктивности</h4>
      <p>Задачи, которые раньше давались легко, теперь требуют огромных усилий. Вы чувствуете, что работаете всё больше, а результатов всё меньше.</p>
      
      <h4>4. Физические симптомы</h4>
      <p>Головные боли, проблемы со сном, частые простуды — тело сигнализирует о перегрузке.</p>
      
      <h4>5. Потеря смысла</h4>
      <p>Самый тревожный признак — ощущение бессмысленности. «Зачем я это делаю?» — этот вопрос звучит всё чаще.</p>
      
      <h3>Что с этим делать?</h3>
      <p>Выгорание — не слабость и не лень. Это сигнал о том, что нужно что-то менять. Психотерапия помогает разобраться в причинах, восстановить ресурсы и выстроить здоровые границы.</p>
    `,
    "kak-vybrat-psychologa": `
      <h2>Как выбрать «своего» психолога</h2>
      <p>Выбор психолога — важный шаг. Правильный специалист может значительно улучшить качество жизни, а неподходящий — оставить разочарование в терапии.</p>
      
      <h3>На что обращать внимание</h3>
      <h4>Образование и квалификация</h4>
      <p>Убедитесь, что специалист имеет профильное образование (психология, клиническая психология, психотерапия) и регулярно повышает квалификацию.</p>
      
      <h4>Подход и методы</h4>
      <p>Разные подходы эффективны для разных задач. КПТ хорошо работает с тревогой и депрессией, схема-терапия — с паттернами из детства, психоанализ — для глубокой проработки.</p>
      
      <h4>Специализация</h4>
      <p>Психолог, который работает со всем подряд, часто менее эффективен, чем тот, кто специализируется на вашем конкретном запросе.</p>
      
      <h4>Личный контакт</h4>
      <p>Самый важный фактор — терапевтический альянс. Вам должно быть комфортно с этим человеком. Если после 2–3 сессий вы не чувствуете доверия, возможно, стоит попробовать другого специалиста.</p>
      
      <h3>Красные флаги</h3>
      <ul>
        <li>Гарантии «вылечить» за определённое число сессий</li>
        <li>Нарушение границ (переписка в нерабочее время, дружба)</li>
        <li>Осуждение или обесценивание ваших переживаний</li>
        <li>Давление на принятие решений</li>
        <li>Отсутствие профильного образования</li>
      </ul>
    `,
  };

  return contents[slug] || `<p>Контент статьи готовится...</p>`;
}