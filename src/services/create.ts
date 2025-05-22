import { createClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL: surl, VITE_SUPABASE_KEY: skey } = import.meta.env;
const supabaseClient = createClient(surl, skey);

export default supabaseClient;