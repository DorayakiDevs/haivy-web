import { useClient } from "@services/client";
import usePostgrestFilter from "./base";

export function getRawAppointments() {
  const { supabase } = useClient();
  const pr = supabase.from("appointment").select("*");
  return usePostgrestFilter(pr);
}
