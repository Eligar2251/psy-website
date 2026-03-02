import { Metadata } from "next";
import Container from "@/components/ui/Container";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Создайте аккаунт для комментариев и отзывов",
};

export default function RegisterPage() {
  return (
    <div className="pt-20 min-h-[80vh] flex items-center">
      <Container narrow>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-semibold text-stone-900 mb-2">
              Создать аккаунт
            </h1>
            <p className="text-stone-500">
              Зарегистрируйтесь, чтобы оставлять комментарии и отзывы
            </p>
          </div>
          <div className="card">
            <RegisterForm />
          </div>
        </div>
      </Container>
    </div>
  );
}