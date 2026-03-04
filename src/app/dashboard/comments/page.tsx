"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";

type CommentRow = {
  id: string;
  created_at: string;
  content: string;
  author_id: string;
  profiles: { full_name: string; email: string } | null;
  posts: { title: string; slug: string } | null;
};

export default function CommentsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isLoading, user, isAdmin } = useAuth();

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) return router.replace("/auth/login?redirect=/dashboard/comments");
    if (!isAdmin) return router.replace("/dashboard");

    (async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(full_name,email), posts(title,slug)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) setComments(data as any);
      setLoading(false);
    })();
  }, [isLoading, user, isAdmin, router, supabase]);

  const del = async (id: string) => {
    if (!confirm("Удалить комментарий?")) return;
    await supabase.from("comments").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  if (isLoading || loading) return <div className="text-stone-500">Загрузка...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div>
      <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-6">
        Комментарии
      </h1>

      {comments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-10 text-center text-stone-500">
          Комментариев нет
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-soft p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-stone-900 font-medium">
                    {c.profiles?.full_name || "Аноним"}{" "}
                    <span className="text-xs text-stone-400">
                      ({c.profiles?.email || ""})
                    </span>
                  </p>
                  <p className="text-xs text-stone-400 mb-2">
                    {new Date(c.created_at).toLocaleDateString("ru-RU")}
                    {c.posts?.title ? (
                      <>
                        {" "}• к статье:{" "}
                        <a className="text-primary-600 hover:underline" href={`/blog/${c.posts.slug}`} target="_blank">
                          {c.posts.title}
                        </a>
                      </>
                    ) : null}
                  </p>
                  <p className="text-stone-700 text-sm leading-relaxed">{c.content}</p>
                </div>

                <button
                  onClick={() => del(c.id)}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}