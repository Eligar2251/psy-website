"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type AuthUser = { id: string; email?: string };

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
  const sb = useMemo(() => createClient(), []);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(
    async (uid: string, email?: string) => {
      try {
        // 1) пробуем получить профиль
        const { data: p1 } = await sb
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .maybeSingle();

        if (p1) {
          setProfile(p1 as Profile);
          return;
        }

        // 2) если профиля нет — создаём (нужно, чтобы policy profiles_insert_own была)
        await sb.from("profiles").insert({
          id: uid,
          email: email ?? "",
          full_name: "",
          role: "user",
        });

        // 3) читаем ещё раз
        const { data: p2 } = await sb
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .maybeSingle();

        setProfile((p2 as Profile) ?? null);
      } catch {
        // если что-то пошло не так — не ломаем UI
        setProfile(null);
      }
    },
    [sb]
  );

  const applySessionFast = useCallback(
    (session: Session | null) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        // профайл грузим в фоне, НЕ блокируем UI
        void loadProfile(session.user.id, session.user.email ?? undefined);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    },
    [loadProfile]
  );

  useEffect(() => {
    let alive = true;

    // страховка от вечной загрузки (если сеть/расширения ломают storage)
    const t = setTimeout(() => {
      if (alive) setIsLoading(false);
    }, 1500);

    (async () => {
      try {
        const { data } = await sb.auth.getSession();
        if (!alive) return;
        applySessionFast(data.session);
      } catch {
        if (alive) setIsLoading(false);
      } finally {
        clearTimeout(t);
      }
    })();

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      applySessionFast(session);
    });

    return () => {
      alive = false;
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, [sb, applySessionFast]);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    try {
      await sb.auth.signOut();
    } finally {
      window.location.href = "/";
    }
  }, [sb]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user.id, user.email);
  }, [user, loadProfile]);

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