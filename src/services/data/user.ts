import type { User } from "@supabase/supabase-js";
import { useRPC } from "./base";

export function useUserList(q: string) {
  const data = useRPC<{ users: User[] }>(
    "query_account_information",
    { query: q, _offset: "0", _limit: "20" },
    !q
  );

  return data;
}
