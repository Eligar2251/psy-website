import { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/ui/Container";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войдите в личный кабинет",
};

export default function LoginPage() {
  return (
    <div className="pt-20 min-h-[80vh] flex items-center">
      <Container narrow>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-semibold text-stone-900 mb-2">
              Вход в аккаунт
            </h1>
            <p className="text-stone-500">
              Войдите, чтобы оставлять комментарии и отзывы
            </p>
          </div>
          <div className="card">
            <Suspense fallback={<div className="py-8 text-center text-stone-400">Загрузка...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}