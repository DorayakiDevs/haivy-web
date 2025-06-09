import { useClient } from "@services/client";
import usePostgrestFilter, { getFirstResult } from "./base";

export function getRawAccounts() {
  const { supabase } = useClient();
  const filter = supabase.from("accountdetails").select("*").limit(20);
  return usePostgrestFilter(filter);
}

export function getAccountDetails(id: string) {
  const { supabase } = useClient();
  const filter = supabase
    .from("accountdetails")
    .select("*")
    .eq("account_uid", id);

  const data = usePostgrestFilter(filter);
  return getFirstResult(data);
}

export function getStaffInfo(staffId: string) {
  const { supabase } = useClient();
  const filter = supabase.from("staff").select("*").eq("staff_id", staffId);

  const data = usePostgrestFilter(filter);
  return getFirstResult(data);
}
