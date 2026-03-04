"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Trash2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function ReviewModerateActions({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  const handleApprove = async () => {
    setIsLoading(true);
    await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", reviewId);
    router.refresh();
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    await supabase
      .from("reviews")
      .update({ is_approved: false, is_visible: false })
      .eq("id", reviewId);
    router.refresh();
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Удалить этот отзыв навсегда?")) return;
    setIsLoading(true);
    await supabase.from("reviews").delete().eq("id", reviewId);
    router.refresh();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {!isApproved && (
        <button
          onClick={handleApprove}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
          title="Одобрить"
        >
          <Check className="w-3.5 h-3.5" />
          Одобрить
        </button>
      )}

      {isApproved && (
        <button
          onClick={handleReject}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
          title="Скрыть"
        >
          <X className="w-3.5 h-3.5" />
          Скрыть
        </button>
      )}

      <button
        onClick={handleDelete}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
        title="Удалить"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Удалить
      </button>
    </div>
  );
}