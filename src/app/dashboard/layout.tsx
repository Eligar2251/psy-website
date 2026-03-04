"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login?redirect=/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 py-10 text-stone-500">
          Загрузка...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar profile={profile} isAdmin={profile?.role === "admin"} />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}