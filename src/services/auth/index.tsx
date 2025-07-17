import { createContext, useEffect, useState } from "react";

import { useClient } from "..";

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

type T_Provider = {
  session: Session | null;
  user: User | null;
  userDetails: Haivy.User | null;
};

export const AuthContext = createContext<T_Provider | null>(null);

export function AuthProvider(props: React.PropsWithChildren) {
  const client = useClient();

  const [session, setSession] = useState<Session | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<Haivy.User | null>(null);

  function handleAuthChange(_e: AuthChangeEvent, session: Session | null) {
    setSession(session);
    setUser(session?.user || null);
    // console.log(_e);
  }

  useEffect(() => {
    const { data } = client.auth.onAuthStateChange(handleAuthChange);

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const USER_ID = user?.id || "";

  useEffect(() => {
    if (!USER_ID) return;
    const ctrl = new AbortController();

    async function load() {
      const { data } = await client
        .rpc("get_my_user_details")
        .abortSignal(ctrl.signal);

      if (ctrl.signal.aborted) {
        return;
      }

      setUserDetails(data ? data[0] : null);
    }

    load();

    return () => {
      ctrl.abort();
    };
  }, [USER_ID]);

  const value = { session, user, userDetails };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
