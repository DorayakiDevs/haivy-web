import { createContext, useContext } from "react";

import { type Session, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "types/db.types";

export type AccountType = Database["public"]["Tables"]["user_details"]["Row"];

type T_ServiceClient = {
  supabase: SupabaseClient;
  session: Session | null;
  loading: boolean;
  account: AccountType | null;
};

export const ClientContext = createContext<T_ServiceClient | null>(null);
export const ClientProvider = ClientContext.Provider;
export const ClientConsumer = ClientContext.Consumer;

export function useClient(): T_ServiceClient {
  const client = useContext(ClientContext);

  if (!client) {
    throw new Error("useClient must be used within ClientProvier");
  }

  return client;
}
