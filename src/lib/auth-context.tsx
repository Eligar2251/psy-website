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
import { createClient } from "@/lib/supabase";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

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
  const [sb, setSb] = useState<SupabaseClient | null>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // создаём клиента строго на клиенте
  useEffect(() => {
    setSb(createClient());
  }, []);

  const loadProfile = useCallback(
    async (client: SupabaseClient, uid: string, email?: string) => {
      try {
        const { data: p1 } = await client
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .maybeSingle();

        if (p1) {
          setProfile(p1 as Profile);
          return;
        }

        // если нет профиля — создаём (нужна policy profiles_insert_own)
        await client.from("profiles").insert({
          id: uid,
          email: email ?? "",
          full_name: "",
          role: "user",
        });

        const { data: p2 } = await client
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .maybeSingle();

        setProfile((p2 as Profile) ?? null);
      } catch {
        setProfile(null);
      }
    },
    []
  );

  const applySession = useCallback(
    (client: SupabaseClient, session: Session | null) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        void loadProfile(client, session.user.id, session.user.email ?? undefined);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    },
    [loadProfile]
  );

  useEffect(() => {
    if (!sb) return;

    let alive = true;

    (async () => {
      try {
        const { data } = await sb.auth.getSession();
        if (!alive) return;
        applySession(sb, data.session);
      } catch {
        if (alive) setIsLoading(false);
      }
    })();

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      applySession(sb, session);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [sb, applySession]);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);

    if (sb) {
      await sb.auth.signOut();
    }

    window.location.href = "/";
  }, [sb]);

  const refreshProfile = useCallback(async () => {
    if (!sb || !user) return;
    await loadProfile(sb, user.id, user.email);
  }, [sb, user, loadProfile]);

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