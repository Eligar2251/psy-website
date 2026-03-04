"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  LogIn,
  MessageSquare,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";

type CommentRow = {
  id: string;
  created_at: string;
  content: string;
  author_id: string;
  profiles: { full_name: string | null } | null;
};

export default function CommentSection({ postId }: { postId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const { user, profile, isLoading: authLoading, isAdmin } = useAuth();

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Загрузка комментариев
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingComments(true);

        const { data, error } = await supabase
          .from("comments")
          .select("id, created_at, content, author_id, profiles(full_name)")
          .eq("post_id", postId)
          .eq("is_approved", true)
          .order("created_at", { ascending: true });

        if (!alive) return;

        if (error) {
          console.error("Fetch comments error:", error);
          setComments([]);
        } else {
          setComments((data as CommentRow[]) || []);
        }
      } finally {
        if (alive) setLoadingComments(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [postId, supabase]);

  // Отправка комментария (НАПРЯМУЮ В SUPABASE)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Войдите, чтобы оставить комментарий.");
      return;
    }

    const content = newComment.trim();
    if (!content) return;

    if (content.length > 2000) {
      setError("Комментарий слишком длинный (макс. 2000 символов).");
      return;
    }

    setSending(true);
    try {
      const { data, error: insertError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
          is_approved: true, // или false, если хотите модерацию
        })
        .select("id, created_at, content, author_id, profiles(full_name)")
        .single();

      if (insertError) {
        console.error("Insert comment error:", insertError);
        setError(insertError.message);
        return;
      }

      // Добавляем в список сразу
      setComments((prev) => [...prev, data as CommentRow]);
      setNewComment("");
    } catch {
      setError("Ошибка сети. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  };

  // Удаление комментария (автор или админ)
  const handleDelete = async (commentId: string) => {
    if (!confirm("Удалить комментарий?")) return;

    try {
      const { error: delError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (delError) {
        console.error("Delete comment error:", delError);
        alert(delError.message);
        return;
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      alert("Ошибка сети");
    }
  };

  return (
    <div className="mt-12 pt-10 border-t border-stone-200">
      <h3 className="text-2xl font-heading font-semibold text-stone-900 mb-8 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary-600" />
        Комментарии
        {comments.length > 0 && (
          <span className="text-base font-normal text-stone-400">
            ({comments.length})
          </span>
        )}
      </h3>

      {/* Список комментариев */}
      {loadingComments ? (
        <div className="flex items-center gap-2 text-stone-400 mb-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          Загрузка...
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => {
            const canDelete = user?.id === comment.author_id || isAdmin;
            const name =
              comment.profiles?.full_name ||
              (comment.author_id === user?.id ? profile?.full_name : null) ||
              "Аноним";

            return (
              <div
                key={comment.id}
                className="p-5 rounded-xl bg-stone-50 border border-stone-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 text-xs font-semibold">
                          {(name || "А")[0].toUpperCase()}
                        </span>
                      </div>

                      <span className="font-medium text-stone-900 text-sm">
                        {name || "Аноним"}
                      </span>

                      <span className="text-xs text-stone-400">
                        {new Date(comment.created_at).toLocaleDateString(
                          "ru-RU",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-stone-400 mb-8 text-sm">
          Пока нет комментариев. Будьте первым!
        </p>
      )}

      {/* Форма комментария */}
      {authLoading ? null : user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            required
            maxLength={2000}
            placeholder="Напишите комментарий..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
          />

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={sending} size="sm">
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Отправляю...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Отправить
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="p-5 rounded-xl bg-stone-50 border border-stone-100 text-center">
          <LogIn className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-600 text-sm mb-3">
            Войдите, чтобы оставить комментарий
          </p>
          <div className="flex gap-2 justify-center">
            <Button href="/auth/login" size="sm">
              Войти
            </Button>
            <Button href="/auth/register" variant="outline" size="sm">
              Регистрация
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}