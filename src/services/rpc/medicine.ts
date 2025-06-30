import { useRPC } from "./base";

export function getMedicines(query: string) {
  return useRPC<Haivy.Medicine[]>("query_medicines", {
    query: query,
    _offset: 0,
    _limit: 60,
  });
}
