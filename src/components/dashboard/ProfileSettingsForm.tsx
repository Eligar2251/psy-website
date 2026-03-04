"use client";

import { useState, FormEvent } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth-context";
import type { Profile } from "@/lib/types";

export default function ProfileSettingsForm({
  profile,
}: {
  profile: Profile | null;
}) {
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const supabase = getSupabaseBrowser();

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", profile?.id);

      if (error) {
        setStatus("error");
        setMessage("Ошибка сохранения");
        return;
      }

      await refreshProfile();
      setStatus("success");
      setMessage("Профиль обновлён");

      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setMessage("Ошибка соединения");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={profile?.email || ""}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed"
        />
        <p className="text-xs text-stone-400 mt-1">Email нельзя изменить</p>
      </div>

      <div>
        <label
          htmlFor="settings-name"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Имя
        </label>
        <input
          id="settings-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
        />
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {message}
        </div>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Сохраняю...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Сохранить
          </>
        )}
      </Button>
    </form>
  );
}