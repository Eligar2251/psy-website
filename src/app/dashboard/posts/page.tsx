import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PenSquare,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  FileText,
} from "lucide-react";
import { isAdmin } from "@/lib/supabase-server";
import { getAllPosts } from "@/lib/posts";
import Button from "@/components/ui/Button";
import DeletePostButton from "@/components/dashboard/DeletePostButton";

export const metadata: Metadata = {
  title: "Управление статьями",
};

export default async function PostsListPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
            Статьи
          </h1>
          <p className="text-stone-500 text-sm">{posts.length} статей</p>
        </div>
        <Button href="/dashboard/posts/new" size="sm">
          <Plus className="w-4 h-4" />
          Новая статья
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
            Пока нет статей
          </h3>
          <p className="text-stone-500 mb-6 text-sm">
            Создайте первую статью для блога
          </p>
          <Button href="/dashboard/posts/new">
            <PenSquare className="w-4 h-4" />
            Написать статью
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Статья
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider hidden sm:table-cell">
                    Категория
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider hidden md:table-cell">
                    Статус
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider hidden lg:table-cell">
                    Дата
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-stone-900 text-sm line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      {post.category && (
                        <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                          {post.category}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                          <Eye className="w-3 h-3" />
                          Опубликована
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-400 font-medium">
                          <EyeOff className="w-3 h-3" />
                          Черновик
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-sm text-stone-500">
                      {new Date(post.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="p-2 rounded-lg text-stone-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Открыть на сайте"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <DeletePostButton postId={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}