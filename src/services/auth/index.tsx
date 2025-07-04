import { createContext, useEffect, useState } from "react";

import { useClient } from "..";

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

type T_Provider = {
  session: Session | null;
  user: User | null;
  loading?: boolean;
};

export const AuthContext = createContext<T_Provider | null>(null);

export function AuthProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const client = useClient();

  function handleAuthChange(_e: AuthChangeEvent, session: Session | null) {
    setSession(session);
    setUser(session?.user || null);
    // console.log(_e);
    setLoading(false);
  }

  useEffect(() => {
    const { data } = client.auth.onAuthStateChange(handleAuthChange);

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = { session, user };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
