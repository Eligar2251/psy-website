"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import PostEditor from "@/components/dashboard/PostEditor";

export default function NewPostPage() {
  const { isLoading, user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/auth/login?redirect=/dashboard/posts/new");
    else if (!isAdmin) router.replace("/dashboard");
  }, [isLoading, user, isAdmin, router]);

  if (isLoading) return <div className="text-stone-500">Загрузка...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Новая статья
        </h1>
      </div>
      <PostEditor mode="create" />
    </div>
  );
}