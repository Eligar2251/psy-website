import { ArrowRight, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";

export default function CTABlock() {
  return (
    <section className="section-padding bg-primary-600 text-white relative overflow-hidden" aria-label="Призыв к действию">
      {/* Декоративные круги */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-700 rounded-full translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white mb-6">
            Когда вы готовы поговорить — я здесь, чтобы выслушать
          </h2>

          <p className="text-primary-100 text-lg leading-relaxed mb-10">
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
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