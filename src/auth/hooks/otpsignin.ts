import { useCallback, useState } from "react";

import {
  type AuthError,
  type AuthOtpResponse,
  type AuthResponse,
  type Session,
  type User,
} from "@supabase/supabase-js";

import { useClient } from "@auth/client";

type T_SignInState = {
  error: AuthError | null;
  session: Session | null;
  user: User | null;
  fetching: boolean;
  phoneNumber?: string;
};

type T_SignInOptions = {
  redirectTo?: string;
  scope?: "global" | "local" | "others";
};

const initialState = {
  fetching: false,
  phoneNumber: "",

  session: null,
  user: null,
  error: null,
};

type T_RetVal = [
  state: T_SignInState,
  execute: (phone: string) => Promise<AuthOtpResponse>,
  verify: (token: string) => Promise<AuthResponse>,
  reset: () => void
];

export function useOTPSignIn(options: T_SignInOptions = {}): T_RetVal {
  const client = useClient();
  const [state, setState] = useState<T_SignInState>({ ...initialState });

  async function authSignInOTP(phoneNumber: string) {
    setState({ ...initialState, fetching: true });

    const opt = { phone: phoneNumber, ...options };
    const res = await client.auth.signInWithOtp(opt);

    setState({
      fetching: false,
      phoneNumber: res.error ? "" : phoneNumber,

      session: null,
      user: null,
      error: res.error || null,
    });

    return res;
  }

  async function authVerifyOTP(token: string) {
    setState((s) => ({ ...s, fetching: true }));

    const res = await client.auth.verifyOtp({
      phone: state.phoneNumber || "",
      token,
      type: "sms",
    });

    setState({
      fetching: false,

      session: res.data.session,
      user: res.data.user,

      error: res.error || null,
    });

    return res;
  }

  async function reset() {
    setState((s) => ({ ...s, phoneNumber: "" }));
  }

  const execute = useCallback(authSignInOTP, [client, options]);
  const verify = useCallback(authVerifyOTP, [client, options]);

  return [state, execute, verify, reset];
}
