import { createContext, useEffect, useState } from "react";

import { useClient } from "..";

import type { AuthChangeEvent } from "@supabase/supabase-js";

type T_Provider = {};

export const DataContext = createContext<T_Provider | null>(null);

export function DataProvider(props: React.PropsWithChildren) {
  const client = useClient();

  const [authState, setAuthState] =
    useState<AuthChangeEvent>("INITIAL_SESSION");

  function handleAuthChange(e: AuthChangeEvent) {
    setAuthState(e);
  }

  useEffect(() => {
    const { data } = client.auth.onAuthStateChange(handleAuthChange);

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authState !== "SIGNED_IN") return;

    console.log();
  }, [authState]);

  const value = {};

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
}
