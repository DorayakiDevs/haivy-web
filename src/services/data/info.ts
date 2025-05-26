import type { DatabaseColType } from "@services/global";
import { useRPC } from "./base";

type UserInfo = DatabaseColType<"accountdetails">;

export function useUserBasicInfo(uuid: string) {
  const data = useRPC<UserInfo>("get_user_basic_info", { uid: uuid }, !uuid);
  return data;
}
