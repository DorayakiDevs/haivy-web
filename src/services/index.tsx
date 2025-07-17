import { createContext, useContext } from "react";
import { SuperClient as Client } from "./init";

import { AuthContext, AuthProvider } from "./auth";
import { DataContext, DataProvider } from "./data";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "types/db.types";

type T_Context = SupabaseClient<Database>;

const ClientContext = createContext<T_Context | null>(null);

export function ServiceProvider(props: React.ChildrenProps) {
  return (
    <ClientContext.Provider value={Client}>
      <AuthProvider>
        <DataProvider>{props.children}</DataProvider>
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export function useServices() {
  const client = useContext(ClientContext);
  const auth = useContext(AuthContext);
  const data = useContext(DataContext);

  if (!client) {
    throw new Error("Service 'client' context is missing!");
  }

  if (!auth) {
    throw new Error("Service 'auth' context is missing!");
  }

  if (!data) {
    throw new Error("Service 'data' context is missing!");
  }

  return { client, data, auth };
}

export function useClient() {
  const data = useContext(ClientContext);

  if (!data) {
    throw new Error("Client context data is missing!");
  }

  return data;
}
