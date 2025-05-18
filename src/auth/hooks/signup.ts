import { useCallback, useState } from "react";

import {
  type AuthError,
  type AuthResponse,
  type Session,
  type User,
} from "@supabase/supabase-js";

import { useClient } from "@auth/client";

type T_SignUpState = {
  error: AuthError | null;
  session: Session | null;
  user: User | null;
  fetching: boolean;
};

type T_SignUpOptions = {
  redirectTo?: string;
};

const initialState = {
  fetching: false,
  session: null,
  user: null,
  error: null,
};

type T_RetVal = [
  T_SignUpState,
  (email: string, password: string) => Promise<AuthResponse>
];

export function useSignUp(options: T_SignUpOptions = {}): T_RetVal {
  const client = useClient();
  const [state, setState] = useState<T_SignUpState>({ ...initialState });

  async function executeFunc(email: string, password: string) {
    setState({ ...initialState, fetching: true });

    const opt = { email, password, ...options };
    const res = await client.auth.signUp(opt);

    setState({
      fetching: false,
      session: res.data.session,
      user: res.data.user,
      error: res.error || null,
    });

    return res;
  }

  const execute = useCallback(executeFunc, [client, options]);
  return [state, execute];
}
