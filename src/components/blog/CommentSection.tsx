"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  LogIn,
  MessageSquare,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";

interface CommentData {
  id: string;
  created_at: string;
  content: string;
  author_id: string;
  profiles: {
    full_name: string;
  } | null;
}

export default function CommentSection({ postId }: { postId: string }) {
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchComments() {
      try {
        const supabase = createClient();

        const { data } = await supabase
          .from("comments")
          .select("id, created_at, content, author_id, profiles(full_name)")
          .eq("post_id", postId)
          .eq("is_approved", true)
          .order("created_at", { ascending: true });

        if (data) {
          const mapped: CommentData[] = data.map(
            (item: Record<string, unknown>) => ({
              id: item.id as string,
              created_at: item.created_at as string,
              content: item.content as string,
              author_id: item.author_id as string,
              profiles: item.profiles as { full_name: string } | null,
            })
          );
          setComments(mapped);
        }
      } catch {
        // Молча
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSending) return;

    setIsSending(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content: newComment.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      } else {
        setError(data.error || "Ошибка отправки");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Удалить комментарий?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      // Молча
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

      {isLoading ? (
        <div className="flex items-center gap-2 text-stone-400 mb-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          Загрузка...
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-xl bg-stone-50 border border-stone-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 text-xs font-semibold">
                        {(comment.profiles?.full_name || "А")[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-stone-900 text-sm">
                      {comment.profiles?.full_name || "Аноним"}
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

                {(user?.id === comment.author_id || isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-stone-400 mb-8 text-sm">
          Пока нет комментариев. Будьте первым!
        </p>
      )}

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

          <Button type="submit" disabled={isSending} size="sm">
            {isSending ? (
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
            <Button href="/auth/login" size="sm">Войти</Button>
            <Button href="/auth/register" variant="outline" size="sm">
              Регистрация
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}