import { createContext, useContext } from "react";

import { type SupabaseClient } from "@supabase/supabase-js";

export const ClientContext = createContext<SupabaseClient | null>(null);
export const ClientProvider = ClientContext.Provider;
export const ClientConsumer = ClientContext.Consumer;

export function useClient(): SupabaseClient {
  const client = useContext(ClientContext);

  if (!client) {
    throw new Error("useClient must be used within ClientProvier");
  }

  return client;
}
