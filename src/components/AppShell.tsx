"use client";

import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </AuthProvider>
  );
}