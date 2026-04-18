import { ArrowRight, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";

export default function CTABlock() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 text-white relative overflow-hidden" aria-label="Призыв к действию">
      {/* Декоративные элементы с анимацией */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 bg-primary-500/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse-soft" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse-soft" 
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" 
        aria-hidden="true" 
      />

      <Container className="relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/50" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <h2 className="text-white mb-6 text-balance">
            Когда вы готовы поговорить — я здесь, чтобы выслушать
          </h2>

          <p className="text-primary-100 text-lg leading-relaxed mb-10 text-balance">
            Первый шаг — всегда самый сложный. Но вам не нужно проходить этот
            путь в одиночку. Запишитесь на консультацию, и мы вместе разберёмся.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/booking"
              variant="accent"
              size="lg"
            >
              Записаться на консультацию
              <ArrowRight className="w-5 h-5" />
            </Button>

            <a
              href={`https://t.me/${siteConfig.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-medium border-2 border-white/20 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Написать в Telegram
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
