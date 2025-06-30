import { useEffect, useState } from "react";
import SuperClient from "./create";

import { usePasswordSignIn } from "./auth/signin";
import { useSignOut } from "./auth/signout";
import { useSignUp } from "./auth/signup";
import { useOTPSignIn } from "./auth/otpsignin";

import { ClientProvider, type AccountType } from "services/client";

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthChangeEvent>("INITIAL_SESSION");
  const [account, setAccount] = useState<AccountType | null>(null);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const uuid = session?.user.id || "";

  useEffect(() => {
    async function loadAccountDetails(id?: string) {
      const { data } = await SuperClient.from("user_details")
        .select()
        .eq("user_id", id)
        .maybeSingle();

      setAccount(data);
    }

    function handleAuthChange(ass: AuthChangeEvent, nss: Session | null) {
      const nuuid = nss?.user.id;
      if (nuuid === uuid) {
        return;
      }

      setLoading(true);

      if (ass != state) {
        setState(ass);
        setSession(nss);
      }

      setAccount(null);
      loadAccountDetails(nss?.user.id);

      setLoading(false);
    }

    const { data } = SuperClient.auth.onAuthStateChange(handleAuthChange);
    return data.subscription.unsubscribe;
  }, [uuid]);

  const value = {
    supabase: SuperClient,
    session: session,
    loading: loading,
    account,
  };

  return <ClientProvider value={value}>{children}</ClientProvider>;
}

export { usePasswordSignIn, useSignUp, useSignOut, useOTPSignIn };
