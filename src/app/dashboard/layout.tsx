import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase-server";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar
            profile={profile}
            isAdmin={profile?.role === "admin"}
          />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}