import { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase-server";
import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";

export const metadata: Metadata = {
  title: "Настройки профиля",
};

export default async function SettingsPage() {
  const { profile } = await getCurrentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Настройки профиля
        </h1>
        <p className="text-stone-500">Управление личными данными</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6 max-w-xl">
        <ProfileSettingsForm profile={profile} />
      </div>
    </div>
  );
}