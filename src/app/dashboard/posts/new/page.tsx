import { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase-server";
import PostEditor from "@/components/dashboard/PostEditor";

export const metadata: Metadata = {
  title: "Новая статья",
};

export default async function NewPostPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Новая статья
        </h1>
        <p className="text-stone-500 text-sm">Создайте новый пост для блога</p>
      </div>
      <PostEditor mode="create" />
    </div>
  );
}