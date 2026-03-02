import { CheckCircle, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const credentials = [
  "Клинический психолог, КПТ-терапевт",
  "10+ лет практического опыта",
  "500+ клиентов прошли терапию",
  "Регулярная супервизия и повышение квалификации",
  "Член Ассоциации когнитивно-поведенческой психотерапии",
];

export default function AboutPreview() {
  return (
    <section className="section-padding bg-white" aria-label="Обо мне">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Фото */}
          <div className="relative">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-card max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-warm-200 to-primary-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-white/50 flex items-center justify-center">
                    <span className="text-4xl">👩‍⚕️</span>
                  </div>
                  <p className="text-primary-700 text-sm font-medium">
                    Фото психолога
                  </p>
                </div>
              </div>
            </div>

            {/* Декоративный элемент */}
            <div
              className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-primary-100/50 -z-10"
              aria-hidden="true"
            />
          </div>

          {/* Текст */}
          <div>
            <p className="text-primary-600 font-medium mb-3">Обо мне</p>
            <h2 className="text-stone-900 mb-6">
              Елена Сорокина
            </h2>

            <div className="space-y-4 text-stone-600 leading-relaxed mb-8">
              <p>
                Я верю, что каждый человек заслуживает быть услышанным.
                Психотерапия — это не про &laquo;починить&raquo; вас, а про
                то, чтобы вместе найти ваш путь к более осознанной и
                наполненной жизни.
              </p>
              <p>
                В своей практике я сочетаю когнитивно-поведенческую терапию,
                схема-терапию и майндфулнесс-подходы. Это позволяет
                подобрать оптимальную стратегию для каждого клиента.
              </p>
            </div>

            {/* Список компетенций */}
            <ul className="space-y-3 mb-8">
              {credentials.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-700">{item}</span>
                </li>
              ))}
            </ul>

            <Button href="/about" variant="outline">
              Подробнее обо мне
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}