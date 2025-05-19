import { createClient } from "@supabase/supabase-js";

import { usePasswordSignIn } from "@auth/hooks/signin";
import { useSignOut } from "@auth/hooks/signout";
import { useSignUp } from "@auth/hooks/signup";
import { useOTPSignIn } from "@auth/hooks/otpsignin";

import { ClientProvider } from "@auth/client";
import { useEffect } from "react";

const { VITE_SUPABASE_URL: surl, VITE_SUPABASE_KEY: skey } = import.meta.env;
const supabaseClient = createClient(surl, skey);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log(
      "Client init, connected to " + surl,
      "| Key : " + skey.slice(0, 9) + "..."
    );
  }, []);

  return <ClientProvider value={supabaseClient}>{children}</ClientProvider>;
}

export { usePasswordSignIn, useSignUp, useSignOut, useOTPSignIn };
