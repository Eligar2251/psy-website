"use client";

import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-stone-900 mb-1">
          Настройки профиля
        </h1>
        <p className="text-stone-500">Изменение имени</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6 max-w-xl">
        <ProfileSettingsForm />
      </div>
    </div>
  );
}