import type { DatabaseColType } from "@services/global";
import { useRPC } from "./base";

type UserInfo = DatabaseColType<"accountdetails">;

export function useUserInfo(uuid: string) {
  const data = useRPC<UserInfo>(
    "get_account_details",
    { acc_uid: uuid },
    !uuid
  );
  return data;
}
