"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Profile } from "@/lib/types";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const sb = getSupabaseBrowser();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await sb.from("profiles").select("*").eq("id", userId).single();
      if (data) setProfile(data as Profile);
    },
    [sb]
  );

  const applySession = useCallback(
    async (session: Session | null) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    },
    [fetchProfile]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await sb.auth.getSession();
        if (!alive) return;
        await applySession(data.session);
      } catch {
        if (alive) setIsLoading(false);
      }
    })();

    const { data: sub } = sb.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;
      await applySession(session);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [sb, applySession]);

  const signOut = useCallback(async () => {
    // UI сброс сразу
    setUser(null);
    setProfile(null);

    await sb.auth.signOut();

    // надежный выход без “зависаний”
    window.location.href = "/";
  }, [sb]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin: profile?.role === "admin",
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}