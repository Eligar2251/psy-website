import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/supabase-server";
import { getPostById } from "@/lib/posts";
import PostEditor from "@/components/dashboard/PostEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Редактирование статьи",
};

export default async function EditPostPage({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

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