"use client";

import { useState, FormEvent, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function ProfileSettingsForm() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name || "");
  }, [profile?.full_name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setStatus("loading");
    setMessage("");

    try {
      const name = fullName.trim();
      if (name.length < 2) {
        setStatus("error");
        setMessage("Имя должно содержать минимум 2 символа");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id);

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      await refreshProfile();
      setStatus("success");
      setMessage("Имя обновлено");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setMessage("Ошибка сети");
    }
  };

  if (isLoading) return <div className="text-stone-500">Загрузка...</div>;
  if (!user) return <div className="text-stone-500">Нужно войти</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={profile?.email || user.email || ""}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Имя
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white"
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