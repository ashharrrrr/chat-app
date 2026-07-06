import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | undefined;

export function getSupabaseAdmin() {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url) {
    throw new Error("SUPABASE_URL is not defined");
  }

  if (!key) {
    throw new Error("SUPABASE_SECRET_KEY is not defined");
  }

  supabaseAdmin = createClient(url, key);

  return supabaseAdmin;
}
