import { useCallback, useState } from "react";

import {
  type AuthError,
  type AuthTokenResponsePassword,
  type Session,
  type User,
} from "@supabase/supabase-js";

import { useClient } from "services/client";

type T_SignInState = {
  error: AuthError | null;
  session: Session | null;
  user: User | null;
  fetching: boolean;
};

type T_SignInOptions = {
  redirectTo?: string;
  scope?: "global" | "local" | "others";
};

const initialState = {
  fetching: false,
  session: null,
  user: null,
  error: null,
};

type T_RetVal = [
  T_SignInState,
  (email: string, password: string) => Promise<AuthTokenResponsePassword>
];

export function usePasswordSignIn(options: T_SignInOptions = {}): T_RetVal {
  const {supabase: client} = useClient();
  const [state, setState] = useState<T_SignInState>({ ...initialState });

  async function authSignIn(email: string, password: string) {
    setState({ ...initialState, fetching: true });

    const opt = { email, password, ...options };
    const res = await client.auth.signInWithPassword(opt);

    setState({
      fetching: false,

      session: res.data.session,
      user: res.data.user,

      error: res.error || null,
    });

    return res;
  }

  const execute = useCallback(authSignIn, [client, options]);
  return [state, execute];
}
