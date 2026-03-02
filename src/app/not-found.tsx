import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20">
      <Container>
        <div className="text-center max-w-md mx-auto">
          <p className="text-8xl font-heading font-bold text-primary-200 mb-4">
            404
          </p>
          <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-4">
            Страница не найдена
          </h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Возможно, эта страница была перемещена или удалена.
            Давайте вернёмся на главную — там есть всё, что вам нужно.
          </p>
          <Button href="/">Вернуться на главную</Button>
        </div>
      </Container>
    </div>
  );
}