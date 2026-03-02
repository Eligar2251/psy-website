"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function CommentDeleteButton({
  commentId,
}: {
  commentId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Удалить комментарий?")) return;

    setIsDeleting(true);
    try {
      await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("Ошибка удаления");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
      title="Удалить"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}