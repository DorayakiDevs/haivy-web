import { useRPC } from "./base";

export function useUserList(q: string, limit = 20) {
  const data = useRPC<Haivy.User[]>("query_account_information", {
    query: q,
    _offset: "0",
    _limit: limit.toString() || "20",
  });

  return data;
}
