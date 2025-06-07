import { useRPC } from "./base";

export function getUserInfo(p_id: string | null) {
  const data = useRPC<Haivy.User>("get_account_details", { p_id }, !p_id);
  return data;
}

export function getDisplayName(p_id: string | null) {
  const data = useRPC<string>("get_display_name", { p_id }, !p_id);
  return data;
}
