import { useCallback, useState } from "react";

import { type AuthError } from "@supabase/supabase-js";

import { useClient } from "services/client";

type T_SignOutState = {
  error: AuthError | null;
  fetching: boolean;
};

type T_SignOutOptions = {
  scope?: "global" | "local" | "others";
};

const initialState = {
  fetching: false,
  error: null,
};

type T_RetVal = [
  state: T_SignOutState,
  execute: () => Promise<{ error: AuthError | null }>
];

export function useSignOut(options: T_SignOutOptions = {}): T_RetVal {
  const {supabase: client} = useClient();
  const [state, setState] = useState<T_SignOutState>({ ...initialState });

  async function executeFunc() {
    setState({ ...initialState, fetching: true });

    const opt = { ...options };
    const res = await client.auth.signOut(opt);

    setState({ fetching: false, error: res.error || null });
    return res;
  }

  const execute = useCallback(executeFunc, [client, options]);
  return [state, execute];
}
