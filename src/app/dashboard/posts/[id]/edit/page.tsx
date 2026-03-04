"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import type { DBPost } from "@/lib/types";
import PostEditor from "@/components/dashboard/PostEditor";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, user, isAdmin } = useAuth();
  const supabase = createClient();

  const [post, setPost] = useState<DBPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/auth/login?redirect=/dashboard/posts/${id}/edit`);
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        router.replace("/dashboard/posts");
        return;
      }

      setPost(data as DBPost);
      setLoading(false);
    })();
  }, [isLoading, user, isAdmin, id, router, supabase]);

  if (isLoading || loading) return <div className="text-stone-500">Загрузка...</div>;
  if (!post) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Редактирование статьи
        </h1>
        <p className="text-stone-500 text-sm">/{post.slug}</p>
      </div>

      <PostEditor mode="edit" post={post} />
    </div>
  );
}