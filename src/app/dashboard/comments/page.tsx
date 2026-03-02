import { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { isAdmin, createServerSupabase } from "@/lib/supabase-server";
import CommentDeleteButton from "@/components/dashboard/CommentDeleteButton";

export const metadata: Metadata = {
  title: "Комментарии",
};

export default async function CommentsPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  const supabase = await createServerSupabase();

  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles (
        full_name,
        email
      ),
      posts (
        title,
        slug
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const allComments = comments || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Комментарии
        </h1>
        <p className="text-stone-500 text-sm">{allComments.length} комментариев</p>
      </div>

      {allComments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-stone-900 mb-2">
            Комментариев пока нет
          </h3>
        </div>
      ) : (
        <div className="space-y-3">
          {allComments.map((comment: Record<string, unknown>) => {
            const profiles = comment.profiles as Record<string, string> | null;
            const posts = comment.posts as Record<string, string> | null;

            return (
              <div
                key={comment.id as string}
                className="bg-white rounded-2xl shadow-soft p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span className="font-medium text-stone-900">
                        {profiles?.full_name || "Аноним"}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-400 text-xs">
                        {new Date(comment.created_at as string).toLocaleDateString(
                          "ru-RU"
                        )}
                      </span>
                    </div>
                    <p className="text-stone-700 text-sm leading-relaxed mb-2">
                      {comment.content as string}
                    </p>
                    {posts?.title && (
                      <p className="text-xs text-stone-400">
                        К статье:{" "}
                        <a
                          href={`/blog/${posts.slug}`}
                          className="text-primary-600 hover:underline"
                          target="_blank"
                        >
                          {posts.title}
                        </a>
                      </p>
                    )}
                  </div>
                  <CommentDeleteButton commentId={comment.id as string} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}