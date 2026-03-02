import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Star,
  PenSquare,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase-server";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

export default async function DashboardPage() {
  const { profile } = await getCurrentUser();
  const isAdmin = profile?.role === "admin";
  const supabase = await createServerSupabase();

  let stats = { posts: 0, reviews: 0, comments: 0 };

  if (isAdmin) {
    const [postsRes, reviewsRes, commentsRes] = await Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", false),
      supabase.from("comments").select("id", { count: "exact", head: true }),
    ]);

    stats = {
      posts: postsRes.count || 0,
      reviews: reviewsRes.count || 0,
      comments: commentsRes.count || 0,
    };
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Добро пожаловать, {profile?.full_name || "Пользователь"}!
        </h1>
        <p className="text-stone-500">
          {isAdmin ? "Панель управления сайтом" : "Ваш личный кабинет"}
        </p>
      </div>

      {/* Статистика для админа */}
      {isAdmin && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-stone-900">
                  {stats.posts}
                </p>
                <p className="text-xs text-stone-400">Статей</p>
              </div>
            </div>
            <Link
              href="/dashboard/posts"
              className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
            >
              Управлять <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-stone-900">
                  {stats.reviews}
                </p>
                <p className="text-xs text-stone-400">Ожидают модерации</p>
              </div>
            </div>
            <Link
              href="/dashboard/reviews"
              className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
            >
              Модерировать <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-stone-900">
                  {stats.comments}
                </p>
                <p className="text-xs text-stone-400">Комментариев</p>
              </div>
            </div>
            <Link
              href="/dashboard/comments"
              className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
            >
              Просмотреть <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Быстрые действия */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-lg font-heading font-semibold text-stone-900 mb-4">
            Быстрые действия
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/posts/new"
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
            >
              <PenSquare className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-stone-900 text-sm">
                  Написать статью
                </p>
                <p className="text-xs text-stone-400">Создать новый пост</p>
              </div>
            </Link>
            <Link
              href="/dashboard/reviews"
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
            >
              <Star className="w-5 h-5 text-accent-600" />
              <div>
                <p className="font-medium text-stone-900 text-sm">
                  Проверить отзывы
                </p>
                <p className="text-xs text-stone-400">Модерация новых отзывов</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Для обычных пользователей */}
      {!isAdmin && (
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-lg font-heading font-semibold text-stone-900 mb-3">
            Что вы можете делать
          </h2>
          <ul className="space-y-3 text-stone-600 text-sm">
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              Оставлять комментарии к статьям
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent-500" />
              Написать отзыв о терапии
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}